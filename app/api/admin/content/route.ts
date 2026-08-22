import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Video } from "../../../../lib/models/Video";
import { Image } from "../../../../lib/models/Image";
import { Article } from "../../../../lib/models/Article";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { requireAuth } from "../../../../lib/auth";
import { requireRole } from "../../../../lib/rbac";
import { ROLES } from "../../../../lib/constants/roles";

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

// Unlike /api/admin/content/pending (moderation queue - pending only),
// this lists EVERY piece of content on the platform regardless of status,
// across all three content types, merged into one feed - the browse+delete
// surface Admin/SuperAdmin were missing (they could only see and act on
// pending items, never anything already published).
export const GET = withHandler(async (req: NextRequest) => {
  await connectDB();
  const authUser = await requireAuth(req);
  requireRole(authUser, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.OWNER);

  const sp = req.nextUrl.searchParams;
  const type = sp.get("type") ?? "all";
  const status = sp.get("status") ?? undefined;
  const search = sp.get("search")?.trim() ?? undefined;
  const pageNum = Math.max(1, Number(sp.get("page") ?? "1"));
  const limitNum = Math.min(60, Math.max(1, Number(sp.get("limit") ?? "20")));

  const wantsVideos = type === "all" || type === "video";
  const wantsImages = type === "all" || type === "image";
  const wantsArticles = type === "all" || type === "article";

  const baseFilter: Record<string, unknown> = {};
  if (status) baseFilter.status = status;

  const videoFilter = { ...baseFilter, ...(search ? { title: { $regex: search, $options: "i" } } : {}) };
  const imageFilter = { ...baseFilter, ...(search ? { caption: { $regex: search, $options: "i" } } : {}) };
  const articleFilter = { ...baseFilter, ...(search ? { title: { $regex: search, $options: "i" } } : {}) };

  // This merges three separate collections into one paginated feed, which
  // means true DB-level skip/limit isn't possible without a $unionWith
  // aggregation - so each collection is capped at "enough rows to cover
  // every page up to the one being requested" instead of being fetched in
  // full. Without this cap, this endpoint re-fetched (and fully populated
  // the owner of) every single video/image/article on the platform on
  // every request, which got measurably slower as content was added - the
  // more content existed, the more there was to fetch and sort in memory
  // each time, even though only ~20 rows were ever actually shown.
  // .lean() skips Mongoose document hydration since this is read-only
  // display data, not something we call .save() on.
  const fetchCap = pageNum * limitNum + 60;

  const [videos, images, articles, videoTotal, imageTotal, articleTotal] = await Promise.all([
    wantsVideos ? Video.find(videoFilter).select("title thumbnailUrl status views createdAt owner").populate("owner", "username profile.displayName").sort({ createdAt: -1 }).limit(fetchCap).lean() : [],
    wantsImages ? Image.find(imageFilter).select("caption url status views createdAt owner").populate("owner", "username profile.displayName").sort({ createdAt: -1 }).limit(fetchCap).lean() : [],
    wantsArticles
      ? Article.find(articleFilter).select("title coverImageUrl status views createdAt owner").populate("owner", "username profile.displayName").sort({ createdAt: -1 }).limit(fetchCap).lean()
      : [],
    wantsVideos ? Video.countDocuments(videoFilter) : 0,
    wantsImages ? Image.countDocuments(imageFilter) : 0,
    wantsArticles ? Article.countDocuments(articleFilter) : 0,
  ]);

  const items = [
    ...videos.map((v) => ({
      id: String(v._id),
      contentType: "video" as const,
      title: v.title,
      thumbnailUrl: v.thumbnailUrl,
      status: v.status,
      views: v.views,
      owner: v.owner,
      createdAt: v.createdAt,
    })),
    ...images.map((i) => ({
      id: String(i._id),
      contentType: "image" as const,
      title: i.caption || "Untitled image",
      thumbnailUrl: i.url,
      status: i.status,
      views: i.views,
      owner: i.owner,
      createdAt: i.createdAt,
    })),
    ...articles.map((a) => ({
      id: String(a._id),
      contentType: "article" as const,
      title: a.title,
      thumbnailUrl: a.coverImageUrl,
      status: a.status,
      views: a.views,
      owner: a.owner,
      createdAt: a.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // newest first

  const total = videoTotal + imageTotal + articleTotal;
  const paged = items.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return ok({ items: paged, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});
