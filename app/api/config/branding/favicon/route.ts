import type { NextRequest } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { getOrCreateConfig } from "../../../../../lib/siteConfig";
import { ApiError } from "../../../../../lib/ApiError";
import { ok } from "../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../lib/handler";
import { requireAuth } from "../../../../../lib/auth";
import { requirePermission } from "../../../../../lib/rbac";
import { PERMISSIONS } from "../../../../../lib/constants/roles";

export const POST = withHandler(async (req: NextRequest) => {
  await connectDB();
  const user = await requireAuth(req);
  requirePermission(user, PERMISSIONS.MANAGE_BRANDING);

  const { url } = await req.json();
  if (!url) throw ApiError.badRequest("No file uploaded");

  const config = await getOrCreateConfig();
  config.faviconUrl = url;
  await config.save();
  return ok(config, "Favicon updated");
});
