import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Video } from "../../../../lib/models/Video";
import { Image } from "../../../../lib/models/Image";
import { Article } from "../../../../lib/models/Article";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { OWNER_SELECT, mapArticle, mapImage, mapVideo } from "../../../../lib/feed";

/**
 * Trending rail - same merge approach as /api/feed, but ranked by a simple
 * Hacker-News-style score (engagement weighted, decayed by age) instead of
 * pure recency. Looks at approved content from the last 30 days so a
 * three-year-old viral post doesn't permanently camp the rail.
 */
export const GET = withHandler(async (req: NextRequest) => {
  await connectDB();
  const limitNum = Math.min(30, Math.max(1, Number(req.nextUrl.searchParams.get("limit") ?? "10")));

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

  return ok(scored.slice(0, limitNum).map(({ score: _score, ...item }) => item));
});
