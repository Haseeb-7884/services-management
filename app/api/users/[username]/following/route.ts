import { connectDB } from "../../../../../lib/db";
import { User } from "../../../../../lib/models/User";
import { Follow } from "../../../../../lib/models/Follow";
import { ApiError } from "../../../../../lib/ApiError";
import { ok } from "../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../lib/handler";

type Ctx = { params: Promise<{ username: string }> };

export const GET = withHandler<Ctx>(async (_req, ctx) => {
  await connectDB();
  const { username } = await ctx.params;
  const target = await User.findOne({ username: username.toLowerCase() });
  if (!target) throw ApiError.notFound("User not found");

  const follows = await Follow.find({ follower: target._id })
    .populate("following", "username profile.displayName profile.avatarUrl")
    .limit(100);

  return ok(follows.map((f) => f.following));
});
