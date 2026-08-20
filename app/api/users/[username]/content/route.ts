import type { NextRequest } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { User } from "../../../../../lib/models/User";
import { Video } from "../../../../../lib/models/Video";
import { Image } from "../../../../../lib/models/Image";
import { Article } from "../../../../../lib/models/Article";
import { ApiError } from "../../../../../lib/ApiError";
import { ok } from "../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../lib/handler";

type Ctx = { params: Promise<{ username: string }> };

/**
 * Public "channel" content feed for a profile - combines this user's
 * Video/Image/Article docs into one shape the Channel page's tabs can
 * render. Only approved/public content is shown.
 *
 * `type` narrows to a single tab: video | short | image | article. Omitted
 * (or "all") combines everything, newest first. Because this merges three
 * separate collections, pagination is done in-memory after the merge -
 * fine at this project's scale, would need a proper aggregation/cursor if
 * a single channel ever grows into the thousands of posts.
 */
// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const GET = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const { username } = await ctx.params;
  const owner = await User.findOne({ username: username.toLowerCase() }).select("_id");
  if (!owner) throw ApiError.notFound("User not found");

  const sp = req.nextUrl.searchParams;
  const type = sp.get("type") ?? "all";
  const pageNum = Math.max(1, Number(sp.get("page") ?? "1"));
  const limitNum = Math.min(60, Math.max(1, Number(sp.get("limit") ?? "24")));

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
  ].sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime());

  const total = items.length;
  const paged = items.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return ok({ items: paged, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});
