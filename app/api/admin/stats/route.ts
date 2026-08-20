import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { User } from "../../../../lib/models/User";
import { Video } from "../../../../lib/models/Video";
import { Image } from "../../../../lib/models/Image";
import { Article } from "../../../../lib/models/Article";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { requireAuth } from "../../../../lib/auth";
import { requireRole } from "../../../../lib/rbac";
import { ROLES, MAX_ADMIN_SLOTS } from "../../../../lib/constants/roles";

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const GET = withHandler(async (req: NextRequest) => {
  await connectDB();
  const user = await requireAuth(req);
  requireRole(user, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.OWNER);

  const [totalUsers, adminCount, creatorCount, pendingVideos, pendingImages, pendingArticles] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: ROLES.ADMIN }),
    User.countDocuments({ role: ROLES.CREATOR }),
    Video.countDocuments({ status: "pending" }),
    Image.countDocuments({ status: "pending" }),
    Article.countDocuments({ status: "pending" }),
  ]);

  return ok({
    totalUsers,
    adminSlotsUsed: adminCount,
    adminSlotsTotal: MAX_ADMIN_SLOTS,
    totalCreators: creatorCount,
    pendingContentCount: pendingVideos + pendingImages + pendingArticles,
  });
});
