import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { User } from "../../../../lib/models/User";
import { ApiError } from "../../../../lib/ApiError";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import {
  REFRESH_COOKIE_NAME,
  refreshCookieOptions,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../../../lib/tokens";
import { isProduction } from "../../../../lib/env";

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
  const token = req.cookies.get(REFRESH_COOKIE_NAME)?.value;
  if (!token) throw ApiError.unauthorized("No refresh token");

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const user = await User.findById(payload.sub);
  if (!user || user.refreshTokenVersion !== payload.tokenVersion) {
    throw ApiError.unauthorized("Refresh token no longer valid");
  }

  const id = String(user._id);
  const accessToken = signAccessToken({ sub: id, role: user.role as any });
  const refreshToken = signRefreshToken({ sub: id, tokenVersion: user.refreshTokenVersion });

  const res = ok({ accessToken }, "Token refreshed");
  res.cookies.set(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions(isProduction));
  return res;
});
