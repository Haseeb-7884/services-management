import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { User } from "../../../../lib/models/User";
import { Follow } from "../../../../lib/models/Follow";
import { ApiError } from "../../../../lib/ApiError";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { attachUserIfPresent } from "../../../../lib/auth";

type Ctx = { params: Promise<{ username: string }> };

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const GET = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const { username } = await ctx.params;
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) throw ApiError.notFound("User not found");

  const viewer = await attachUserIfPresent(req);
  let isFollowedByViewer = false;
  if (viewer) {
    isFollowedByViewer = Boolean(await Follow.exists({ follower: viewer.id, following: user._id }));
  }

  return ok({ ...user.toJSON(), isFollowedByViewer });
});
