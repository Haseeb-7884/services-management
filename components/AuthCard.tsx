"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { useBranding } from "@/context/BrandingContext";
import { fetchFeaturedCreators } from "@/api/feed";
import type { FeaturedCreator } from "@/types";

const HIGHLIGHTS = [
  "Publish videos, articles, images and stories from one channel",
  "Real audience analytics, not just vanity numbers",
  "Keep your followers and community - no algorithm gatekeeping",
];

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  const { branding } = useBranding();
  const [proofAvatars, setProofAvatars] = useState<FeaturedCreator[]>([]);

  useEffect(() => {
    fetchFeaturedCreators(4).then(setProofAvatars).catch(() => setProofAvatars([]));
  }, []);

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-[8%] h-72 w-72 rounded-full opacity-[0.14] blur-3xl" style={{ backgroundColor: "var(--brand-primary)" }} />
        <div className="absolute -right-20 bottom-[6%] h-80 w-80 rounded-full opacity-[0.10] blur-3xl" style={{ backgroundColor: "var(--brand-secondary)" }} />
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(var(--border-medium) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div
        className="relative z-10 mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border lg:grid-cols-2"
        style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-lg)" }}
      >
        <div
          className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex"
          style={{ background: "linear-gradient(160deg, var(--brand-text), color-mix(in srgb, var(--brand-text) 80%, black))" }}
        >
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: "var(--brand-primary)" }} />

          <Link href="/" className="relative flex items-center gap-2 text-lg font-bold text-white">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt={branding.siteName} className="h-9 w-9 rounded-lg object-cover" />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-lg text-sm font-bold" style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}>
                {branding.siteName.charAt(0).toUpperCase()}
              </span>
            )}
            {branding.siteName}
          </Link>

          <div className="relative">
            <h2 className="font-display mb-5 text-2xl font-extrabold leading-tight text-white">A home for your content, built for creators.</h2>
            <ul className="mb-8 space-y-3">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/70">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0" style={{ color: "var(--brand-primary)" }} />
                  {h}
                </li>
              ))}
            </ul>

            {proofAvatars.length > 0 && (
              <div className="flex items-center gap-3 border-t border-white/10 pt-6">
                <div className="flex -space-x-2.5">
                  {proofAvatars.map((c) =>
                    c.profile.avatarUrl ? (
                      <img key={c._id} src={c.profile.avatarUrl} alt={c.profile.displayName || c.username} className="h-8 w-8 rounded-full border-2 object-cover" style={{ borderColor: "color-mix(in srgb, var(--brand-text) 80%, black)" }} />
                    ) : (
                      <span key={c._id} className="grid h-8 w-8 place-items-center rounded-full border-2 text-xs font-bold text-white" style={{ borderColor: "color-mix(in srgb, var(--brand-text) 80%, black)", backgroundColor: "var(--brand-primary)" }}>
                        {(c.profile.displayName || c.username).charAt(0).toUpperCase()}
                      </span>
                    )
                  )}
                </div>
                <p className="text-xs text-white/60">Joined by creators already publishing here</p>
              </div>
            )}
          </div>

          <p className="relative text-xs text-white/40">© {new Date().getFullYear()} {branding.siteName}. All rights reserved.</p>
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-10" style={{ backgroundColor: "var(--surface-card)" }}>
          <Link href="/" className="mb-8 flex items-center gap-2 text-lg font-semibold lg:hidden">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt={branding.siteName} className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-lg text-sm font-bold" style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}>
                {branding.siteName.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="text-[var(--brand-text)]">{branding.siteName}</span>
          </Link>

          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">{title}</h1>
          <p className="mt-1.5 text-sm text-[var(--brand-text-muted)]">{subtitle}</p>

          <div className="mt-7">{children}</div>

          <p className="mt-6 text-center text-sm text-[var(--brand-text-muted)] lg:text-left">{footer}</p>
        </div>
      </div>
    </div>
  );
}
