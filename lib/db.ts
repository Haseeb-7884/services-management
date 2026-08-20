import crypto from "node:crypto";
import dns from "node:dns";
import tls from "node:tls";
import mongoose from "mongoose";
import { env } from "./env";

// `mongodb+srv://` connection strings require a DNS SRV + TXT lookup before
// any actual database connection happens. Plenty of ISP/router-provided DNS
// resolvers don't support SRV record queries at all and fail with
// "querySrv ECONNREFUSED" - which has nothing to do with credentials, IP
// allowlists, or anything Mongo-side. Forcing Node to use public DNS
// resolvers that are known to support SRV lookups sidesteps that entirely,
// without requiring any OS-level network settings changes.
dns.setServers(["1.1.1.1", "8.8.8.8", "1.0.0.1", "8.8.4.4"]);

// Prefer IPv4 for the actual shard host connections (not the SRV/TXT lookup
// itself). Broken or partially-configured IPv6 routes are a common,
// project-agnostic-looking cause of TLS handshakes failing with a generic
// "internal error" alert on some home/campus networks - the handshake
// reaches the server over IPv6 and dies partway through, which looks
// identical to a driver/credentials bug from the Node side.
dns.setDefaultResultOrder("ipv4first");

// Node 17+ ships OpenSSL 3.0, which by default refuses to complete a TLS
// handshake with any peer that only supports "legacy" (pre-2010) secure
// renegotiation - and rejects it with a generic, unhelpful alert rather than
// a clear message. This shows up as "SSL alert number 80 (internal error)"
// or "unsafe legacy renegotiation disabled" depending on which side notices
// first. It's a documented, MongoDB-endorsed workaround for exactly this
// family of Node-driver-vs-network-path TLS failures - see
// https://www.mongodb.com/docs/drivers/node/current/security/tls/#workaround-for-an--unsafe-legacy-renegotiation-disabled--error
// Also pin to TLS 1.2 only. TLS 1.3's handshake is structurally different
// (encrypted extensions, session tickets, 0-RTT) and is a well-known trigger
// for older DPI/firewall middleboxes to send back a bare "internal error"
// alert instead of passing the handshake through - which matches this error
// showing up identically on a completely different connection path (SRV vs
// direct-to-shard). TLS 1.2 is still fully secure and is what most
// middleboxes of this kind understand correctly.
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
// separately from the rest of the web. When the normal SRV connect fails,
// we resolve the SRV+TXT records via DoH ourselves and reconnect using the
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

async function connectWithUri(uri: string) {
  return mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    secureContext: legacyRenegotiationSecureContext,
  });
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

  global._mongooseConn = connectWithUri(env.mongodbUri)
    .catch(async (err) => {
      const isSrvDnsFailure = env.mongodbUri.startsWith("mongodb+srv://") && /querySrv|ENOTFOUND|ECONNREFUSED|ETIMEOUT/i.test(String(err?.code ?? err?.message ?? ""));

      if (isSrvDnsFailure) {
        console.warn("[db] SRV DNS lookup failed (blocked UDP:53?) - retrying via DNS-over-HTTPS fallback...");
        const fallbackUri = await buildStandardUriViaDoH(env.mongodbUri);
        if (fallbackUri) {
          try {
            const conn = await connectWithUri(fallbackUri);
            console.log("[db] connected via DoH-resolved standard connection string");
            return conn;
          } catch (fallbackErr) {
            console.error("[db] DoH fallback connection also failed:", fallbackErr instanceof Error ? fallbackErr.message : fallbackErr);
          }
        }
      }

      console.error("=".repeat(70));
      console.error("[db] COULD NOT CONNECT TO MONGODB - common causes:");
      console.error("     1. Atlas free-tier cluster paused itself from inactivity");
      console.error("        -> open Atlas, click the cluster, click Resume");
      console.error("     2. Network Access list doesn't include your current IP/host");
      console.error("        -> Atlas -> Network Access -> confirm 0.0.0.0/0 is present");
      console.error("     3. MONGODB_URI env var has a stale/wrong password");
      console.error("     4. Your network is blocking outbound DNS SRV lookups AND DoH");
      console.error("        (uncommon, but the DoH fallback above already tried to work around it)");
      console.error("Raw error:", err instanceof Error ? err.message : err);
      console.error("=".repeat(70));
      global._mongooseConn = undefined; // allow a retry on the next call instead of caching the failure forever
      throw err;
    });

  return global._mongooseConn;
}
