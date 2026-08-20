import type { NextRequest } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { SubscriptionPlan } from "../../../../../lib/models/SubscriptionPlan";
import { ApiError } from "../../../../../lib/ApiError";
import { ok } from "../../../../../lib/ApiResponse";
import { withHandler } from "../../../../../lib/handler";
import { requireAuth } from "../../../../../lib/auth";
import { requirePermission } from "../../../../../lib/rbac";
import { PERMISSIONS } from "../../../../../lib/constants/roles";

// Separate /plans/id/[id] path (instead of reusing /plans/[slug]) so PATCH/
// DELETE-by-id can't collide with the public GET /plans/[slug] route -
// Next.js doesn't allow two dynamic segments with different param names at
// the same path level ([slug] vs [id]), unlike Express which resolved this
// by declaration order.
type Ctx = { params: Promise<{ id: string }> };

export const PATCH = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const user = await requireAuth(req);
  requirePermission(user, PERMISSIONS.MANAGE_SUBSCRIPTION_PLANS);
  const { id } = await ctx.params;

  const body = await req.json();
  const plan = await SubscriptionPlan.findByIdAndUpdate(id, body, { new: true });
  if (!plan) throw ApiError.notFound("Plan not found");
  return ok(plan, "Plan updated");
});

export const DELETE = withHandler<Ctx>(async (req: NextRequest, ctx) => {
  await connectDB();
  const user = await requireAuth(req);
  requirePermission(user, PERMISSIONS.MANAGE_SUBSCRIPTION_PLANS);
  const { id } = await ctx.params;

  const plan = await SubscriptionPlan.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!plan) throw ApiError.notFound("Plan not found");
  return ok(null, "Plan deactivated");
});
