import crypto from "node:crypto";
import dns from "node:dns";
import tls from "node:tls";
import mongoose from "mongoose";
import { env } from "./env.js";

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

export async function connectDB(): Promise<void> {
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

  try {
    // Fail fast (10s) instead of the 30s default, and fail LOUD - but do not
    // process.exit() here. A dead DB used to take the entire HTTP server
    // down with it, so the client saw "can't reach the API at all" with zero
    // information. Now the server stays up, /api/v1/health reports the real
    // db state, and only DB-backed requests (register, login, uploads...)
    // fail individually with a clear error - everything else (branding,
    // static pages) keeps working.
    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 10000,
      secureContext: legacyRenegotiationSecureContext,
    });
  } catch (err) {
    console.error("=".repeat(70));
    console.error("[db] COULD NOT CONNECT TO MONGODB - the server is still running,");
    console.error("     but every route that touches the database will fail until");
    console.error("     this is fixed. Common causes:");
    console.error("     1. Atlas free-tier cluster paused itself from inactivity");
    console.error("        -> open Atlas, click the cluster, click Resume");
    console.error("     2. Network Access list doesn't include your current IP");
    console.error("        -> Atlas -> Network Access -> confirm 0.0.0.0/0 is present");
    console.error("     3. MONGODB_URI in server/.env has a stale/wrong password");
    console.error("     4. No internet connection from this machine right now");
    console.error("Raw error:", err instanceof Error ? err.message : err);
    console.error("=".repeat(70));
  }
}
