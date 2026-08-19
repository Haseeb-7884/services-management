import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { Follow } from "../models/Follow.js";
import { Notification } from "../models/Notification.js";
import { Video } from "../models/Video.js";
import { Image } from "../models/Image.js";
import { Article } from "../models/Article.js";
import { ApiError } from "../utils/ApiError.js";
import { ok } from "../utils/ApiResponse.js";
import { uploadLocalFile } from "../utils/cloudinary.js";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!user) throw ApiError.notFound("User not found");

  let isFollowedByViewer = false;
  if (req.user) {
    isFollowedByViewer = Boolean(
      await Follow.exists({ follower: req.user.id, following: user._id })
    );
  }

  ok(res, { ...user.toJSON(), isFollowedByViewer });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { displayName, bio, tagline, category, socialLinks } = req.body as {
    displayName?: string;
    bio?: string;
    tagline?: string;
    category?: string;
    socialLinks?: { website?: string; twitter?: string; instagram?: string; youtube?: string };
  };

  const update: Record<string, unknown> = {};
  if (displayName !== undefined) update["profile.displayName"] = displayName;
  if (bio !== undefined) update["profile.bio"] = bio;
  if (tagline !== undefined) update["profile.tagline"] = tagline;
  if (category !== undefined) update["profile.category"] = category;
  if (socialLinks !== undefined) {
    if (socialLinks.website !== undefined) update["profile.socialLinks.website"] = socialLinks.website;
    if (socialLinks.twitter !== undefined) update["profile.socialLinks.twitter"] = socialLinks.twitter;
    if (socialLinks.instagram !== undefined) update["profile.socialLinks.instagram"] = socialLinks.instagram;
    if (socialLinks.youtube !== undefined) update["profile.socialLinks.youtube"] = socialLinks.youtube;
  }

  const user = await User.findByIdAndUpdate(req.user!.id, update, { new: true });
  if (!user) throw ApiError.notFound("User not found");
  ok(res, user, "Profile updated");
});

export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest("No file uploaded");
  const { url } = await uploadLocalFile(req.file.path, "avatars");
  const user = await User.findByIdAndUpdate(
    req.user!.id,
    { "profile.avatarUrl": url },
    { new: true }
  );
  ok(res, user, "Avatar updated");
});

export const uploadCover = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest("No file uploaded");
  const { url } = await uploadLocalFile(req.file.path, "covers");
  const user = await User.findByIdAndUpdate(
    req.user!.id,
    { "profile.coverUrl": url },
    { new: true }
  );
  ok(res, user, "Cover photo updated");
});

export const followUser = asyncHandler(async (req: Request, res: Response) => {
  const target = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!target) throw ApiError.notFound("User not found");
  if (String(target._id) === req.user!.id) throw ApiError.badRequest("You cannot follow yourself");

  const existing = await Follow.findOne({ follower: req.user!.id, following: target._id });
  if (existing) throw ApiError.conflict("Already following this user");

  await Follow.create({ follower: req.user!.id, following: target._id });
  await Promise.all([
    User.findByIdAndUpdate(req.user!.id, { $inc: { followingCount: 1 } }),
    User.findByIdAndUpdate(target._id, { $inc: { followersCount: 1 } }),
  ]);

  if (String(target._id) !== req.user!.id) {
    await Notification.create({
      recipient: target._id,
      actor: req.user!.id,
      type: "follow",
    });
  }

  ok(res, null, "Followed");
});

export const unfollowUser = asyncHandler(async (req: Request, res: Response) => {
  const target = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!target) throw ApiError.notFound("User not found");

  const deleted = await Follow.findOneAndDelete({ follower: req.user!.id, following: target._id });
  if (!deleted) throw ApiError.badRequest("You are not following this user");

  await Promise.all([
    User.findByIdAndUpdate(req.user!.id, { $inc: { followingCount: -1 } }),
    User.findByIdAndUpdate(target._id, { $inc: { followersCount: -1 } }),
  ]);

  ok(res, null, "Unfollowed");
});

export const listFollowers = asyncHandler(async (req: Request, res: Response) => {
  const target = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!target) throw ApiError.notFound("User not found");
  const { limit = "100" } = req.query as Record<string, string>;
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const follows = await Follow.find({ following: target._id })
    .populate("follower", "username profile.displayName profile.avatarUrl")
    .sort({ createdAt: -1 })
    .limit(limitNum);
  ok(
    res,
    follows.map((f) => ({ ...(f.follower as any).toObject(), followedAt: f.createdAt }))
  );
});

/**
 * Public "channel" content feed for a profile - combines this user's
 * Video/Image/Article docs into one shape the Channel page's tabs can
 * render, instead of the placeholder mock posts it used before. Only
 * approved/public content is shown (this is what visitors see, not a
 * moderation queue).
 *
 * `type` narrows to a single tab: video | short | image | article.
 * Omitted (or "all") combines everything, newest first. Because this
 * merges three separate collections, pagination is done in-memory after
 * the merge - fine at this project's scale, would need a proper
 * aggregation/cursor if a single channel ever grows into the thousands of
 * posts.
 */
export const getUserContent = asyncHandler(async (req: Request, res: Response) => {
  const owner = await User.findOne({ username: req.params.username.toLowerCase() }).select("_id");
  if (!owner) throw ApiError.notFound("User not found");

  const { type = "all", page = "1", limit = "24" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(60, Math.max(1, Number(limit)));

  const wantsVideos = type === "all" || type === "video" || type === "short";
  const wantsImages = type === "all" || type === "image";
  const wantsArticles = type === "all" || type === "article";

  const [videos, images, articles] = await Promise.all([
    wantsVideos
      ? Video.find({
          owner: owner._id,
          status: "approved",
          ...(type === "video" ? { isShort: false } : {}),
          ...(type === "short" ? { isShort: true } : {}),
        }).sort({ createdAt: -1 })
      : [],
    wantsImages ? Image.find({ owner: owner._id, status: "approved" }).sort({ createdAt: -1 }) : [],
    wantsArticles ? Article.find({ owner: owner._id, status: "approved" }).sort({ createdAt: -1 }) : [],
  ]);

  const items = [
    ...videos.map((v) => ({
      id: String(v._id),
      contentType: v.isShort ? ("short" as const) : ("video" as const),
      title: v.title,
      thumbnailUrl: v.thumbnailUrl,
      views: v.views,
      likesCount: v.likesCount,
      commentsCount: v.commentsCount,
      createdAt: v.createdAt,
    })),
    ...images.map((i) => ({
      id: String(i._id),
      contentType: "image" as const,
      title: i.caption || "",
      thumbnailUrl: i.url,
      views: i.views,
      likesCount: i.likesCount,
      commentsCount: i.commentsCount,
      createdAt: i.createdAt,
    })),
    ...articles.map((a) => ({
      id: String(a._id),
      contentType: "article" as const,
      title: a.title,
      thumbnailUrl: a.coverImageUrl,
      views: a.views,
      likesCount: a.likesCount,
      commentsCount: a.commentsCount,
      createdAt: a.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = items.length;
  const paged = items.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  ok(res, { items: paged, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const listFollowing = asyncHandler(async (req: Request, res: Response) => {
  const target = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!target) throw ApiError.notFound("User not found");
  const follows = await Follow.find({ follower: target._id })
    .populate("following", "username profile.displayName profile.avatarUrl")
    .limit(100);
  ok(res, follows.map((f) => f.following));
});
