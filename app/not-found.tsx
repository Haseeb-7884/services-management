"use client";

import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";

export default function NotFound() {
  useSeo({ title: "Page not found", description: "The page you're looking for doesn't exist or may have moved.", noindex: true });

  return (
    <div className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 10%, transparent)" }}>
          <Compass size={28} color="var(--brand-primary)" />
        </div>
        <p className="mb-1 text-sm font-bold uppercase tracking-widest text-[var(--brand-primary)]">404</p>
        <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">Page not found</h1>
        <p className="mb-7 text-sm leading-relaxed text-[var(--brand-text-muted)]">The page you&apos;re looking for doesn&apos;t exist or may have moved. Let&apos;s get you back on track.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-glow flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold" style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}>
            <Home size={16} /> Back home
          </Link>
          <Link href="/videos" className="rounded-lg border px-5 py-2.5 text-sm font-semibold text-[var(--brand-text)]" style={{ borderColor: "var(--border-subtle)" }}>
            Explore videos
          </Link>
        </div>
      </div>
    </div>
  );
}
