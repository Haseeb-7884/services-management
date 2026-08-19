/**
 * Minimal document-head manager - no react-helmet-async dependency needed.
 * Upserts <meta>/<link> tags by a stable key so re-renders update in place
 * instead of stacking duplicate tags. Every route that cares about SEO
 * should call `setSeo(...)` on mount; routes that don't call it will keep
 * whatever the previous page left behind, which is why `Layout` sets sane
 * site-wide defaults first and page components override them.
 *
 * Caveat worth knowing: this is a client-rendered SPA, so these tags are
 * only visible to crawlers that execute JavaScript (Googlebot does). Many
 * link-preview bots (Slack, WhatsApp, Discord, some others) fetch raw HTML
 * without running JS and won't see tags set this way - a real fix for that
 * needs server-side rendering or a bot-specific prerender, which is a
 * bigger follow-up once deployment topology (single origin vs. split
 * frontend/backend) is decided.
 */

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  if (!content) return;
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertCanonical(url: string) {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", url);
}

export interface SeoOptions {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "video.other" | "profile";
  noindex?: boolean;
}

export function setSeo({ title, description, image, type = "website", noindex = false }: SeoOptions) {
  document.title = title;
  const url = window.location.href;

  if (description) upsertMeta("name", "description", description);
  upsertMeta("property", "og:title", title);
  if (description) upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:type", type);
  upsertMeta("property", "og:url", url);
  if (image) upsertMeta("property", "og:image", image);

  upsertMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
  upsertMeta("name", "twitter:title", title);
  if (description) upsertMeta("name", "twitter:description", description);
  if (image) upsertMeta("name", "twitter:image", image);

  upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
  upsertCanonical(url);
}

/** Truncates rich body text into a clean meta-description length. */
export function toDescription(text: string | undefined | null, max = 160): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}
