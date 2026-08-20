import type { NextRequest } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { getOrCreateConfig } from "../../../../../lib/siteConfig";
import { ApiError } from "../../../../../lib/ApiError";
import { ok } from "../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../lib/handler";
import { requireAuth } from "../../../../../lib/auth";
import { requirePermission } from "../../../../../lib/rbac";
import { PERMISSIONS } from "../../../../../lib/constants/roles";

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

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
