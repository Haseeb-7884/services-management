"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, ShieldCheck, Sparkles, Users } from "lucide-react";
import { fetchAdminStats } from "@/api/admin";
import type { AdminStats } from "@/types";

export default function SuperAdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch(() => undefined);
  }, []);

  const cards = [
    { label: "Total Users", value: stats?.totalUsers, icon: Users, color: "var(--brand-primary)", href: "/superadmin/users" },
    { label: "Admin Slots Used", value: stats ? `${stats.adminSlotsUsed} / ${stats.adminSlotsTotal}` : undefined, icon: ShieldCheck, color: "#7c3aed", href: "/superadmin/admins" },
    { label: "Creators", value: stats?.totalCreators, icon: Sparkles, color: "#db2777", href: "/superadmin/creators" },
    { label: "Pending Review", value: stats?.pendingContentCount, icon: ClipboardList, color: "#d97706", href: "/superadmin/moderation" },
  ];

  return (
    <div>
      <div className="mb-2 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 12%, transparent)" }}>
          <ShieldCheck size={18} color="var(--brand-primary)" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">Super Admin Dashboard</h1>
      </div>
      <p className="mb-7 text-sm text-[var(--brand-text-muted)]">Manage users, Admin slots, Creator status, and content moderation across the platform.</p>

      <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {cards.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-2xl border p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-lg transition-transform duration-150 group-hover:scale-105" style={{ backgroundColor: `color-mix(in srgb, ${s.color} 14%, transparent)` }}>
                <s.icon size={18} color={s.color} />
              </div>
              <ArrowRight size={15} className="text-[var(--brand-text-muted)] opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </div>
            <p className="mb-0.5 text-[26px] font-extrabold tracking-tight text-[var(--brand-text)]">{s.value ?? "—"}</p>
            <p className="text-[13px] font-medium text-[var(--brand-text-muted)]">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
        <h2 className="mb-1 text-base font-bold text-[var(--brand-text)]">Quick links</h2>
        <p className="mb-4 text-sm text-[var(--brand-text-muted)]">Jump straight to the section you need.</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Manage all users", href: "/superadmin/users" },
            { label: "Manage content", href: "/superadmin/content" },
            { label: "Pricing plans", href: "/superadmin/plans" },
            { label: "Admin slots", href: "/superadmin/admins" },
            { label: "Creator status", href: "/superadmin/creators" },
            { label: "Moderation queue", href: "/superadmin/moderation" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-150 hover:bg-[var(--surface-card-hover)] active:scale-95"
              style={{ borderColor: "var(--border-subtle)", color: "var(--brand-text)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
