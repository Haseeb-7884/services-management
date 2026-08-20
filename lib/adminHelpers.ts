import type { Model } from "mongoose";
import { Video } from "./models/Video";
import { Image } from "./models/Image";
import { Article } from "./models/Article";
import { User } from "./models/User";
import { ApiError } from "./ApiError";
import { ROLES, type Role } from "./constants/roles";
import type { AuthUser } from "./auth";

// Typed as Model<any> so TS doesn't try to unify Video's, Image's, and
// Article's distinct inferred schema types when all three are accessed
// through the same lookup map (see lib/models social route handlers for the
// same TARGET_MODELS pattern).
export const CONTENT_MODELS: Record<"video" | "image" | "article", Model<any>> = {
  video: Video,
  image: Image,
  article: Article,
};
export type ContentType = keyof typeof CONTENT_MODELS;

export function assertValidContentType(type: string): asserts type is ContentType {
  if (!(type in CONTENT_MODELS)) throw ApiError.badRequest(`Unknown content type: ${type}`);
}

export async function findTargetUser(username: string) {
  const target = await User.findOne({ username: username.toLowerCase() });
  if (!target) throw ApiError.notFound("User not found");
  return target;
}

export function assertNotOwner(target: { role: Role }) {
  if (target.role === ROLES.OWNER) {
    throw ApiError.forbidden("The Owner account cannot be modified");
  }
}

export function assertNotSelf(authUser: AuthUser, target: { _id: unknown }) {
  if (String(target._id) === authUser.id) {
    throw ApiError.badRequest("You cannot change your own role");
  }
}
