import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { User } from "../../../../lib/models/User";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { ROLES } from "../../../../lib/constants/roles";

/**
 * Top creators by follower count, for the Home page's "Featured Creators"
 * rail. Excludes staff roles (owner/admin/moderator) - this rail is meant
 * to showcase community creators, not platform operators.
 */
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
  const limitNum = Math.min(20, Math.max(1, Number(req.nextUrl.searchParams.get("limit") ?? "8")));
  const staffRoles = [ROLES.OWNER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR];

  const creators = await User.find({ role: { $nin: staffRoles }, followersCount: { $gt: 0 } })
    .select("username profile.displayName profile.avatarUrl followersCount role")
    .sort({ followersCount: -1 })
    .limit(limitNum);

  return ok(creators);
});
