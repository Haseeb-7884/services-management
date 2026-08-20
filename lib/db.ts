import crypto from "node:crypto";
import dns from "node:dns";
import tls from "node:tls";
import mongoose from "mongoose";
import { env } from "./env";

// IMPORTANT: none of the DNS/TLS overrides below run by default anymore.
// They exist only as fallbacks for specific broken-network symptoms (see
// each function below) and are applied lazily, only after a plain
// `mongoose.connect()` with Node's normal defaults has already failed with
// a matching error signature. Earlier this file applied `dns.setServers()`
// and a custom TLS `secureContext` unconditionally, at module load time,
// on every environment - which fixed one specific home-network problem but
// broke connections on hosts (e.g. Netlify Functions) where the plain
// defaults would otherwise have "just worked" like any other Next.js +
// Mongo deployment. Always try the boring, standard path first.

let dnsOverrideApplied = false;
function applyHomeNetworkDnsOverride() {
  if (dnsOverrideApplied) return;
  dnsOverrideApplied = true;
  // `mongodb+srv://` connection strings require a DNS SRV + TXT lookup
  // before any actual database connection happens. Plenty of ISP/router
  // DNS resolvers don't support SRV record queries at all and fail with
  // "querySrv ECONNREFUSED" - nothing to do with credentials or IP
  // allowlists. Forcing Node to use public resolvers that do support SRV
  // lookups sidesteps that, without any OS-level network changes.
  dns.setServers(["1.1.1.1", "8.8.8.8", "1.0.0.1", "8.8.4.4"]);
  // Prefer IPv4 for the actual shard host connections. Broken/partial IPv6
  // routes are a common cause of TLS handshakes dying with a generic
  // "internal error" alert on some home/campus networks.
  dns.setDefaultResultOrder("ipv4first");
}

// Node 17+ ships OpenSSL 3.0, which by default refuses to complete a TLS
// handshake with a peer that only supports "legacy" (pre-2010) secure
// renegotiation, rejecting it with a generic "SSL alert number 80
// (internal error)" instead of a clear message. Documented, MongoDB-
// endorsed workaround for that specific family of failures - see
// https://www.mongodb.com/docs/drivers/node/current/security/tls/#workaround-for-an--unsafe-legacy-renegotiation-disabled--error
// Only used as a fallback, not the default secureContext, since forcing
// TLS 1.2-only isn't appropriate on networks that don't need it.
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

function connectPlain(uri: string) {
  return mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
}

function connectWithLegacyTlsWorkaround(uri: string) {
  return mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    secureContext: legacyRenegotiationSecureContext,
  });
}

// Only worth retrying with the DNS/TLS workarounds for errors that actually
// look like a DNS-path or TLS-handshake problem. A real auth failure or
// Atlas IP-allowlist rejection won't be fixed by any of this, so don't burn
// an extra 10s timeout chasing it.
function looksLikeDnsOrTlsPathIssue(err: unknown): boolean {
  const text = String((err as any)?.code ?? (err as Error)?.message ?? err ?? "");
  return /querySrv|ENOTFOUND|ECONNREFUSED|ETIMEOUT|internal error|legacy renegotiation|SSL alert/i.test(text);
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

  global._mongooseConn = connectPlain(env.mongodbUri)
    .catch(async (err) => {
      if (!looksLikeDnsOrTlsPathIssue(err)) throw err;

      console.warn("[db] plain connect failed with a DNS/TLS-looking error - retrying with home-network workarounds...");
      applyHomeNetworkDnsOverride();
      try {
        const conn = await connectWithLegacyTlsWorkaround(env.mongodbUri);
        console.log("[db] connected using DNS-override + legacy-TLS fallback");
        return conn;
      } catch (retryErr) {
        if (env.mongodbUri.startsWith("mongodb+srv://") && looksLikeDnsOrTlsPathIssue(retryErr)) {
          console.warn("[db] SRV DNS lookup still failing (blocked UDP:53?) - retrying via DNS-over-HTTPS fallback...");
          const fallbackUri = await buildStandardUriViaDoH(env.mongodbUri);
          if (fallbackUri) {
            const conn = await connectWithLegacyTlsWorkaround(fallbackUri);
            console.log("[db] connected via DoH-resolved standard connection string");
            return conn;
          }
        }
        throw retryErr;
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
