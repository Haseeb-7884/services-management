import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { REFRESH_COOKIE_NAME } from "../../../../lib/tokens";

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const POST = withHandler(async () => {
  const res = ok(null, "Logged out");
  res.cookies.set(REFRESH_COOKIE_NAME, "", { path: "/api/auth", maxAge: 0 });
  return res;
});
