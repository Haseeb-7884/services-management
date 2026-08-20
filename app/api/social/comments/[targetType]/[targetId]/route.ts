import { connectDB } from "../../../../../../lib/db";
import { Comment } from "../../../../../../lib/models/Comment";
import { ApiError } from "../../../../../../lib/ApiError";
import { ok } from "../../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../../lib/handler";

const VALID_TYPES = new Set(["Video", "Image", "Article"]);
type Ctx = { params: Promise<{ targetType: string; targetId: string }> };

export const GET = withHandler<Ctx>(async (_req, ctx) => {
  await connectDB();
  const { targetType, targetId } = await ctx.params;
  if (!VALID_TYPES.has(targetType)) throw ApiError.badRequest(`Unsupported target type: ${targetType}`);

  const comments = await Comment.find({ targetType, targetId })
    .populate("author", "username profile.displayName profile.avatarUrl")
    .sort({ createdAt: -1 })
    .limit(200);

  return ok(comments);
});
