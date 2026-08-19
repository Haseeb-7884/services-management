import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Image } from "../models/Image.js";
import { ApiError } from "../utils/ApiError.js";
import { created, ok } from "../utils/ApiResponse.js";
import { uploadLocalFile } from "../utils/cloudinary.js";
import { initialContentStatus, isModeratorOrAbove } from "../utils/moderation.js";

export const listImages = asyncHandler(async (req: Request, res: Response) => {
  const { category, tag, search, page = "1", limit = "24" } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = { status: "approved" };
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (search) filter.$text = { $search: search };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(60, Math.max(1, Number(limit)));

  const [items, total] = await Promise.all([
    Image.find(filter)
      .populate("owner", "username profile.displayName profile.avatarUrl")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Image.countDocuments(filter),
  ]);

  ok(res, { items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const getImage = asyncHandler(async (req: Request, res: Response) => {
  const image = await Image.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "username profile.displayName profile.avatarUrl");
  if (!image) throw ApiError.notFound("Image not found");
  ok(res, image);
});

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest(req.fileValidationError ?? "No image file uploaded");

  const { caption, category, tags } = req.body as Record<string, string>;
  const { url } = await uploadLocalFile(req.file.path, "images");

  const status = initialContentStatus(req.user!.role);
  const image = await Image.create({
    owner: req.user!.id,
    caption,
    category,
    tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    url,
    status,
  });

  created(
    res,
    image,
    status === "pending" ? "Image uploaded — pending review before it's publicly visible" : "Image uploaded"
  );
});

export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
  const image = await Image.findById(req.params.id);
  if (!image) throw ApiError.notFound("Image not found");

  const isOwner = String(image.owner) === req.user!.id;
  if (!isOwner && !isModeratorOrAbove(req.user!.role)) throw ApiError.forbidden();

  await image.deleteOne();
  ok(res, null, "Image deleted");
});
