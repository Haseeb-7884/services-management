import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { SiteConfig } from "../models/SiteConfig.js";
import { ok } from "../utils/ApiResponse.js";
import { uploadLocalFile } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

async function getOrCreateConfig() {
  // Deliberately NOT `findOneAndUpdate(..., { upsert: true })` here: MongoDB
  // upserts only write the fields named in the update document, so nested
  // Mongoose schema defaults (theme.colors, footer, seoDefaults, ...) never
  // get applied and the doc ends up with just `{ slug: "default" }`. That
  // silently breaks every color/font on the site. `.create()` always runs
  // full schema defaults, so we use findOne + create instead.
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

/** Public - the frontend calls this on boot to theme itself. No auth required. */
export const getBranding = asyncHandler(async (_req: Request, res: Response) => {
  const config = await getOrCreateConfig();
  ok(res, config);
});

/** Owner-only - update any branding field. Partial updates via dot-path merge. */
export const updateBranding = asyncHandler(async (req: Request, res: Response) => {
  const config = await getOrCreateConfig();
  config.set(req.body);
  await config.validate();
  await config.save();
  ok(res, config, "Branding updated");
});

export const uploadLogo = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest("No file uploaded");
  const { url } = await uploadLocalFile(req.file.path, "branding");
  const config = await getOrCreateConfig();
  config.logoUrl = url;
  await config.save();
  ok(res, config, "Logo updated");
});

export const uploadFavicon = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest("No file uploaded");
  const { url } = await uploadLocalFile(req.file.path, "branding");
  const config = await getOrCreateConfig();
  config.faviconUrl = url;
  await config.save();
  ok(res, config, "Favicon updated");
});
