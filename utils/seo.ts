/**
 * Minimal document-head manager - no react-helmet dependency needed.
 * Upserts <meta>/<link> tags by a stable key so re-renders update in place
 * instead of stacking duplicate tags.
 *
 * This is carried over unchanged from the old SPA. It still works fine in
 * a "use client" component, but it's worth knowing Next.js's native
 * `generateMetadata` / `export const metadata` (used in a Server Component)
 * would be a strictly better long-term replacement - it renders real
 * <meta> tags into the initial HTML, visible even to crawlers that don't
 * execute JavaScript, which this DOM-patch approach still can't do. Kept
 * as-is here to port the app quickly without also converting every page to
 * a Server Component in the same pass.
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
