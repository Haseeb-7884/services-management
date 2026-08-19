import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { SubscriptionPlan } from "../models/SubscriptionPlan.js";
import { ApiError } from "../utils/ApiError.js";
import { created, ok } from "../utils/ApiResponse.js";

export const listPlans = asyncHandler(async (_req: Request, res: Response) => {
  const plans = await SubscriptionPlan.find({ isActive: true }).sort({ order: 1, monthly: 1 });
  ok(res, plans);
});

export const getPlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await SubscriptionPlan.findOne({ slug: req.params.slug, isActive: true });
  if (!plan) throw ApiError.notFound("Plan not found");
  ok(res, plan);
});

export const createPlan = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug, monthly, yearly, description, features, cta, highlight, badge, order } =
    req.body as Record<string, unknown>;
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

  created(res, plan, "Plan created");
});

export const updatePlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!plan) throw ApiError.notFound("Plan not found");
  ok(res, plan, "Plan updated");
});

export const deletePlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await SubscriptionPlan.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!plan) throw ApiError.notFound("Plan not found");
  ok(res, null, "Plan deactivated");
});
