import { connectDB } from "../../../../lib/db";
import { SubscriptionPlan } from "../../../../lib/models/SubscriptionPlan";
import { ApiError } from "../../../../lib/ApiError";
import { ok } from "../../../../lib/ApiResponse";
import { withHandler } from "../../../../lib/handler";

type Ctx = { params: Promise<{ slug: string }> };

export const GET = withHandler<Ctx>(async (_req, ctx) => {
  await connectDB();
  const { slug } = await ctx.params;
  const plan = await SubscriptionPlan.findOne({ slug, isActive: true });
  if (!plan) throw ApiError.notFound("Plan not found");
  return ok(plan);
});
