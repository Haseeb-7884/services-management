import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const planFeatureSchema = new Schema(
  {
    text: { type: String, required: true },
    included: { type: Boolean, default: true },
  },
  { _id: false }
);

const subscriptionPlanSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    monthly: { type: Number, required: true, min: 0 },
    yearly: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    features: { type: [planFeatureSchema], default: [] },
    cta: { type: String, default: "Get Started" },
    highlight: { type: Boolean, default: false },
    badge: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export type SubscriptionPlanDocument = InferSchemaType<typeof subscriptionPlanSchema>;
export const SubscriptionPlan: Model<SubscriptionPlanDocument> =
  (models.SubscriptionPlan as Model<SubscriptionPlanDocument>) ??
  model<SubscriptionPlanDocument>("SubscriptionPlan", subscriptionPlanSchema);
