import type { NextRequest } from "next/server";
import { connectDB } from "../../../lib/db";
import { Video } from "../../../lib/models/Video";
import { ApiError } from "../../../lib/ApiError";
import { created, ok } from "../../../lib/ApiResponse";
import { withHandler } from "../../../lib/handler";
import { requireAuth } from "../../../lib/auth";
import { requirePermission } from "../../../lib/rbac";
import { PERMISSIONS } from "../../../lib/constants/roles";
import { deriveVideoThumbnail } from "../../../lib/cloudinary";
import { initialContentStatus } from "../../../lib/moderation";

export const GET = withHandler(async (req: NextRequest) => {
  await connectDB();
  const sp = req.nextUrl.searchParams;
  const category = sp.get("category") ?? undefined;
  const tag = sp.get("tag") ?? undefined;
  const search = sp.get("search") ?? undefined;
  const isShort = sp.get("isShort") ?? undefined;
  const page = Number(sp.get("page") ?? "1");
  const limit = Number(sp.get("limit") ?? "20");

  const filter: Record<string, unknown> = { status: "approved" };
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (isShort !== undefined) filter.isShort = isShort === "true";
  if (search) filter.$text = { $search: search };

  const pageNum = Math.max(1, page);
  const limitNum = Math.min(50, Math.max(1, limit));

  const [items, total] = await Promise.all([
    Video.find(filter)
      .populate("owner", "username profile.displayName profile.avatarUrl")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Video.countDocuments(filter),
  ]);

  return ok({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

/**
 * Unlike the old Express controller, the file itself is NOT in this
 * request - the browser already uploaded it directly to Cloudinary (see
 * /api/uploads/sign). This body is just the resulting `url` plus metadata,
 * so it stays small and fast regardless of video size.
 */
export const POST = withHandler(async (req: NextRequest) => {
  await connectDB();
  const user = await requireAuth(req);
  requirePermission(user, PERMISSIONS.UPLOAD_CONTENT);

  const { title, description, category, tags, isShort, url } = await req.json();
  if (!title) throw ApiError.badRequest("Title is required");
  if (!url) throw ApiError.badRequest("No video url - upload to Cloudinary first");

  const thumbnailUrl = deriveVideoThumbnail(url);
  const status = initialContentStatus(user.role);

  const video = await Video.create({
    owner: user.id,
    title,
    description,
    category,
    isShort: isShort === true || isShort === "true",
    tags: Array.isArray(tags) ? tags : tags ? String(tags).split(",").map((t) => t.trim()).filter(Boolean) : [],
    url,
    thumbnailUrl,
    status,
  });

  return created(
    video,
    status === "pending" ? "Video uploaded — pending review before it's publicly visible" : "Video uploaded"
  );
});
