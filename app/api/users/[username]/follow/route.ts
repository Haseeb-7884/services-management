import type { NextRequest } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { User } from "../../../../../lib/models/User";
import { Follow } from "../../../../../lib/models/Follow";
import { Notification } from "../../../../../lib/models/Notification";
import { ApiError } from "../../../../../lib/ApiError";
import { ok } from "../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../lib/handler";
import { requireAuth } from "../../../../../lib/auth";

type Ctx = { params: Promise<{ username: string }> };

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const POST = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const authUser = await requireAuth(req);
  const { username } = await ctx.params;

  const target = await User.findOne({ username: username.toLowerCase() });
  if (!target) throw ApiError.notFound("User not found");
  if (String(target._id) === authUser.id) throw ApiError.badRequest("You cannot follow yourself");

  const existing = await Follow.findOne({ follower: authUser.id, following: target._id });
  if (existing) throw ApiError.conflict("Already following this user");

  await Follow.create({ follower: authUser.id, following: target._id });
  await Promise.all([
    User.findByIdAndUpdate(authUser.id, { $inc: { followingCount: 1 } }),
    User.findByIdAndUpdate(target._id, { $inc: { followersCount: 1 } }),
  ]);

  await Notification.create({ recipient: target._id, actor: authUser.id, type: "follow" });

  return ok(null, "Followed");
});

export const DELETE = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const authUser = await requireAuth(req);
  const { username } = await ctx.params;

  const target = await User.findOne({ username: username.toLowerCase() });
  if (!target) throw ApiError.notFound("User not found");

  const deleted = await Follow.findOneAndDelete({ follower: authUser.id, following: target._id });
  if (!deleted) throw ApiError.badRequest("You are not following this user");

  await Promise.all([
    User.findByIdAndUpdate(authUser.id, { $inc: { followingCount: -1 } }),
    User.findByIdAndUpdate(target._id, { $inc: { followersCount: -1 } }),
  ]);

  return ok(null, "Unfollowed");
});
