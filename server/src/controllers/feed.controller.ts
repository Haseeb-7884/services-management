import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Video } from "../models/Video.js";
import { Image } from "../models/Image.js";
import { Article } from "../models/Article.js";
import { User } from "../models/User.js";
import { ROLES } from "../constants/roles.js";
import { ok } from "../utils/ApiResponse.js";

const OWNER_SELECT = "username profile.displayName profile.avatarUrl";

type MergedItem = {
  id: string;
  type: "video" | "short" | "image" | "article";
  title: string;
  excerpt?: string;
  thumbnailUrl: string;
  durationSec?: number;
  owner: unknown;
  createdAt: Date;
  views: number;
  likesCount: number;
  commentsCount: number;
};

function mapVideo(v: any): MergedItem {
  return {
    id: String(v._id),
    type: v.isShort ? "short" : "video",
    title: v.title,
    excerpt: v.description,
    thumbnailUrl: v.thumbnailUrl,
    durationSec: v.durationSec,
    owner: v.owner,
    createdAt: v.createdAt,
    views: v.views,
    likesCount: v.likesCount,
    commentsCount: v.commentsCount,
  };
}
function mapImage(i: any): MergedItem {
  return {
    id: String(i._id),
    type: "image",
    title: i.caption || "",
    thumbnailUrl: i.url,
    owner: i.owner,
    createdAt: i.createdAt,
    views: i.views,
    likesCount: i.likesCount,
    commentsCount: i.commentsCount,
  };
}
function mapArticle(a: any): MergedItem {
  return {
    id: String(a._id),
    type: "article",
    title: a.title,
    excerpt: a.excerpt,
    thumbnailUrl: a.coverImageUrl,
    owner: a.owner,
    createdAt: a.createdAt,
    views: a.views,
    likesCount: a.likesCount,
    commentsCount: a.commentsCount,
  };
}

/**
 * Combined public discovery feed - merges approved Video/Image/Article into
 * one reverse-chronological stream for the Home page's "For You" section.
 *
 * Three collections are queried and merged in application code rather than
 * with a single aggregation (e.g. $unionWith) to keep this consistent with
 * the same merge pattern already used in user.controller.ts's
 * getUserContent and admin.controller.ts's listPendingContent. That's fine
 * at this project's current scale; if a single feed page ever needs to
 * scan many thousands of rows per collection, this should move to a
 * database-side $unionWith aggregation with a real cursor instead of
 * over-fetching and slicing in memory.
 */
export const getFeed = asyncHandler(async (req: Request, res: Response) => {
  const { type = "all", category, page = "1", limit = "12" } = req.query as Record<string, string>;
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));

  const wantsVideos = type === "all" || type === "video" || type === "short";
  const wantsImages = type === "all" || type === "image";
  const wantsArticles = type === "all" || type === "article";

  // Over-fetch a bounded window per collection (most recent N), merge, then
  // paginate the merged list - avoids scanning a whole collection while
  // still being correct for realistic page sizes.
  const fetchCap = (pageNum * limitNum) + 60;

  const videoFilter: Record<string, unknown> = { status: "approved" };
  if (category) videoFilter.category = category;
  if (type === "video") videoFilter.isShort = false;
  if (type === "short") videoFilter.isShort = true;

  const imageFilter: Record<string, unknown> = { status: "approved" };
  if (category) imageFilter.category = category;

  const articleFilter: Record<string, unknown> = { status: "approved" };
  if (category) articleFilter.category = category;

  const [videos, images, articles] = await Promise.all([
    wantsVideos
      ? Video.find(videoFilter).populate("owner", OWNER_SELECT).sort({ createdAt: -1 }).limit(fetchCap)
      : [],
    wantsImages
      ? Image.find(imageFilter).populate("owner", OWNER_SELECT).sort({ createdAt: -1 }).limit(fetchCap)
      : [],
    wantsArticles
      ? Article.find(articleFilter).populate("owner", OWNER_SELECT).sort({ createdAt: -1 }).limit(fetchCap)
      : [],
  ]);

  const merged = [
    ...videos.map(mapVideo),
    ...images.map(mapImage),
    ...articles.map(mapArticle),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = merged.length;
  const paged = merged.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  ok(res, { items: paged, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

/**
 * Trending rail - same merge approach as getFeed, but ranked by a simple
 * Hacker-News-style score (engagement weighted, decayed by age) instead of
 * pure recency. Looks at approved content from the last 30 days so a
 * three-year-old viral post doesn't permanently camp the rail.
 */
export const getTrending = asyncHandler(async (req: Request, res: Response) => {
  const { limit = "10" } = req.query as Record<string, string>;
  const limitNum = Math.min(30, Math.max(1, Number(limit)));

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const filter = { status: "approved", createdAt: { $gte: since } };

  const [videos, images, articles] = await Promise.all([
    Video.find(filter).populate("owner", OWNER_SELECT).sort({ views: -1 }).limit(100),
    Image.find(filter).populate("owner", OWNER_SELECT).sort({ views: -1 }).limit(100),
    Article.find(filter).populate("owner", OWNER_SELECT).sort({ views: -1 }).limit(100),
  ]);

  const merged = [...videos.map(mapVideo), ...images.map(mapImage), ...articles.map(mapArticle)];

  const now = Date.now();
  const scored = merged.map((item) => {
    const ageHours = Math.max(0, (now - new Date(item.createdAt).getTime()) / 3_600_000);
    const engagement = item.views + item.likesCount * 3 + item.commentsCount * 5;
    // Gravity of 1.6 - similar shape to HN's ranking formula, tuned so a
    // fresh post with modest engagement can still outrank a week-old post
    // with a big head start, instead of "oldest big number always wins."
    const score = engagement / Math.pow(ageHours + 2, 1.6);
    return { ...item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  ok(res, scored.slice(0, limitNum).map(({ score: _score, ...item }) => item));
});

/**
 * Top creators by follower count, for the Home page's "Featured Creators"
 * rail. Excludes staff roles (owner/admin/moderator) - this rail is meant
 * to showcase community creators, not platform operators.
 */
export const getFeaturedCreators = asyncHandler(async (req: Request, res: Response) => {
  const { limit = "8" } = req.query as Record<string, string>;
  const limitNum = Math.min(20, Math.max(1, Number(limit)));

  const staffRoles = [ROLES.OWNER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR];

  const creators = await User.find({ role: { $nin: staffRoles }, followersCount: { $gt: 0 } })
    .select("username profile.displayName profile.avatarUrl followersCount role")
    .sort({ followersCount: -1 })
    .limit(limitNum);

  ok(res, creators);
});

/**
 * Real, honest platform-wide counters for the Home page stats strip.
 * Deliberately does NOT include a "monthly views" or "countries reached"
 * figure - neither is derivable from current data (content only stores a
 * running views counter, not timestamped view events or viewer geo), and
 * this project fabricates real numbers rather than plausible-looking fake
 * ones. See docs/REQUIREMENTS-STATUS.md for the analytics follow-up note.
 */
export const getPlatformStats = asyncHandler(async (_req: Request, res: Response) => {
  const staffRoles = [ROLES.OWNER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR];

  const [totalUsers, activeCreators, videoCount, imageCount, articleCount, videoViews, imageViews, articleViews] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: { $nin: staffRoles } }),
      Video.countDocuments({ status: "approved" }),
      Image.countDocuments({ status: "approved" }),
      Article.countDocuments({ status: "approved" }),
      Video.aggregate([{ $match: { status: "approved" } }, { $group: { _id: null, sum: { $sum: "$views" } } }]),
      Image.aggregate([{ $match: { status: "approved" } }, { $group: { _id: null, sum: { $sum: "$views" } } }]),
      Article.aggregate([{ $match: { status: "approved" } }, { $group: { _id: null, sum: { $sum: "$views" } } }]),
    ]);

  const totalViews =
    (videoViews[0]?.sum ?? 0) + (imageViews[0]?.sum ?? 0) + (articleViews[0]?.sum ?? 0);

  ok(res, {
    totalUsers,
    activeCreators,
    contentPublished: videoCount + imageCount + articleCount,
    totalViews,
  });
});
