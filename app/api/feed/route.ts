import type { NextRequest } from "next/server";
import { connectDB } from "../../../lib/db";
import { Video } from "../../../lib/models/Video";
import { Image } from "../../../lib/models/Image";
import { Article } from "../../../lib/models/Article";
import { ok } from "../../../lib/ApiResponse";
import { withHandler } from "../../../lib/handler";
import { OWNER_SELECT, mapArticle, mapImage, mapVideo } from "../../../lib/feed";

/**
 * Combined public discovery feed - merges approved Video/Image/Article into
 * one reverse-chronological stream for the Home page's "For You" section.
 * Three collections are queried and merged in application code rather than
 * a single $unionWith aggregation - fine at this project's scale, would
 * need a database-side aggregation + real cursor if a single feed page
 * ever needs to scan many thousands of rows per collection.
 */
export const GET = withHandler(async (req: NextRequest) => {
  await connectDB();
  const sp = req.nextUrl.searchParams;
  const type = sp.get("type") ?? "all";
  const category = sp.get("category") ?? undefined;
  const pageNum = Math.max(1, Number(sp.get("page") ?? "1"));
  const limitNum = Math.min(50, Math.max(1, Number(sp.get("limit") ?? "12")));

  const wantsVideos = type === "all" || type === "video" || type === "short";
  const wantsImages = type === "all" || type === "image";
  const wantsArticles = type === "all" || type === "article";

  const fetchCap = pageNum * limitNum + 60;

  const videoFilter: Record<string, unknown> = { status: "approved" };
  if (category) videoFilter.category = category;
  if (type === "video") videoFilter.isShort = false;
  if (type === "short") videoFilter.isShort = true;

  const imageFilter: Record<string, unknown> = { status: "approved" };
  if (category) imageFilter.category = category;

  const articleFilter: Record<string, unknown> = { status: "approved" };
  if (category) articleFilter.category = category;

  const [videos, images, articles] = await Promise.all([
    wantsVideos ? Video.find(videoFilter).populate("owner", OWNER_SELECT).sort({ createdAt: -1 }).limit(fetchCap) : [],
    wantsImages ? Image.find(imageFilter).populate("owner", OWNER_SELECT).sort({ createdAt: -1 }).limit(fetchCap) : [],
    wantsArticles ? Article.find(articleFilter).populate("owner", OWNER_SELECT).sort({ createdAt: -1 }).limit(fetchCap) : [],
  ]);

  const merged = [...videos.map(mapVideo), ...images.map(mapImage), ...articles.map(mapArticle)].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const total = merged.length;
  const paged = merged.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return ok({ items: paged, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});
