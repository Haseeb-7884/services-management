import type { MetadataRoute } from "next";
import { connectDB } from "../lib/db";
import { Video } from "../lib/models/Video";
import { Image } from "../lib/models/Image";
import { Article } from "../lib/models/Article";
import { User } from "../lib/models/User";

// Hard cap per content type so a large catalog can't turn this into an
// unbounded query - the sitemap protocol itself also caps a single file at
// 50,000 URLs. If the platform ever grows past this, split into a sitemap
// index + multiple per-type sitemap files instead of raising this number.
const MAX_URLS_PER_TYPE = 2000;

// Generate at request time instead of build time. A sitemap this data-driven
// shouldn't be baked into the build output - it needs to reflect whatever's
// approved right now, and a build-time DB dependency would make the whole
// deploy fail if the database is briefly unreachable during a build.
export const dynamic = "force-dynamic";

/**
 * Next.js's built-in sitemap convention: this file is automatically served
 * at the real /sitemap.xml on whatever domain the app is deployed to - no
 * reverse-proxy rewrite needed. That was a real deployment gotcha on the
 * old split Express+Netlify setup (the API and the frontend were on two
 * different domains, so the sitemap the API generated lived at the wrong
 * URL for crawlers); this goes away entirely now that everything is one
 * Next.js app on one domain.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const staticUrls: MetadataRoute.Sitemap = ["", "/videos", "/images", "/articles", "/pricing"].map((p) => ({
    url: `${siteUrl()}${p}`,
    priority: p === "" ? 1.0 : 0.8,
  }));

  const [videos, images, articles, videoOwners, imageOwners, articleOwners] = await Promise.all([
    Video.find({ status: "approved" }).select("_id updatedAt").sort({ createdAt: -1 }).limit(MAX_URLS_PER_TYPE),
    Image.find({ status: "approved" }).select("_id updatedAt").sort({ createdAt: -1 }).limit(MAX_URLS_PER_TYPE),
    Article.find({ status: "approved" }).select("_id updatedAt").sort({ createdAt: -1 }).limit(MAX_URLS_PER_TYPE),
    Video.distinct("owner", { status: "approved" }),
    Image.distinct("owner", { status: "approved" }),
    Article.distinct("owner", { status: "approved" }),
  ]);

  const creatorIds = [...new Set([...videoOwners, ...imageOwners, ...articleOwners].map(String))];
  const creators = await User.find({ _id: { $in: creatorIds } }).select("username updatedAt").limit(MAX_URLS_PER_TYPE);

  const dynamicUrls: MetadataRoute.Sitemap = [
    ...videos.map((v) => ({ url: `${siteUrl()}/videos/${v._id}`, lastModified: v.updatedAt, priority: 0.7 })),
    ...images.map((i) => ({ url: `${siteUrl()}/images/${i._id}`, lastModified: i.updatedAt, priority: 0.6 })),
    ...articles.map((a) => ({ url: `${siteUrl()}/articles/${a._id}`, lastModified: a.updatedAt, priority: 0.7 })),
    ...creators.map((u) => ({ url: `${siteUrl()}/u/${u.username}`, lastModified: u.updatedAt, priority: 0.6 })),
  ];

  return [...staticUrls, ...dynamicUrls];
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
