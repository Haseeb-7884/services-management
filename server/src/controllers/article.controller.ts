import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Article } from "../models/Article.js";
import { ApiError } from "../utils/ApiError.js";
import { created, ok } from "../utils/ApiResponse.js";
import { uploadLocalFile } from "../utils/cloudinary.js";
import { initialContentStatus, isModeratorOrAbove } from "../utils/moderation.js";

export const listArticles = asyncHandler(async (req: Request, res: Response) => {
  const { category, tag, search, page = "1", limit = "20" } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = { status: "approved" };
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (search) filter.$text = { $search: search };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));

  const [items, total] = await Promise.all([
    Article.find(filter)
      .populate("owner", "username profile.displayName profile.avatarUrl")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Article.countDocuments(filter),
  ]);

  ok(res, { items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const getArticle = asyncHandler(async (req: Request, res: Response) => {
  const article = await Article.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "username profile.displayName profile.avatarUrl");
  if (!article) throw ApiError.notFound("Article not found");
  ok(res, article);
});

export const createArticle = asyncHandler(async (req: Request, res: Response) => {
  const { title, excerpt, body, category, tags } = req.body as Record<string, string>;
  if (!title) throw ApiError.badRequest("Title is required");
  if (!body) throw ApiError.badRequest("Body is required");

  let coverImageUrl = "";
  if (req.file) {
    const { url } = await uploadLocalFile(req.file.path, "articles");
    coverImageUrl = url;
  }

  const status = initialContentStatus(req.user!.role);
  const article = await Article.create({
    owner: req.user!.id,
    title,
    excerpt,
    body,
    category,
    coverImageUrl,
    tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    status,
  });

  created(
    res,
    article,
    status === "pending" ? "Article published — pending review before it's publicly visible" : "Article published"
  );
});

export const deleteArticle = asyncHandler(async (req: Request, res: Response) => {
  const article = await Article.findById(req.params.id);
  if (!article) throw ApiError.notFound("Article not found");

  const isOwner = String(article.owner) === req.user!.id;
  if (!isOwner && !isModeratorOrAbove(req.user!.role)) throw ApiError.forbidden();

  await article.deleteOne();
  ok(res, null, "Article deleted");
});
