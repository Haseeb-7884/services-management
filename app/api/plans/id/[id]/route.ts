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

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

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
