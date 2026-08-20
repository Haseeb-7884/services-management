"use client";

import { useEffect } from "react";
import { setSeo, type SeoOptions } from "@/utils/seo";

/**
 * Sets document title / meta / Open Graph / Twitter-card tags for the
 * current page. Re-runs whenever the meaningful fields change (e.g. after
 * an async fetch resolves), so pages can call this unconditionally on
 * every render with a loading-state title and it'll correct itself once
 * real data arrives.
 */
export function useSeo(options: SeoOptions) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setSeo(options);
  }, [options.title, options.description, options.image, options.type, options.noindex]);
}
