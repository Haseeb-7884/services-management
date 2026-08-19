import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Video } from "../models/Video.js";
import { ApiError } from "../utils/ApiError.js";
import { created, ok } from "../utils/ApiResponse.js";
import { deriveVideoThumbnail, uploadLocalFile } from "../utils/cloudinary.js";
import { initialContentStatus, isModeratorOrAbove } from "../utils/moderation.js";

export const listVideos = asyncHandler(async (req: Request, res: Response) => {
  const { category, tag, search, isShort, page = "1", limit = "20" } = req.query as Record<
    string,
    string
  >;

  const filter: Record<string, unknown> = { status: "approved" };
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (isShort !== undefined) filter.isShort = isShort === "true";
  if (search) filter.$text = { $search: search };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));

  const [items, total] = await Promise.all([
    Video.find(filter)
      .populate("owner", "username profile.displayName profile.avatarUrl")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Video.countDocuments(filter),
  ]);

  ok(res, { items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const getVideo = asyncHandler(async (req: Request, res: Response) => {
  const video = await Video.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("owner", "username profile.displayName profile.avatarUrl");
  if (!video) throw ApiError.notFound("Video not found");
  ok(res, video);
});

export const uploadVideo = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest(req.fileValidationError ?? "No video file uploaded");

  const { title, description, category, tags, isShort } = req.body as Record<string, string>;
  if (!title) throw ApiError.badRequest("Title is required");

  const { url, provider } = await uploadLocalFile(req.file.path, "videos", { large: true });
  const thumbnailUrl = deriveVideoThumbnail(url, provider);

  const status = initialContentStatus(req.user!.role);
  const video = await Video.create({
    owner: req.user!.id,
    title,
    description,
    category,
    isShort: isShort === "true",
    tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    url,
    thumbnailUrl,
    status,
  });

  created(
    res,
    video,
    status === "pending" ? "Video uploaded — pending review before it's publicly visible" : "Video uploaded"
  );
});

export const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
  const video = await Video.findById(req.params.id);
  if (!video) throw ApiError.notFound("Video not found");

  const isOwner = String(video.owner) === req.user!.id;
  if (!isOwner && !isModeratorOrAbove(req.user!.role)) throw ApiError.forbidden();

  await video.deleteOne();
  ok(res, null, "Video deleted");
});
