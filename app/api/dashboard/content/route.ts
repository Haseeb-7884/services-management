import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Video } from "../../../../lib/models/Video";
import { Image } from "../../../../lib/models/Image";
import { Article } from "../../../../lib/models/Article";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { requireAuth } from "../../../../lib/auth";
import { requirePermission } from "../../../../lib/rbac";
import { PERMISSIONS } from "../../../../lib/constants/roles";

export const GET = withHandler(async (req: NextRequest) => {
  await connectDB();
  const authUser = await requireAuth(req);
  requirePermission(authUser, PERMISSIONS.ACCESS_CREATOR_DASHBOARD);
  const ownerId = authUser.id;

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
  ].sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime());

  return ok(items);
});
