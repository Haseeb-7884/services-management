"use client";

import Link from "next/link";
import { Globe, Mail, MessageCircle, Share2, TrendingUp } from "lucide-react";
import { useBranding } from "@/context/BrandingContext";

const COLUMNS = [
  {
    title: "Content",
    links: [
      { label: "Videos", to: "/videos" },
      { label: "Shorts", to: "/videos?isShort=true" },
      { label: "Images", to: "/images" },
      { label: "Upload", to: "/upload" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/" },
      { label: "Pricing", to: "/pricing" },
      { label: "Register", to: "/register" },
      { label: "Log in", to: "/login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "#" },
      { label: "Terms of Service", to: "#" },
      { label: "Cookie Policy", to: "#" },
    ],
  },
];

const SOCIALS = [Globe, MessageCircle, Share2, Mail];

export function Footer() {
  const { branding } = useBranding();

  return (
    <footer className="border-t" style={{ borderColor: "var(--border-subtle)" }}>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              {branding.logoUrl ? (
                <img src={branding.logoUrl} alt={branding.siteName} className="h-7 w-7 rounded" />
              ) : (
                <TrendingUp size={20} style={{ color: "var(--brand-primary)" }} />
              )}
              {branding.siteName}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-[var(--brand-text-muted)]">
              A home for your videos, shorts, images, articles and stories — publish, grow, and
              connect with your audience.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border transition hover:text-[var(--brand-primary)]"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h6 className="mb-3 text-sm font-semibold">{col.title}</h6>
              <ul className="space-y-2 text-sm text-[var(--brand-text-muted)]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.to} className="hover:text-[var(--brand-text)]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-8" style={{ borderColor: "var(--border-subtle)" }} />

        <div className="flex flex-col items-center justify-between gap-3 text-sm text-[var(--brand-text-muted)] sm:flex-row">
          <p>
            {branding.footer.text || `© ${new Date().getFullYear()} ${branding.siteName}. All rights reserved.`}
          </p>
          {branding.footer.links.map((link) => (
            <a key={link.url} href={link.url} className="hover:text-[var(--brand-text)]">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
