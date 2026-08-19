import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Video } from "../models/Video.js";
import { Image } from "../models/Image.js";
import { Article } from "../models/Article.js";
import { User } from "../models/User.js";
import { env } from "../config/env.js";

// Hard cap per content type so a large catalog can't turn this into an
// unbounded query - the sitemap protocol itself also caps a single file at
// 50,000 URLs. If the platform ever grows past this, split into a sitemap
// index + multiple per-type sitemap files instead of raising this number.
const MAX_URLS_PER_TYPE = 2000;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc: string, lastmod?: Date, priority = "0.5") {
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n${
    lastmod ? `    <lastmod>${lastmod.toISOString()}</lastmod>\n` : ""
  }    <priority>${priority}</priority>\n  </url>`;
}

/**
 * Dynamic sitemap covering static routes + every approved Video/Image/
 * Article + every user with at least one piece of approved content.
 *
 * Deployment note: this lives on the API (`GET /sitemap.xml`, mounted at
 * the app root, not under `/api/v1`) because it needs live DB access.
 * Search engines expect `sitemap.xml` at the actual site root though - in
 * production, the frontend's hosting/reverse-proxy config needs to rewrite
 * `https://<your-domain>/sitemap.xml` to this endpoint (e.g. a Vercel
 * rewrite or an Nginx location block), the same way `robots.txt` below
 * needs to point at whatever the real frontend origin ends up being.
 */
export const getSitemap = asyncHandler(async (_req: Request, res: Response) => {
  const base = env.clientUrl.replace(/\/$/, "");

  const staticUrls = ["/", "/videos", "/images", "/articles", "/pricing"].map((p) =>
    urlEntry(`${base}${p}`, undefined, p === "/" ? "1.0" : "0.8")
  );

  const [videos, images, articles, videoOwners, imageOwners, articleOwners] = await Promise.all([
    Video.find({ status: "approved" }).select("_id updatedAt").sort({ createdAt: -1 }).limit(MAX_URLS_PER_TYPE),
    Image.find({ status: "approved" }).select("_id updatedAt").sort({ createdAt: -1 }).limit(MAX_URLS_PER_TYPE),
    Article.find({ status: "approved" }).select("_id updatedAt").sort({ createdAt: -1 }).limit(MAX_URLS_PER_TYPE),
    Video.distinct("owner", { status: "approved" }),
    Image.distinct("owner", { status: "approved" }),
    Article.distinct("owner", { status: "approved" }),
  ]);

  const creatorIds = [...new Set([...videoOwners, ...imageOwners, ...articleOwners].map(String))];
  const creators = await User.find({ _id: { $in: creatorIds } })
    .select("username updatedAt")
    .limit(MAX_URLS_PER_TYPE);

  const dynamicUrls = [
    ...videos.map((v) => urlEntry(`${base}/videos/${v._id}`, v.updatedAt, "0.7")),
    ...images.map((i) => urlEntry(`${base}/images/${i._id}`, i.updatedAt, "0.6")),
    ...articles.map((a) => urlEntry(`${base}/articles/${a._id}`, a.updatedAt, "0.7")),
    ...creators.map((u) => urlEntry(`${base}/u/${u.username}`, u.updatedAt, "0.6")),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    ...staticUrls,
    ...dynamicUrls,
  ].join("\n")}\n</urlset>`;

  res.type("application/xml").send(xml);
});

export const getRobotsTxt = asyncHandler(async (_req: Request, res: Response) => {
  const base = env.clientUrl.replace(/\/$/, "");
  const lines = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /dashboard",
    "Disallow: /admin",
    "Disallow: /superadmin",
    "Disallow: /messages",
    "Disallow: /notifications",
    "Disallow: /upload",
    "Disallow: /owner/branding",
    "",
    `Sitemap: ${base}/sitemap.xml`,
  ];
  res.type("text/plain").send(lines.join("\n"));
});
