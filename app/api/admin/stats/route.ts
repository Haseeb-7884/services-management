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
