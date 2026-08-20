import type { NextRequest } from "next/server";
import type { Model } from "mongoose";
import { connectDB } from "../../../../lib/db";
import { Like } from "../../../../lib/models/Like";
import { Video } from "../../../../lib/models/Video";
import { Image } from "../../../../lib/models/Image";
import { Article } from "../../../../lib/models/Article";
import { Notification } from "../../../../lib/models/Notification";
import { ApiError } from "../../../../lib/ApiError";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { requireAuth } from "../../../../lib/auth";

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

export const POST = withHandler(async (req: NextRequest) => {
  await connectDB();
  const user = await requireAuth(req);
  const { targetType, targetId } = await req.json();
  assertValidTargetType(targetType);

  const Model = TARGET_MODELS[targetType];
  const target = await Model.findById(targetId);
  if (!target) throw ApiError.notFound(`${targetType} not found`);

  const existing = await Like.findOne({ user: user.id, targetType, targetId });

  if (existing) {
    await existing.deleteOne();
    await Model.findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } });
    return ok({ liked: false }, "Like removed");
  }

  await Like.create({ user: user.id, targetType, targetId });
  await Model.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } });

  const ownerId = (target as { owner?: unknown }).owner;
  if (ownerId && String(ownerId) !== user.id) {
    await Notification.create({ recipient: ownerId, actor: user.id, type: "like", targetType, targetId });
  }

  return ok({ liked: true }, "Liked");
});
