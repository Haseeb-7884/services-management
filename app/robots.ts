import type { MetadataRoute } from "next";

// Next.js's built-in robots convention - automatically served at the real
// /robots.txt on whatever domain the app is deployed to.
export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/admin",
        "/superadmin",
        "/messages",
        "/notifications",
        "/upload",
        "/owner/branding",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
