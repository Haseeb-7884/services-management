import { connectDB } from "../../../../lib/db";
import { SubscriptionPlan } from "../../../../lib/models/SubscriptionPlan";
import { ApiError } from "../../../../lib/ApiError";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";

type Ctx = { params: Promise<{ slug: string }> };

// Every route here hits a live database (and most require auth via
// cookies/headers) - force dynamic so Next.js never tries to execute
// and statically cache any of these at build time. Without this, a
// GET-only handler with no request-specific reads can get silently
// picked up for static optimization and run during `next build`,
// which crashes the whole build if the DB isn't reachable from the
// build environment (e.g. Netlify's build servers).
export const dynamic = "force-dynamic";

export const GET = withHandler<Ctx>(async (_req, ctx) => {
  await connectDB();
  const { slug } = await ctx.params;
  const plan = await SubscriptionPlan.findOne({ slug, isActive: true });
  if (!plan) throw ApiError.notFound("Plan not found");
  return ok(plan);
});
