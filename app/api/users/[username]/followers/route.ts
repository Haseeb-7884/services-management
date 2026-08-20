import type { NextRequest } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { User } from "../../../../../lib/models/User";
import { Follow } from "../../../../../lib/models/Follow";
import { ApiError } from "../../../../../lib/ApiError";
import { ok } from "../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../lib/handler";

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
  const target = await User.findOne({ username: username.toLowerCase() });
  if (!target) throw ApiError.notFound("User not found");

  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "100");
  const limitNum = Math.min(100, Math.max(1, limit));

  const follows = await Follow.find({ following: target._id })
    .populate("follower", "username profile.displayName profile.avatarUrl")
    .sort({ createdAt: -1 })
    .limit(limitNum);

  return ok(follows.map((f) => ({ ...(f.follower as any).toObject(), followedAt: f.createdAt })));
});
