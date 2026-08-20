import type { Role } from "./constants/roles";

/** Moderator and above are trusted to publish immediately; everyone else's
 *  uploads enter the moderation queue and need an Admin (or above) to
 *  approve them before they're publicly visible. */
const TRUSTED_ROLES = new Set<Role>(["owner", "super_admin", "admin", "moderator"]);

export function isModeratorOrAbove(role: Role): boolean {
  return TRUSTED_ROLES.has(role);
}

export function initialContentStatus(role: Role): "approved" | "pending" {
  return TRUSTED_ROLES.has(role) ? "approved" : "pending";
}
