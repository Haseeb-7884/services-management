import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Image } from "../../../../lib/models/Image";
import { ApiError } from "../../../../lib/ApiError";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { requireAuth } from "../../../../lib/auth";
import { isModeratorOrAbove } from "../../../../lib/moderation";
import { deleteCloudinaryAsset } from "../../../../lib/cloudinary";

type Ctx = { params: Promise<{ id: string }> };

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const GET = withHandler<Ctx>(async (_req, ctx) => {
  await connectDB();
  const { id } = await ctx.params;
  const image = await Image.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).populate(
    "owner",
    "username profile.displayName profile.avatarUrl"
  );
  if (!image) throw ApiError.notFound("Image not found");
  return ok(image);
});

export const DELETE = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const user = await requireAuth(req);
  const { id } = await ctx.params;

  const image = await Image.findById(id);
  if (!image) throw ApiError.notFound("Image not found");

  const isOwner = String(image.owner) === user.id;
  if (!isOwner && !isModeratorOrAbove(user.role)) throw ApiError.forbidden();

  await deleteCloudinaryAsset(image.url, "image");
  await image.deleteOne();
  return ok(null, "Image deleted");
});
