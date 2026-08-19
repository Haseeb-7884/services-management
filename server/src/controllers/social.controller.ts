import type { Request, Response } from "express";
import type { Model } from "mongoose";
import asyncHandler from "express-async-handler";
import { Like } from "../models/Like.js";
import { Comment } from "../models/Comment.js";
import { Video } from "../models/Video.js";
import { Image } from "../models/Image.js";
import { Article } from "../models/Article.js";
import { Notification } from "../models/Notification.js";
import { ApiError } from "../utils/ApiError.js";
import { created, ok } from "../utils/ApiResponse.js";
import { isModeratorOrAbove } from "../utils/moderation.js";

// Typed as Model<any> so TS doesn't try to unify Video's, Image's, and
// Article's distinct inferred schema types when all three are accessed
// through the same lookup map.
const TARGET_MODELS: Record<"Video" | "Image" | "Article", Model<any>> = { Video, Image, Article };
type TargetType = keyof typeof TARGET_MODELS;

function assertValidTargetType(targetType: string): asserts targetType is TargetType {
  if (!(targetType in TARGET_MODELS)) {
    throw ApiError.badRequest(`Unsupported target type: ${targetType}`);
  }
}

export const toggleLike = asyncHandler(async (req: Request, res: Response) => {
  const { targetType, targetId } = req.body as { targetType: string; targetId: string };
  assertValidTargetType(targetType);

  const Model = TARGET_MODELS[targetType];
  const target = await Model.findById(targetId);
  if (!target) throw ApiError.notFound(`${targetType} not found`);

  const existing = await Like.findOne({ user: req.user!.id, targetType, targetId });

  if (existing) {
    await existing.deleteOne();
    await Model.findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } });
    ok(res, { liked: false }, "Like removed");
    return;
  }

  await Like.create({ user: req.user!.id, targetType, targetId });
  await Model.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } });

  const ownerId = (target as { owner?: unknown }).owner;
  if (ownerId && String(ownerId) !== req.user!.id) {
    await Notification.create({
      recipient: ownerId,
      actor: req.user!.id,
      type: "like",
      targetType,
      targetId,
    });
  }

  ok(res, { liked: true }, "Liked");
});

export const listComments = asyncHandler(async (req: Request, res: Response) => {
  const { targetType, targetId } = req.params;
  assertValidTargetType(targetType);

  const comments = await Comment.find({ targetType, targetId })
    .populate("author", "username profile.displayName profile.avatarUrl")
    .sort({ createdAt: -1 })
    .limit(200);

  ok(res, comments);
});

export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const { targetType, targetId, body, parentComment } = req.body as {
    targetType: string;
    targetId: string;
    body: string;
    parentComment?: string;
  };
  assertValidTargetType(targetType);
  if (!body?.trim()) throw ApiError.badRequest("Comment body is required");

  const Model = TARGET_MODELS[targetType];
  const target = await Model.findById(targetId);
  if (!target) throw ApiError.notFound(`${targetType} not found`);

  const comment = await Comment.create({
    author: req.user!.id,
    targetType,
    targetId,
    body: body.trim(),
    parentComment: parentComment ?? null,
  });
  await Model.findByIdAndUpdate(targetId, { $inc: { commentsCount: 1 } });

  const ownerId = (target as { owner?: unknown }).owner;
  if (ownerId && String(ownerId) !== req.user!.id) {
    await Notification.create({
      recipient: ownerId,
      actor: req.user!.id,
      type: "comment",
      targetType,
      targetId,
    });
  }

  await comment.populate("author", "username profile.displayName profile.avatarUrl");
  created(res, comment, "Comment added");
});

export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw ApiError.notFound("Comment not found");

  const isOwner = String(comment.author) === req.user!.id;
  if (!isOwner && !isModeratorOrAbove(req.user!.role)) throw ApiError.forbidden();

  await comment.deleteOne();
  const targetType = comment.targetType as TargetType;
  await TARGET_MODELS[targetType].findByIdAndUpdate(comment.targetId, {
    $inc: { commentsCount: -1 },
  });

  ok(res, null, "Comment deleted");
});
