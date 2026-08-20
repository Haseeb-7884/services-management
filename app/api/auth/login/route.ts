import type { NextRequest } from "next/server";
import { connectDB } from "../../../../lib/db";
import { User } from "../../../../lib/models/User";
import { ApiError } from "../../../../lib/ApiError";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";
import { REFRESH_COOKIE_NAME, refreshCookieOptions, signAccessToken, signRefreshToken } from "../../../../lib/tokens";
import { isProduction } from "../../../../lib/env";

export const POST = withHandler(async (req: NextRequest) => {
  await connectDB();
  const { emailOrUsername, password } = await req.json();

  const user = await User.findOne({
    $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername.toLowerCase() }],
  }).select("+passwordHash");

  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Invalid credentials");
  }
  if (user.status !== "active") {
    throw ApiError.forbidden(`Account is ${user.status}`);
  }

  const id = String(user._id);
  const accessToken = signAccessToken({ sub: id, role: user.role as any });
  const refreshToken = signRefreshToken({ sub: id, tokenVersion: user.refreshTokenVersion });

  const res = ok({ user, accessToken }, "Logged in");
  res.cookies.set(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions(isProduction));
  return res;
});
