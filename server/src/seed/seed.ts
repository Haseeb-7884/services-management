import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { SiteConfig } from "../models/SiteConfig.js";
import { SubscriptionPlan } from "../models/SubscriptionPlan.js";
import { ROLES } from "../constants/roles.js";
import mongoose from "mongoose";

// Mirrors client/src/data/mockContent.ts's mockPricingPlans exactly, so the
// Pricing page renders identical content once it's switched from dummy data
// to this real endpoint (GET /api/v1/plans).
const DEFAULT_PLANS = [
  {
    name: "Free",
    slug: "free",
    monthly: 0,
    yearly: 0,
    description: "Everything you need to start creating and sharing content.",
    features: [
      { text: "5 GB storage", included: true },
      { text: "Publish unlimited posts", included: true },
      { text: "Basic analytics", included: true },
      { text: "HD video uploads (up to 720p)", included: true },
      { text: "Custom channel branding", included: false },
      { text: "Monetization tools", included: false },
    ],
    cta: "Get Started",
    highlight: false,
    order: 1,
  },
  {
    name: "Premium",
    slug: "premium",
    monthly: 12,
    yearly: 8,
    description: "Unlock the full creative toolkit for serious creators.",
    features: [
      { text: "50 GB storage", included: true },
      { text: "Publish unlimited posts", included: true },
      { text: "Advanced analytics & insights", included: true },
      { text: "4K video uploads", included: true },
      { text: "Custom channel branding", included: true },
      { text: "Monetization tools", included: false },
    ],
    cta: "Start Free Trial",
    highlight: true,
    badge: "Most Popular",
    order: 2,
  },
  {
    name: "Creator Pro",
    slug: "creator-pro",
    monthly: 39,
    yearly: 28,
    description: "For professional creators ready to turn passion into revenue.",
    features: [
      { text: "500 GB storage", included: true },
      { text: "Publish unlimited posts", included: true },
      { text: "Full analytics suite + exports", included: true },
      { text: "8K video uploads", included: true },
      { text: "Custom channel branding", included: true },
      { text: "Monetization tools & payouts", included: true },
    ],
    cta: "Go Pro",
    highlight: false,
    order: 3,
  },
];

/**
 * Run with `npm run seed` (server/). Idempotent: safe to re-run.
 * Creates the single Owner account (from OWNER_* env vars) and the default
 * SiteConfig document if they don't already exist.
 */
async function seed() {
  await connectDB();

  const existingOwner = await User.findOne({ role: ROLES.OWNER });
  if (existingOwner) {
    console.log(`[seed] Owner already exists: ${existingOwner.username}`);
  } else {
    const owner = await User.create({
      username: env.owner.username,
      email: env.owner.email,
      passwordHash: env.owner.password, // hashed by pre-save hook
      role: ROLES.OWNER,
      isEmailVerified: true,
      profile: { displayName: "Owner" },
    });
    console.log(`[seed] Created Owner account: ${owner.username} <${owner.email}>`);
    console.log(`[seed] Login with the password set in OWNER_PASSWORD, then change it.`);
  }

  // findOne + create (not findOneAndUpdate upsert) so nested schema defaults
  // (theme.colors, footer, seoDefaults) actually get applied - see the note
  // in controllers/config.controller.ts for why upsert alone silently
  // produces a config doc with no theme at all.
  let config = await SiteConfig.findOne({ slug: "default" });
  if (!config) {
    config = await SiteConfig.create({ slug: "default" });
    console.log("[seed] Created default SiteConfig with seeded theme");
  } else if (!config.theme?.colors?.primary) {
    const defaults = new SiteConfig({ slug: "default" });
    config.theme = defaults.theme;
    if (!config.homepageLayout?.length) config.homepageLayout = defaults.homepageLayout;
    if (!config.footer) config.footer = defaults.footer;
    if (!config.seoDefaults) config.seoDefaults = defaults.seoDefaults;
    await config.save();
    console.log("[seed] Repaired an existing SiteConfig doc that was missing its theme");
  } else {
    console.log("[seed] SiteConfig already present and healthy");
  }

  const planCount = await SubscriptionPlan.countDocuments();
  if (planCount === 0) {
    await SubscriptionPlan.insertMany(DEFAULT_PLANS);
    console.log(`[seed] Created ${DEFAULT_PLANS.length} default subscription plans`);
  } else {
    console.log("[seed] Subscription plans already present");
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
