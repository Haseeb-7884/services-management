import type { NextRequest } from "next/server";
import { ApiError } from "./ApiError";
import { verifyAccessToken } from "./tokens";
import { User } from "./models/User";
import { connectDB } from "./db";
import type { Role } from "./constants/roles";

export interface AuthUser {
  id: string;
  role: Role;
}

/** Requires a valid access token. Throws ApiError.unauthorized() otherwise - call from inside withHandler(). */
export async function requireAuth(req: NextRequest): Promise<AuthUser> {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Missing access token");
  }
  const token = header.slice("Bearer ".length);

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw ApiError.unauthorized("Invalid or expired access token");
  }

  await connectDB();
  const user = await User.findById(payload.sub).select("_id role status");
  if (!user) throw ApiError.unauthorized("User no longer exists");
  if (user.status !== "active") throw ApiError.forbidden("Account is not active");

  return { id: user._id.toString(), role: user.role as Role };
}

/** Returns the authenticated user if a valid token is present, or null otherwise - never throws. */
export async function attachUserIfPresent(req: NextRequest): Promise<AuthUser | null> {
  try {
    return await requireAuth(req);
  } catch {
    return null;
  }
}
