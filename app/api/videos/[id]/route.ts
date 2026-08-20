import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Video } from "../../../../lib/models/Video";
import { ApiError } from "../../../../lib/ApiError";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { requireAuth } from "../../../../lib/auth";
import { isModeratorOrAbove } from "../../../../lib/moderation";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withHandler<Ctx>(async (_req, ctx) => {
  await connectDB();
  const { id } = await ctx.params;
  const video = await Video.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).populate(
    "owner",
    "username profile.displayName profile.avatarUrl"
  );
  if (!video) throw ApiError.notFound("Video not found");
  return ok(video);
});

export const DELETE = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const user = await requireAuth(req);
  const { id } = await ctx.params;

  const video = await Video.findById(id);
  if (!video) throw ApiError.notFound("Video not found");

  const isOwner = String(video.owner) === user.id;
  if (!isOwner && !isModeratorOrAbove(user.role)) throw ApiError.forbidden();

  await video.deleteOne();
  return ok(null, "Video deleted");
});
