"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchBranding } from "@/api/config";
import { setSeo } from "@/utils/seo";
import type { Branding } from "@/types";

const FALLBACK_BRANDING: Branding = {
  siteName: "SocialGrowth",
  logoUrl: "",
  faviconUrl: "",
  theme: {
    colors: {
      primary: "#0891b2",
      secondary: "#06b6d4",
      backgroundStart: "#f8fafc",
      backgroundEnd: "#ffffff",
      textPrimary: "#18181b",
      textMuted: "#71717a",
    },
    fontFamily: "Poppins, -apple-system, 'Segoe UI', sans-serif",
  },
  homepageLayout: [
    "hero",
    "trending",
    "content_types",
    "why_choose_us",
    "pricing",
    "trusted",
    "testimonials",
    "cta",
  ],
  footer: { text: "", links: [] },
  seoDefaults: { metaTitle: "", metaDescription: "", ogImageUrl: "" },
};

function mergeWithFallback(data: Partial<Branding> | null | undefined): Branding {
  return {
    ...FALLBACK_BRANDING,
    ...data,
    theme: {
      colors: { ...FALLBACK_BRANDING.theme.colors, ...data?.theme?.colors },
      fontFamily: data?.theme?.fontFamily ?? FALLBACK_BRANDING.theme.fontFamily,
    },
    footer: { ...FALLBACK_BRANDING.footer, ...data?.footer },
    seoDefaults: { ...FALLBACK_BRANDING.seoDefaults, ...data?.seoDefaults },
    homepageLayout: data?.homepageLayout?.length ? data.homepageLayout : FALLBACK_BRANDING.homepageLayout,
  };
}

interface BrandingContextValue {
  branding: Branding;
  loading: boolean;
  refresh: () => Promise<void>;
}

const BrandingContext = createContext<BrandingContextValue>({
  branding: FALLBACK_BRANDING,
  loading: true,
  refresh: async () => undefined,
});

function applyBrandingToDocument(branding: Branding) {
  const root = document.documentElement;
  const { colors, fontFamily } = branding.theme;
  root.style.setProperty("--brand-primary", colors.primary);
  root.style.setProperty("--brand-secondary", colors.secondary);
  root.style.setProperty("--brand-bg-start", colors.backgroundStart);
  root.style.setProperty("--brand-bg-end", colors.backgroundEnd);
  root.style.setProperty("--brand-text", colors.textPrimary);
  root.style.setProperty("--brand-text-muted", colors.textMuted);
  root.style.setProperty("--brand-font", fontFamily);

  setSeo({
    title: branding.seoDefaults.metaTitle || branding.siteName,
    description:
      branding.seoDefaults.metaDescription ||
      `${branding.siteName} - videos, images and articles from independent creators.`,
    image: branding.seoDefaults.ogImageUrl || undefined,
  });

  if (branding.faviconUrl) {
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = branding.faviconUrl;
  }
}

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<Branding>(FALLBACK_BRANDING);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await fetchBranding();
      const merged = mergeWithFallback(data);
      setBranding(merged);
      applyBrandingToDocument(merged);
    } catch {
      setBranding(FALLBACK_BRANDING);
      applyBrandingToDocument(FALLBACK_BRANDING);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <BrandingContext.Provider value={{ branding, loading, refresh }}>{children}</BrandingContext.Provider>;
}

export function useBranding() {
  return useContext(BrandingContext);
}
