import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { User } from "../../../../lib/models/User";
import { ApiError } from "../../../../lib/ApiError";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { requireAuth } from "../../../../lib/auth";

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const GET = withHandler(async (req: NextRequest) => {
  await connectDB();
  const authUser = await requireAuth(req);
  const user = await User.findById(authUser.id);
  if (!user) throw ApiError.notFound("User not found");
  return ok(user);
});
