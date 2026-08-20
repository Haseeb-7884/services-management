import type { NextRequest } from "next/server";
import type { Model } from "mongoose";
import { connectDB } from "../../../../../../lib/db";
import { Comment } from "../../../../../../lib/models/Comment";
import { Video } from "../../../../../../lib/models/Video";
import { Image } from "../../../../../../lib/models/Image";
import { Article } from "../../../../../../lib/models/Article";
import { ApiError } from "../../../../../../lib/ApiError";
import { ok } from "../../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../../lib/handler";
import { requireAuth } from "../../../../../../lib/auth";
import { isModeratorOrAbove } from "../../../../../../lib/moderation";

// Lives at /api/social/comments/id/[id] rather than /api/social/comments/[id]
// because Next.js's App Router disallows two different dynamic segment names
// ([id] vs [targetType]) at the same path depth - the GET-by-target route
// below needs /api/social/comments/[targetType]/[targetId]. Same workaround
// as /api/plans/id/[id] vs /api/plans/[slug].
const TARGET_MODELS: Record<"Video" | "Image" | "Article", Model<any>> = { Video, Image, Article };
type Ctx = { params: Promise<{ id: string }> };

export const DELETE = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const user = await requireAuth(req);
  const { id } = await ctx.params;

  const comment = await Comment.findById(id);
  if (!comment) throw ApiError.notFound("Comment not found");

  const isOwner = String(comment.author) === user.id;
  if (!isOwner && !isModeratorOrAbove(user.role)) throw ApiError.forbidden();

  await comment.deleteOne();
  const targetType = comment.targetType as keyof typeof TARGET_MODELS;
  await TARGET_MODELS[targetType].findByIdAndUpdate(comment.targetId, { $inc: { commentsCount: -1 } });

  return ok(null, "Comment deleted");
});
