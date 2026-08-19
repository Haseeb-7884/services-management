import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/tokens.js";
import { User } from "../models/User.js";
import type { Role } from "../constants/roles.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string; role: Role };
    }
  }
}

/** Requires a valid access token. Populates req.user. */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Missing access token");
    }
    const token = header.slice("Bearer ".length);
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub).select("_id role status");
    if (!user) throw ApiError.unauthorized("User no longer exists");
    if (user.status !== "active") throw ApiError.forbidden("Account is not active");

    req.user = { id: user._id.toString(), role: user.role as Role };
    next();
  } catch (err) {
    next(ApiError.unauthorized("Invalid or expired access token"));
  }
}

/** Populates req.user if a valid token is present, but doesn't reject the request otherwise. */
export async function attachUserIfPresent(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();
  try {
    const payload = verifyAccessToken(header.slice("Bearer ".length));
    const user = await User.findById(payload.sub).select("_id role status");
    if (user && user.status === "active") {
      req.user = { id: user._id.toString(), role: user.role as Role };
    }
  } catch {
    // ignore invalid token for optional-auth routes
  }
  next();
}
