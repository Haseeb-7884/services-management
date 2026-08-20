import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Singleton document (findOneAndUpdate with upsert, always the same slug)
 * holding every brand-able value in the system. Nothing in the frontend
 * should hardcode a site name, color, or logo - it all reads from here.
 */
const siteConfigSchema = new Schema(
  {
    slug: { type: String, default: "default", unique: true },

    siteName: { type: String, default: "SocialGrowth" },
    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },

    // Seed values below match the original client's light theme 1:1.
    // Light surfaces, neutral zinc text/borders, cyan kept only as a
    // restrained accent (buttons/links/active states) rather than a
    // pervasive tint - still 100% editable from the Owner branding page.
    theme: {
      colors: {
        primary: { type: String, default: "#0891b2" },
        secondary: { type: String, default: "#06b6d4" },
        backgroundStart: { type: String, default: "#f8fafc" },
        backgroundEnd: { type: String, default: "#ffffff" },
        textPrimary: { type: String, default: "#18181b" },
        textMuted: { type: String, default: "#71717a" },
      },
      fontFamily: { type: String, default: "Poppins, -apple-system, 'Segoe UI', sans-serif" },
    },

    homepageLayout: {
      type: [String],
      default: [
        "hero",
        "trending",
        "content_types",
        "why_choose_us",
        "pricing",
        "trusted",
        "testimonials",
        "cta",
      ],
    },

    footer: {
      text: { type: String, default: "" },
      links: [
        {
          label: String,
          url: String,
        },
      ],
    },

    seoDefaults: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      ogImageUrl: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export type SiteConfigDocument = InferSchemaType<typeof siteConfigSchema>;
export const SiteConfig: Model<SiteConfigDocument> =
  (models.SiteConfig as Model<SiteConfigDocument>) ??
  model<SiteConfigDocument>("SiteConfig", siteConfigSchema);
