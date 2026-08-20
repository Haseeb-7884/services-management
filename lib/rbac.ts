import { ApiError } from "./ApiError";
import { roleHasPermission, type Permission, type Role } from "./constants/roles";
import type { AuthUser } from "./auth";

/** Restrict to an explicit allow-list of roles. Throws ApiError.forbidden() otherwise. */
export function requireRole(user: AuthUser, ...roles: Role[]) {
  if (!roles.includes(user.role)) {
    throw ApiError.forbidden("You do not have permission to perform this action");
  }
}

/** Restrict to roles that hold a given capability (see lib/constants/roles.ts). */
export function requirePermission(user: AuthUser, permission: Permission) {
  if (!roleHasPermission(user.role, permission)) {
    throw ApiError.forbidden("You do not have permission to perform this action");
  }
}
