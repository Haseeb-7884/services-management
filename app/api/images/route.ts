import type { NextRequest } from "next/server";
import { connectDB } from "../../../lib/db";
import { Image } from "../../../lib/models/Image";
import { ApiError } from "../../../lib/ApiError";
import { created, ok } from "../../../lib/ApiResponse";
import { withHandler } from "../../../lib/handler";
import { requireAuth } from "../../../lib/auth";
import { requirePermission } from "../../../lib/rbac";
import { PERMISSIONS } from "../../../lib/constants/roles";
import { initialContentStatus } from "../../../lib/moderation";

export const GET = withHandler(async (req: NextRequest) => {
  await connectDB();
  const sp = req.nextUrl.searchParams;
  const category = sp.get("category") ?? undefined;
  const tag = sp.get("tag") ?? undefined;
  const search = sp.get("search") ?? undefined;
  const page = Number(sp.get("page") ?? "1");
  const limit = Number(sp.get("limit") ?? "24");

  const filter: Record<string, unknown> = { status: "approved" };
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (search) filter.$text = { $search: search };

  const pageNum = Math.max(1, page);
  const limitNum = Math.min(60, Math.max(1, limit));

  const [items, total] = await Promise.all([
    Image.find(filter)
      .populate("owner", "username profile.displayName profile.avatarUrl")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Image.countDocuments(filter),
  ]);

  return ok({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const POST = withHandler(async (req: NextRequest) => {
  await connectDB();
  const user = await requireAuth(req);
  requirePermission(user, PERMISSIONS.UPLOAD_CONTENT);

  const { caption, category, tags, url } = await req.json();
  if (!url) throw ApiError.badRequest("No image url - upload to Cloudinary first");

  const status = initialContentStatus(user.role);
  const image = await Image.create({
    owner: user.id,
    caption,
    category,
    tags: Array.isArray(tags) ? tags : tags ? String(tags).split(",").map((t) => t.trim()).filter(Boolean) : [],
    url,
    status,
  });

  return created(
    image,
    status === "pending" ? "Image uploaded — pending review before it's publicly visible" : "Image uploaded"
  );
});
