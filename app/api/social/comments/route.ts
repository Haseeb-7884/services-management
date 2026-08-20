import type { NextRequest } from "next/server";
import type { Model } from "mongoose";
import { connectDB } from "../../../../lib/db";
import { Comment } from "../../../../lib/models/Comment";
import { Video } from "../../../../lib/models/Video";
import { Image } from "../../../../lib/models/Image";
import { Article } from "../../../../lib/models/Article";
import { Notification } from "../../../../lib/models/Notification";
import { ApiError } from "../../../../lib/ApiError";
import { created } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { requireAuth } from "../../../../lib/auth";

const TARGET_MODELS: Record<"Video" | "Image" | "Article", Model<any>> = { Video, Image, Article };
type TargetType = keyof typeof TARGET_MODELS;

function assertValidTargetType(targetType: string): asserts targetType is TargetType {
  if (!(targetType in TARGET_MODELS)) {
    throw ApiError.badRequest(`Unsupported target type: ${targetType}`);
  }
}

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const POST = withHandler(async (req: NextRequest) => {
  await connectDB();
  const user = await requireAuth(req);
  const { targetType, targetId, body, parentComment } = await req.json();
  assertValidTargetType(targetType);
  if (!body?.trim()) throw ApiError.badRequest("Comment body is required");

  const Model = TARGET_MODELS[targetType];
  const target = await Model.findById(targetId);
  if (!target) throw ApiError.notFound(`${targetType} not found`);

  const comment = await Comment.create({
    author: user.id,
    targetType,
    targetId,
    body: body.trim(),
    parentComment: parentComment ?? null,
  });
  await Model.findByIdAndUpdate(targetId, { $inc: { commentsCount: 1 } });

  const ownerId = (target as { owner?: unknown }).owner;
  if (ownerId && String(ownerId) !== user.id) {
    await Notification.create({ recipient: ownerId, actor: user.id, type: "comment", targetType, targetId });
  }

  await comment.populate("author", "username profile.displayName profile.avatarUrl");
  return created(comment, "Comment added");
});
