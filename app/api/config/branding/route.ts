import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { getOrCreateConfig } from "../../../../lib/siteConfig";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { requireAuth } from "../../../../lib/auth";
import { requirePermission } from "../../../../lib/rbac";
import { PERMISSIONS } from "../../../../lib/constants/roles";

/** Public - the frontend calls this on boot to theme itself. No auth required. */
export const GET = withHandler(async () => {
  await connectDB();
  const config = await getOrCreateConfig();
  return ok(config);
});

/** Owner-only - update any branding field. Partial updates via dot-path merge. */
export const PATCH = withHandler(async (req: NextRequest) => {
  await connectDB();
  const user = await requireAuth(req);
  requirePermission(user, PERMISSIONS.MANAGE_BRANDING);

  const body = await req.json();
  const config = await getOrCreateConfig();
  config.set(body);
  await config.validate();
  await config.save();
  return ok(config, "Branding updated");
});
