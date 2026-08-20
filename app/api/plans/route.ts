import type { NextRequest } from "next/server";
import { connectDB } from "../../../lib/db";
import { SubscriptionPlan } from "../../../lib/models/SubscriptionPlan";
import { ApiError } from "../../../lib/ApiError";
import { created, ok } from "../../../lib/ApiResponse";
import { withHandler } from "../../../lib/handler";
import { requireAuth } from "../../../lib/auth";
import { requirePermission } from "../../../lib/rbac";
import { PERMISSIONS } from "../../../lib/constants/roles";

export const GET = withHandler(async () => {
  await connectDB();
  const plans = await SubscriptionPlan.find({ isActive: true }).sort({ order: 1, monthly: 1 });
  return ok(plans);
});

export const POST = withHandler(async (req: NextRequest) => {
  await connectDB();
  const user = await requireAuth(req);
  requirePermission(user, PERMISSIONS.MANAGE_SUBSCRIPTION_PLANS);

  const { name, slug, monthly, yearly, description, features, cta, highlight, badge, order } = await req.json();
  if (!name) throw ApiError.badRequest("name is required");
  if (!slug) throw ApiError.badRequest("slug is required");
  if (monthly === undefined) throw ApiError.badRequest("monthly is required");
  if (yearly === undefined) throw ApiError.badRequest("yearly is required");

  const plan = await SubscriptionPlan.create({
    name,
    slug: String(slug).toLowerCase(),
    monthly,
    yearly,
    description,
    features,
    cta,
    highlight,
    badge,
    order,
  });

  return created(plan, "Plan created");
});
