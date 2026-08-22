import type { NextRequest } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { Video } from "../../../../../lib/models/Video";
import { Image } from "../../../../../lib/models/Image";
import { Article } from "../../../../../lib/models/Article";
import { ok } from "../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../lib/handler";
import { requireAuth } from "../../../../../lib/auth";
import { requireRole } from "../../../../../lib/rbac";
import { ROLES } from "../../../../../lib/constants/roles";

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const GET = withHandler(async (req: NextRequest) => {
  await connectDB();
  const authUser = await requireAuth(req);
  requireRole(authUser, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.OWNER);

  const sp = req.nextUrl.searchParams;
  const type = sp.get("type") ?? "all";
  const pageNum = Math.max(1, Number(sp.get("page") ?? "1"));
  const limitNum = Math.min(60, Math.max(1, Number(sp.get("limit") ?? "20")));

  const wantsVideos = type === "all" || type === "video";
  const wantsImages = type === "all" || type === "image";
  const wantsArticles = type === "all" || type === "article";

  // Capped like /api/feed and /api/admin/content - merging three
  // collections into one page means true DB-level skip/limit isn't
  // possible, so each is bounded to "enough for every page up to this
  // one" instead of fetching the entire pending queue every time.
  const fetchCap = pageNum * limitNum + 60;

  const [videos, images, articles] = await Promise.all([
    wantsVideos
      ? Video.find({ status: "pending" }).select("title thumbnailUrl createdAt owner").populate("owner", "username profile.displayName").sort({ createdAt: -1 }).limit(fetchCap).lean()
      : [],
    wantsImages
      ? Image.find({ status: "pending" }).select("caption url createdAt owner").populate("owner", "username profile.displayName").sort({ createdAt: -1 }).limit(fetchCap).lean()
      : [],
    wantsArticles
      ? Article.find({ status: "pending" }).select("title coverImageUrl createdAt owner").populate("owner", "username profile.displayName").sort({ createdAt: -1 }).limit(fetchCap).lean()
      : [],
  ]);

  const items = [
    ...videos.map((v) => ({
      id: String(v._id),
      contentType: "video" as const,
      title: v.title,
      thumbnailUrl: v.thumbnailUrl,
      owner: v.owner,
      createdAt: v.createdAt,
    })),
    ...images.map((i) => ({
      id: String(i._id),
      contentType: "image" as const,
      title: i.caption || "",
      thumbnailUrl: i.url,
      owner: i.owner,
      createdAt: i.createdAt,
    })),
    ...articles.map((a) => ({
      id: String(a._id),
      contentType: "article" as const,
      title: a.title,
      thumbnailUrl: a.coverImageUrl,
      owner: a.owner,
      createdAt: a.createdAt,
    })),
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); // oldest first

  const total = items.length;
  const paged = items.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return ok({ items: paged, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});
