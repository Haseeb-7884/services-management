import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Video } from "../../../../lib/models/Video";
import { Image } from "../../../../lib/models/Image";
import { Article } from "../../../../lib/models/Article";
import { User } from "../../../../lib/models/User";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { requireAuth } from "../../../../lib/auth";
import { requirePermission } from "../../../../lib/rbac";
import { PERMISSIONS } from "../../../../lib/constants/roles";

/**
 * Real aggregation across the caller's own Video/Image/Article docs.
 *
 * Note on "weeklyViews": the content models only store a running `views`
 * counter, not per-view timestamped events, so a genuine day-by-day views
 * trend isn't derivable from current data. This endpoint returns real
 * totals + a real content list; a true weekly trend would need a
 * separate ViewEvent log (flagged as follow-up work, not faked here).
 */
export const GET = withHandler(async (req: NextRequest) => {
  await connectDB();
  const authUser = await requireAuth(req);
  requirePermission(authUser, PERMISSIONS.ACCESS_CREATOR_DASHBOARD);
  const ownerId = authUser.id;

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
  ].sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime());

  const totalViews = allContent.reduce((sum, c) => sum + (c.views ?? 0), 0);
  const totalLikes = allContent.reduce((sum, c) => sum + (c.likesCount ?? 0), 0);

  return ok({
    stats: {
      totalViews,
      followers: user?.followersCount ?? 0,
      totalLikes,
      contentCount: allContent.length,
    },
    content: allContent,
  });
});
