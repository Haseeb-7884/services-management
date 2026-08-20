import { connectDB } from "../../../../lib/db";
import { User } from "../../../../lib/models/User";
import { Video } from "../../../../lib/models/Video";
import { Image } from "../../../../lib/models/Image";
import { Article } from "../../../../lib/models/Article";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { ROLES } from "../../../../lib/constants/roles";

/**
 * Real, honest platform-wide counters for the Home page stats strip.
 * Deliberately does NOT include a "monthly views" or "countries reached"
 * figure - neither is derivable from current data (content only stores a
 * running views counter, not timestamped view events or viewer geo), and
 * this project fabricates real numbers rather than plausible-looking fake
 * ones.
 */
// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const GET = withHandler(async () => {
  await connectDB();
  const staffRoles = [ROLES.OWNER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR];

  const [totalUsers, activeCreators, videoCount, imageCount, articleCount, videoViews, imageViews, articleViews] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: { $nin: staffRoles } }),
      Video.countDocuments({ status: "approved" }),
      Image.countDocuments({ status: "approved" }),
      Article.countDocuments({ status: "approved" }),
      Video.aggregate([{ $match: { status: "approved" } }, { $group: { _id: null, sum: { $sum: "$views" } } }]),
      Image.aggregate([{ $match: { status: "approved" } }, { $group: { _id: null, sum: { $sum: "$views" } } }]),
      Article.aggregate([{ $match: { status: "approved" } }, { $group: { _id: null, sum: { $sum: "$views" } } }]),
    ]);

  const totalViews = (videoViews[0]?.sum ?? 0) + (imageViews[0]?.sum ?? 0) + (articleViews[0]?.sum ?? 0);

  return ok({
    totalUsers,
    activeCreators,
    contentPublished: videoCount + imageCount + articleCount,
    totalViews,
  });
});
