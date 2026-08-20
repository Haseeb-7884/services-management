import { SiteConfig } from "./models/SiteConfig";

/**
 * Deliberately NOT `findOneAndUpdate(..., { upsert: true })` here: MongoDB
 * upserts only write the fields named in the update document, so nested
 * Mongoose schema defaults (theme.colors, footer, seoDefaults, ...) never
 * get applied and the doc ends up with just `{ slug: "default" }`. That
 * silently breaks every color/font on the site. `.create()` always runs
 * full schema defaults, so we use findOne + create instead.
 */
export async function getOrCreateConfig() {
  let config = await SiteConfig.findOne({ slug: "default" });

  if (!config) {
    config = await SiteConfig.create({ slug: "default" });
  } else if (!config.theme?.colors?.primary) {
    // Self-heal a doc that was created before this fix (or by any other
    // upsert call) and is missing its nested defaults.
    const defaults = new SiteConfig({ slug: "default" });
    config.theme = defaults.theme;
    if (!config.homepageLayout?.length) config.homepageLayout = defaults.homepageLayout;
    if (!config.footer) config.footer = defaults.footer;
    if (!config.seoDefaults) config.seoDefaults = defaults.seoDefaults;
    await config.save();
  }

  return config;
}
