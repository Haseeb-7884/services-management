import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every avatar, cover, thumbnail, and branding logo in this app is a
  // Cloudinary URL (see lib/cloudinary.ts / api/uploads.ts) served as plain
  // <img> tags with no optimization at all - full-resolution originals sent
  // to every device, no lazy-loading below the fold, no modern-format
  // (AVIF/WebP) conversion. Whitelisting the Cloudinary host here is what
  // lets next/image actually optimize them instead of just proxying the
  // same bytes through.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
};

export default nextConfig;
