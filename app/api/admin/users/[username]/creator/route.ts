import type { NextRequest } from "next/server";
import { connectDB } from "../../../../../../lib/db";
import { ApiError } from "../../../../../../lib/ApiError";
import { ok } from "../../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../../lib/handler";
import { requireAuth } from "../../../../../../lib/auth";
import { requireRole } from "../../../../../../lib/rbac";
import { ROLES, type Role } from "../../../../../../lib/constants/roles";
import { assertNotOwner, findTargetUser } from "../../../../../../lib/adminHelpers";

type Ctx = { params: Promise<{ username: string }> };

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const POST = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const authUser = await requireAuth(req);
  requireRole(authUser, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.OWNER);
  const { username } = await ctx.params;

  const target = await findTargetUser(username);
  assertNotOwner(target);

  const elevatedRoles: Role[] = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MODERATOR];
  if (elevatedRoles.includes(target.role as Role)) {
    throw ApiError.badRequest("This user already has access above Creator level");
  }
  if (target.role === ROLES.CREATOR) throw ApiError.conflict("This user is already a Creator");

  target.role = ROLES.CREATOR;
  await target.save();

  return ok(target, `${target.username} is now a Creator`);
});

export const DELETE = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const authUser = await requireAuth(req);
  requireRole(authUser, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.OWNER);
  const { username } = await ctx.params;

  const target = await findTargetUser(username);
  if (target.role !== ROLES.CREATOR) throw ApiError.badRequest("This user is not currently a Creator");

  target.role = ROLES.STANDARD;
  await target.save();

  return ok(target, `Creator status revoked from ${target.username}`);
});
