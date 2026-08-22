import type { NextRequest } from "next/server";
import { connectDB } from "../../../lib/db";
import { SubscriptionPlan } from "../../../lib/models/SubscriptionPlan";
import { ApiError } from "../../../lib/ApiError";
import { created, ok } from "../../../lib/ApiResponse";
import { withHandler } from "../../../lib/handler";
import { requireAuth } from "../../../lib/auth";
import { requirePermission } from "../../../lib/rbac";
import { PERMISSIONS } from "../../../lib/constants/roles";

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const GET = withHandler(async (req: NextRequest) => {
  await connectDB();

  // Public pricing page only ever wants active plans - but the SuperAdmin
  // plans manager needs to see deactivated ones too (so they can be
  // reactivated instead of recreated from scratch). Gate that wider view
  // behind the same permission the write routes below already require,
  // rather than exposing every plan to anyone who adds a query param.
  const wantsAll = req.nextUrl.searchParams.get("all") === "true";
  if (wantsAll) {
    const user = await requireAuth(req);
    requirePermission(user, PERMISSIONS.MANAGE_SUBSCRIPTION_PLANS);
    const plans = await SubscriptionPlan.find({}).sort({ order: 1, monthly: 1 });
    return ok(plans);
  }

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
