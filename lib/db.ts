import crypto from "node:crypto";
import dns from "node:dns";
import tls from "node:tls";
import mongoose from "mongoose";
import { env } from "./env";

// Node 17+ ships OpenSSL 3.0, which by default refuses to complete a TLS
// handshake with a peer that only supports "legacy" (pre-2010) secure
// renegotiation, rejecting it with a generic "SSL alert number 80
// (internal error)" instead of a clear message. Documented, MongoDB-
// endorsed workaround for that specific family of failures - see
// https://www.mongodb.com/docs/drivers/node/current/security/tls/#workaround-for-an--unsafe-legacy-renegotiation-disabled--error
//
// Confirmed via Netlify's function logs that this isn't just a home-network
// thing - it happens identically from Netlify Functions' Node/OpenSSL
// build talking to this Atlas cluster (`[db] connection error: ...SSL
// routines:ssl3_read_bytes:tlsv1 alert internal error...SSL alert number
// 80`, with all 3 shard hosts correctly resolved via SRV first - so this
// is a TLS-handshake problem, not a DNS or IP-allowlist one). So this is
// applied by default now, not gated behind a fallback that might never
// trigger.
const legacyRenegotiationSecureContext = tls.createSecureContext({
  secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
  minVersion: "TLSv1.2",
  maxVersion: "TLSv1.2",
});

// Next.js reloads modules on every dev hot-reload and can invoke this file
// fresh on every serverless invocation in production - without caching the
// connection promise on `global`, every request would open a brand new
// connection to Atlas and quickly exhaust the free-tier connection limit.
// This is the standard Next.js + Mongoose pattern for exactly that reason.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

let dnsOverrideApplied = false;
function applyDnsServerOverride() {
  if (dnsOverrideApplied) return;
  dnsOverrideApplied = true;
  // `mongodb+srv://` connection strings require a DNS SRV + TXT lookup
  // before any actual database connection happens. Plenty of ISP/router
  // DNS resolvers don't support SRV record queries at all and fail with
  // "querySrv ECONNREFUSED" - nothing to do with credentials or IP
  // allowlists. Forcing Node to use public resolvers that do support SRV
  // lookups sidesteps that, without any OS-level network changes. Only
  // applied as a fallback (see below) since normal DNS is fine almost
  // everywhere, including Netlify Functions - this was never the problem
  // there.
  dns.setServers(["1.1.1.1", "8.8.8.8", "1.0.0.1", "8.8.4.4"]);
  dns.setDefaultResultOrder("ipv4first");
}

// Some ISPs/routers/campus networks block or actively refuse outbound
// DNS-over-UDP:53 to third-party resolvers (including the 1.1.1.1/8.8.8.8
// override above) while leaving normal HTTPS traffic completely untouched.
// That shows up as `querySrv ECONNREFUSED` and has nothing to do with
// credentials or Atlas config - the SRV/TXT lookup that `mongodb+srv://`
// requires never even reaches a DNS server. DNS-over-HTTPS (DoH) resolves
// the same records over port 443 instead, which almost never gets blocked
// separately from the rest of the web. Used as a last-resort fallback: we
// resolve the SRV+TXT records via DoH ourselves and reconnect using the
// equivalent standard `mongodb://host1,host2,host3/...` string, which
// requires no SRV lookup at all (only ordinary A-record lookups, which are
// essentially never blocked).
async function dohQuery(name: string, type: "SRV" | "TXT"): Promise<any[]> {
  const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, {
    headers: { accept: "application/dns-json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`DoH query failed (${res.status})`);
  const json = await res.json();
  return json.Answer ?? [];
}

async function buildStandardUriViaDoH(srvUri: string): Promise<string | null> {
  try {
    const url = new URL(srvUri);
    const host = url.hostname;

    const [srvAnswers, txtAnswers] = await Promise.all([dohQuery(`_mongodb._tcp.${host}`, "SRV"), dohQuery(host, "TXT")]);

    const hosts = srvAnswers
      .map((a) => {
        // SRV record data: "<priority> <weight> <port> <target>"
        const parts = String(a.data).trim().split(/\s+/);
        const port = parts[2];
        const target = parts[3]?.replace(/\.$/, "");
        return target && port ? `${target}:${port}` : null;
      })
      .filter((h): h is string => Boolean(h));
    if (hosts.length === 0) return null;

    const params = new URLSearchParams(url.search);
    for (const a of txtAnswers) {
      const txt = String(a.data).replace(/^"|"$/g, "");
      for (const pair of txt.split("&")) {
        const [k, v] = pair.split("=");
        if (k && v && !params.has(k)) params.set(k, v);
      }
    }
    if (!params.has("ssl") && !params.has("tls")) params.set("tls", "true");

    const auth = url.username ? `${decodeURIComponent(url.username)}:${decodeURIComponent(url.password)}@` : "";
    return `mongodb://${auth}${hosts.join(",")}${url.pathname}?${params.toString()}`;
  } catch (err) {
    console.error("[db] DoH SRV fallback resolution failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

function connectWithLegacyTlsWorkaround(uri: string) {
  return mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    secureContext: legacyRenegotiationSecureContext,
  });
}

// `MongooseServerSelectionError`'s top-level `.message` is a generic
// "could not connect to any servers" string that doesn't reflect the real
// per-server cause - the actual per-shard error (DNS, TLS, auth, etc.)
// only shows up nested in `.reason`/`.cause`'s server descriptions, or via
// the separate `connection.on('error', ...)` event. Stringify everything
// we can reach so the SRV-DNS-specific fallback below actually has a
// chance to trigger when it's genuinely a DNS problem, instead of silently
// never firing.
function errorText(err: unknown): string {
  const e = err as any;
  const parts = [e?.code, e?.message, e?.reason?.error?.message, JSON.stringify(e?.reason?.servers ?? {})];
  return parts.filter(Boolean).join(" | ");
}

function looksLikeSrvDnsFailure(err: unknown): boolean {
  return /querySrv|ENOTFOUND.*_mongodb\._tcp|ECONNREFUSED.*_mongodb\._tcp/i.test(errorText(err));
}

export async function connectDB(): Promise<typeof mongoose> {
  if (global._mongooseConn) return global._mongooseConn;

  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () => {
    console.log(`[db] connected -> ${mongoose.connection.name}`);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("[db] disconnected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("[db] connection error:", err.message);
  });

  global._mongooseConn = connectWithLegacyTlsWorkaround(env.mongodbUri)
    .catch(async (err) => {
      if (!env.mongodbUri.startsWith("mongodb+srv://") || !looksLikeSrvDnsFailure(err)) throw err;

      console.warn("[db] SRV DNS lookup failed - retrying with a DNS server override, then DNS-over-HTTPS...");
      applyDnsServerOverride();
      try {
        return await connectWithLegacyTlsWorkaround(env.mongodbUri);
      } catch (retryErr) {
        if (!looksLikeSrvDnsFailure(retryErr)) throw retryErr;
        const fallbackUri = await buildStandardUriViaDoH(env.mongodbUri);
        if (!fallbackUri) throw retryErr;
        const conn = await connectWithLegacyTlsWorkaround(fallbackUri);
        console.log("[db] connected via DoH-resolved standard connection string");
        return conn;
      }
    })
    .catch((err) => {
      console.error("=".repeat(70));
      console.error("[db] COULD NOT CONNECT TO MONGODB - common causes:");
      console.error("     1. Atlas free-tier cluster paused itself from inactivity");
      console.error("        -> open Atlas, click the cluster, click Resume");
      console.error("     2. Network Access list doesn't include your current IP/host");
      console.error("        -> Atlas -> Network Access -> confirm 0.0.0.0/0 is present");
      console.error("     3. MONGODB_URI env var has a stale/wrong password");
      console.error("     4. A DNS/TLS network-path issue that even the fallbacks couldn't work around");
      console.error("Raw error:", err instanceof Error ? err.message : err);
      console.error("=".repeat(70));
      global._mongooseConn = undefined; // allow a retry on the next call instead of caching the failure forever
      throw err;
    });

  return global._mongooseConn;
}
