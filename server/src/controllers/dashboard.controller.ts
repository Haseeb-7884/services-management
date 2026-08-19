import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Video } from "../models/Video.js";
import { Image } from "../models/Image.js";
import { Article } from "../models/Article.js";
import { User } from "../models/User.js";
import { ok } from "../utils/ApiResponse.js";

/**
 * Real aggregation across the caller's own Video/Image/Article docs.
 *
 * Note on "weeklyViews": the content models only store a running `views`
 * counter, not per-view timestamped events, so a genuine day-by-day views
 * trend isn't derivable from current data. This endpoint returns real
 * totals + a real content list; a true weekly trend would need a
 * separate ViewEvent log (flagged as follow-up work, not faked here).
 */
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user!.id;

  const [videos, images, articles, user] = await Promise.all([
    Video.find({ owner: ownerId }),
    Image.find({ owner: ownerId }),
    Article.find({ owner: ownerId }),
    User.findById(ownerId),
  ]);

  const allContent = [
    ...videos.map((v) => ({
      id: String(v._id),
      title: v.title,
      thumbnailUrl: v.thumbnailUrl,
      type: "Video" as const,
      status: v.status,
      views: v.views,
      likesCount: v.likesCount,
      createdAt: v.createdAt,
    })),
    ...images.map((i) => ({
      id: String(i._id),
      title: i.caption || "Untitled image",
      thumbnailUrl: i.url,
      type: "Image" as const,
      status: i.status,
      views: i.views,
      likesCount: i.likesCount,
      createdAt: i.createdAt,
    })),
    ...articles.map((a) => ({
      id: String(a._id),
      title: a.title,
      thumbnailUrl: a.coverImageUrl,
      type: "Article" as const,
      status: a.status,
      views: a.views,
      likesCount: a.likesCount,
      createdAt: a.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalViews = allContent.reduce((sum, c) => sum + (c.views ?? 0), 0);
  const totalLikes = allContent.reduce((sum, c) => sum + (c.likesCount ?? 0), 0);

  ok(res, {
    stats: {
      totalViews,
      followers: user?.followersCount ?? 0,
      totalLikes,
      contentCount: allContent.length,
    },
    content: allContent,
  });
});

export const listMyContent = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user!.id;

  const [videos, images, articles] = await Promise.all([
    Video.find({ owner: ownerId }).sort({ createdAt: -1 }),
    Image.find({ owner: ownerId }).sort({ createdAt: -1 }),
    Article.find({ owner: ownerId }).sort({ createdAt: -1 }),
  ]);

  const items = [
    ...videos.map((v) => ({
      id: String(v._id),
      title: v.title,
      thumbnailUrl: v.thumbnailUrl,
      type: "Video" as const,
      status: v.status,
      views: v.views,
      createdAt: v.createdAt,
    })),
    ...images.map((i) => ({
      id: String(i._id),
      title: i.caption || "Untitled image",
      thumbnailUrl: i.url,
      type: "Image" as const,
      status: i.status,
      views: i.views,
      createdAt: i.createdAt,
    })),
    ...articles.map((a) => ({
      id: String(a._id),
      title: a.title,
      thumbnailUrl: a.coverImageUrl,
      type: "Article" as const,
      status: a.status,
      views: a.views,
      createdAt: a.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  ok(res, items);
});
