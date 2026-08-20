import { connectDB } from "../../../../../../lib/db";
import { Comment } from "../../../../../../lib/models/Comment";
import { ApiError } from "../../../../../../lib/ApiError";
import { ok } from "../../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../../lib/handler";

const VALID_TYPES = new Set(["Video", "Image", "Article"]);
type Ctx = { params: Promise<{ targetType: string; targetId: string }> };

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

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
