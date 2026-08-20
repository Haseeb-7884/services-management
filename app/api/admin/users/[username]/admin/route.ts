import type { NextRequest } from "next/server";
import { connectDB } from "../../../../../../lib/db";
import { User } from "../../../../../../lib/models/User";
import { ApiError } from "../../../../../../lib/ApiError";
import { ok } from "../../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../../lib/handler";
import { requireAuth } from "../../../../../../lib/auth";
import { requireRole } from "../../../../../../lib/rbac";
import { ROLES, MAX_ADMIN_SLOTS } from "../../../../../../lib/constants/roles";
import { assertNotOwner, assertNotSelf, findTargetUser } from "../../../../../../lib/adminHelpers";

type Ctx = { params: Promise<{ username: string }> };

// Only Super Admin/Owner hand out the 5 Admin slots. There is deliberately
// no route to promote/revoke Super Admin itself - Owner is the single,
// fixed top authority (it already carries every Super Admin permission and
// more), not a role that gets assigned to other people.
export const POST = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const authUser = await requireAuth(req);
  requireRole(authUser, ROLES.SUPER_ADMIN, ROLES.OWNER);
  const { username } = await ctx.params;

  const target = await findTargetUser(username);
  assertNotOwner(target);
  assertNotSelf(authUser, target);

  if (target.role === ROLES.ADMIN) throw ApiError.conflict("This user is already an Admin");
  if (target.role === ROLES.SUPER_ADMIN) {
    throw ApiError.badRequest("This user is a Super Admin - revoke that first if you want to reassign them");
  }

  const currentAdminCount = await User.countDocuments({ role: ROLES.ADMIN });
  if (currentAdminCount >= MAX_ADMIN_SLOTS) {
    throw ApiError.conflict(`All ${MAX_ADMIN_SLOTS} Admin slots are filled. Revoke one before assigning another.`);
  }

  target.previousRole = target.role;
  target.role = ROLES.ADMIN;
  await target.save();

  return ok(target, `${target.username} is now an Admin`);
});

export const DELETE = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const authUser = await requireAuth(req);
  requireRole(authUser, ROLES.SUPER_ADMIN, ROLES.OWNER);
  const { username } = await ctx.params;

  const target = await findTargetUser(username);
  assertNotSelf(authUser, target);

  if (target.role !== ROLES.ADMIN) throw ApiError.badRequest("This user is not currently an Admin");

  // The Admin slot is a role, not a possession - the moderation queue and
  // pending-content state are global, not owned by whoever held the slot,
  // so freeing it here never loses anything for whoever gets it next.
  target.role = target.previousRole ?? ROLES.CREATOR;
  target.previousRole = null as any;
  await target.save();

  return ok(target, `Admin access revoked from ${target.username}`);
});
