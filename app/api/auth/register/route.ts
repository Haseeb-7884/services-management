import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { User } from "../../../../lib/models/User";
import { ApiError } from "../../../../lib/ApiError";
import { created } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { REFRESH_COOKIE_NAME, refreshCookieOptions, signAccessToken, signRefreshToken } from "../../../../lib/tokens";
import { isProduction } from "../../../../lib/env";
import { ROLES } from "../../../../lib/constants/roles";

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
  const { username, email, password, displayName } = await req.json();

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    throw ApiError.conflict("An account with that email or username already exists");
  }

  const user = await User.create({
    username,
    email,
    passwordHash: password, // hashed in the pre-save hook
    role: ROLES.STANDARD,
    profile: { displayName: displayName ?? username },
    emailVerificationToken: crypto.randomBytes(32).toString("hex"),
  });

  // TODO(follow-up): send verification email via Resend/SendGrid using
  // user.emailVerificationToken instead of auto-verifying.
  user.isEmailVerified = true;
  await user.save();

  const id = String(user._id);
  const accessToken = signAccessToken({ sub: id, role: user.role as any });
  const refreshToken = signRefreshToken({ sub: id, tokenVersion: user.refreshTokenVersion });

  const res = created({ user, accessToken }, "Account created");
  res.cookies.set(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions(isProduction));
  return res;
});
