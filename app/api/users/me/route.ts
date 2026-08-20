import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { User } from "../../../../lib/models/User";
import { ApiError } from "../../../../lib/ApiError";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { requireAuth } from "../../../../lib/auth";

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const PATCH = withHandler(async (req: NextRequest) => {
  await connectDB();
  const authUser = await requireAuth(req);
  const { displayName, bio, tagline, category, socialLinks } = await req.json();

  const update: Record<string, unknown> = {};
  if (displayName !== undefined) update["profile.displayName"] = displayName;
  if (bio !== undefined) update["profile.bio"] = bio;
  if (tagline !== undefined) update["profile.tagline"] = tagline;
  if (category !== undefined) update["profile.category"] = category;
  if (socialLinks !== undefined) {
    if (socialLinks.website !== undefined) update["profile.socialLinks.website"] = socialLinks.website;
    if (socialLinks.twitter !== undefined) update["profile.socialLinks.twitter"] = socialLinks.twitter;
    if (socialLinks.instagram !== undefined) update["profile.socialLinks.instagram"] = socialLinks.instagram;
    if (socialLinks.youtube !== undefined) update["profile.socialLinks.youtube"] = socialLinks.youtube;
  }

  const user = await User.findByIdAndUpdate(authUser.id, update, { new: true });
  if (!user) throw ApiError.notFound("User not found");
  return ok(user, "Profile updated");
});
