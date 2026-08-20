export const ROLES = {
  OWNER: "owner",
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MODERATOR: "moderator",
  CREATOR: "creator",
  PREMIUM: "premium",
  STANDARD: "standard",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES: Role[] = Object.values(ROLES);

/**
 * Coarse-grained capability map. This is the single source of truth for
 * "what can this role do" and is consumed by both the RBAC helpers and
 * (via /api/config/permissions, future work) the frontend, so role
 * capabilities can eventually be tuned by the Owner without a redeploy
 * instead of being scattered across `if (role === 'admin')` checks.
 */
export const PERMISSIONS = {
  MANAGE_OWNER: "manage_owner",
  MANAGE_SUPER_ADMINS: "manage_super_admins",
  MANAGE_ADMINS: "manage_admins",
  MANAGE_MODERATORS: "manage_moderators",
  MANAGE_USERS: "manage_users",
  MANAGE_CONTENT: "manage_content",
  MODERATE_CONTENT: "moderate_content",
  MANAGE_CATEGORIES: "manage_categories",
  MANAGE_REPORTS: "manage_reports",
  MANAGE_BRANDING: "manage_branding",
  MANAGE_SUBSCRIPTION_PLANS: "manage_subscription_plans",
  VIEW_ANALYTICS: "view_analytics",
  VIEW_REVENUE: "view_revenue",
  UPLOAD_CONTENT: "upload_content",
  ACCESS_CREATOR_DASHBOARD: "access_creator_dashboard",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.OWNER]: Object.values(PERMISSIONS), // everything
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.MANAGE_ADMINS,
    PERMISSIONS.MANAGE_MODERATORS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MANAGE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MODERATE_CONTENT,
    PERMISSIONS.MANAGE_REPORTS,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MANAGE_CONTENT,
  ],
  [ROLES.MODERATOR]: [PERMISSIONS.MODERATE_CONTENT, PERMISSIONS.MANAGE_REPORTS],
  [ROLES.CREATOR]: [PERMISSIONS.UPLOAD_CONTENT, PERMISSIONS.ACCESS_CREATOR_DASHBOARD],
  [ROLES.PREMIUM]: [PERMISSIONS.UPLOAD_CONTENT],
  // Baseline users can still upload (the platform's core feature) - Premium/
  // Creator only add higher limits and extra dashboards on top of this.
  [ROLES.STANDARD]: [PERMISSIONS.UPLOAD_CONTENT],
};

/** Per-role upload ceilings, enforced in content route handlers. Owner can move these to SiteConfig later. */
export const UPLOAD_LIMITS_MB: Record<Role, number> = {
  [ROLES.OWNER]: 2048,
  [ROLES.SUPER_ADMIN]: 2048,
  [ROLES.ADMIN]: 1024,
  [ROLES.MODERATOR]: 512,
  [ROLES.CREATOR]: 1024,
  [ROLES.PREMIUM]: 512,
  [ROLES.STANDARD]: 100,
};

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/** Roles that are immune to being edited/deleted/demoted by anyone but themselves. */
export const PROTECTED_ROLES: Role[] = [ROLES.OWNER];

/**
 * Hard cap on concurrently-active Admins platform-wide. Super Admin (and
 * Owner) assign these 5 seats among any registered user; revoking a seat
 * frees it up for someone else rather than the role belonging permanently
 * to one person. Moderation queue state is global/shared (not owned by an
 * individual Admin), so reassigning a seat never loses in-progress work.
 */
export const MAX_ADMIN_SLOTS = 5;
