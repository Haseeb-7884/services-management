import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { roleHasPermission, type Permission, type Role } from "../constants/roles.js";

/** Restrict a route to an explicit allow-list of roles. */
export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden("You do not have permission to perform this action"));
    }
    next();
  };
}

/** Restrict a route to roles that hold a given capability (see constants/roles.ts). */
export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roleHasPermission(req.user.role, permission)) {
      return next(ApiError.forbidden("You do not have permission to perform this action"));
    }
    next();
  };
}
