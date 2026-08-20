import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Article } from "../../../../lib/models/Article";
import { ApiError } from "../../../../lib/ApiError";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { requireAuth } from "../../../../lib/auth";
import { isModeratorOrAbove } from "../../../../lib/moderation";

type Ctx = { params: Promise<{ id: string }> };

export const GET = withHandler<Ctx>(async (_req, ctx) => {
  await connectDB();
  const { id } = await ctx.params;
  const article = await Article.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).populate(
    "owner",
    "username profile.displayName profile.avatarUrl"
  );
  if (!article) throw ApiError.notFound("Article not found");
  return ok(article);
});

export const DELETE = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const user = await requireAuth(req);
  const { id } = await ctx.params;

  const article = await Article.findById(id);
  if (!article) throw ApiError.notFound("Article not found");

  const isOwner = String(article.owner) === user.id;
  if (!isOwner && !isModeratorOrAbove(user.role)) throw ApiError.forbidden();

  await article.deleteOne();
  return ok(null, "Article deleted");
});
