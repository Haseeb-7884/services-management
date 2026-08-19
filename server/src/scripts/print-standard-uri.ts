import dns from "node:dns/promises";
import "dotenv/config";

/**
 * Run with: npx tsx src/scripts/print-standard-uri.ts
 *
 * Converts the mongodb+srv:// URI in .env into the older, explicit-host
 * "standard" connection string format (mongodb://host1,host2,host3/...).
 *
 * Why this exists: mongodb+srv:// requires a DNS SRV + TXT lookup on every
 * connection attempt, on top of the TLS handshake itself. If either step is
 * flaky on a given network (as we've seen - querySrv failures, then TLS
 * alert 80), swapping to the standard format removes the SRV/TXT step
 * entirely and connects directly to the known hosts. This script does the
 * SRV/TXT lookup once, so you don't have to do it by hand.
 */

dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.startsWith("mongodb+srv://")) {
    console.error("MONGODB_URI in .env is missing or isn't a mongodb+srv:// URI - nothing to convert.");
    process.exit(1);
  }

  const match = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(\/[^?]*)?(\?.*)?$/);
  if (!match) {
    console.error("Couldn't parse MONGODB_URI - expected mongodb+srv://user:pass@host/db?params");
    process.exit(1);
  }
  const [, user, pass, host, dbPath = "", query = ""] = match;

  console.log(`Resolving SRV + TXT records for ${host} via 1.1.1.1 / 8.8.8.8 ...`);

  const srvRecords = await dns.resolveSrv(`_mongodb._tcp.${host}`);
  let txt: string[] = [];
  try {
    const txtRecords = await dns.resolveTxt(host);
    txt = txtRecords.flat();
  } catch {
    // TXT record is optional (just carries default query params) - fine if missing.
  }

  const hosts = srvRecords
    .sort((a, b) => a.priority - b.priority || a.weight - b.weight)
    .map((r) => `${r.name}:${r.port}`)
    .join(",");

  const txtParams = new URLSearchParams(txt.join("&"));
  const queryParams = new URLSearchParams(query.replace(/^\?/, ""));

  const merged = new URLSearchParams();
  for (const [k, v] of txtParams) merged.set(k, v);
  for (const [k, v] of queryParams) merged.set(k, v);
  merged.set("ssl", "true");
  if (!merged.has("replicaSet") && txtParams.has("replicaSet")) {
    merged.set("replicaSet", txtParams.get("replicaSet")!);
  }
  if (!merged.has("authSource")) merged.set("authSource", "admin");

  const standardUri = `mongodb://${user}:${pass}@${hosts}${dbPath}?${merged.toString()}`;

  console.log("\nStandard (non-SRV) connection string:\n");
  console.log(standardUri);
  console.log("\nPaste this as MONGODB_URI in server/.env in place of the mongodb+srv:// version.");
}

main().catch((err) => {
  console.error("Failed to resolve SRV/TXT records:", err instanceof Error ? err.message : err);
  process.exit(1);
});
