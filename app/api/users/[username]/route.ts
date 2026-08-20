import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { User } from "../../../../lib/models/User";
import { Follow } from "../../../../lib/models/Follow";
import { ApiError } from "../../../../lib/ApiError";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { attachUserIfPresent } from "../../../../lib/auth";

type Ctx = { params: Promise<{ username: string }> };

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
