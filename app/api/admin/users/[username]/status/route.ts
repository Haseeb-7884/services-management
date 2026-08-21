import type { NextRequest } from "next/server";
import { connectDB } from "../../../../../../lib/db";
import { ApiError } from "../../../../../../lib/ApiError";
import { ok } from "../../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../../lib/handler";
import { requireAuth } from "../../../../../../lib/auth";
import { requirePermission } from "../../../../../../lib/rbac";
import { PERMISSIONS } from "../../../../../../lib/constants/roles";
import { assertNotOwner, assertNotSelf, findTargetUser } from "../../../../../../lib/adminHelpers";

type Ctx = { params: Promise<{ username: string }> };

const VALID_STATUSES = new Set(["active", "suspended", "banned"]);

// Suspending/banning a user isn't just cosmetic - lib/auth.ts's requireAuth()
// and the login route both already reject any non-"active" account (see
// `if (user.status !== "active") throw ApiError.forbidden(...)`), so this
// single field is the actual enforcement point, not just a label shown in a
// table. This route was the missing piece - the User model and every
// downstream check already supported it, there was just no way to set it
// from the UI.
export const dynamic = "force-dynamic";

export const PATCH = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const authUser = await requireAuth(req);
  requirePermission(authUser, PERMISSIONS.MANAGE_USERS);
  const { username } = await ctx.params;

  const { status } = await req.json();
  if (!VALID_STATUSES.has(status)) {
    throw ApiError.badRequest("Status must be one of: active, suspended, banned");
  }

  const target = await findTargetUser(username);
  assertNotOwner(target);
  assertNotSelf(authUser, target);

  target.status = status;
  await target.save();

  return ok(target, `${target.username}'s account is now ${status}`);
});
