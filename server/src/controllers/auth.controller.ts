import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import crypto from "node:crypto";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { created, ok } from "../utils/ApiResponse.js";
import {
  REFRESH_COOKIE_NAME,
  refreshCookieOptions,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js";
import { isProduction } from "../config/env.js";
import { ROLES } from "../constants/roles.js";

function issueTokens(res: Response, user: { _id: unknown; role: string; refreshTokenVersion: number }) {
  const id = String(user._id);
  const accessToken = signAccessToken({ sub: id, role: user.role as any });
  const refreshToken = signRefreshToken({ sub: id, tokenVersion: user.refreshTokenVersion });
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions(isProduction));
  return accessToken;
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, displayName } = req.body;

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

  // TODO(phase 0 follow-up): send verification email via Resend/SendGrid using
  // user.emailVerificationToken instead of auto-verifying.
  user.isEmailVerified = true;
  await user.save();

  const accessToken = issueTokens(res, user);
  created(res, { user, accessToken }, "Account created");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername.toLowerCase() }],
  }).select("+passwordHash");

  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Invalid credentials");
  }
  if (user.status !== "active") {
    throw ApiError.forbidden(`Account is ${user.status}`);
  }

  const accessToken = issueTokens(res, user);
  ok(res, { user, accessToken }, "Logged in");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
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

  const accessToken = issueTokens(res, user);
  ok(res, { accessToken }, "Token refreshed");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/v1/auth" });
  ok(res, null, "Logged out");
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) throw ApiError.notFound("User not found");
  ok(res, user);
});
