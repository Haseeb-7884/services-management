"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Film } from "lucide-react";
import { fetchAdminStats } from "@/api/admin";
import { ModerationQueue } from "@/components/ModerationQueue";
import { ContentManager } from "@/components/ContentManager";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import type { AdminStats, Role } from "@/types";

const ADMIN_ROLES: Role[] = ["moderator", "admin", "super_admin", "owner"];
const TABS = ["Moderation", "Content"] as const;

function AdminDashboardInner() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Moderation");

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch(() => undefined);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-2 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 12%, transparent)" }}>
          <ClipboardList size={18} color="var(--brand-primary)" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">Admin Dashboard</h1>
      </div>
      <p className="mb-6 text-sm text-[var(--brand-text-muted)]">Review content uploaded by creators before it goes live, or manage everything already published. {stats ? `${stats.pendingContentCount} waiting for review.` : ""}</p>

      <div className="mb-6 flex max-w-xs gap-1 rounded-full border p-1" style={{ borderColor: "var(--border-subtle)" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold transition"
            style={tab === t ? { backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" } : { color: "var(--brand-text-muted)" }}
          >
            {t === "Moderation" ? <ClipboardList size={14} /> : <Film size={14} />}
            {t}
          </button>
        ))}
      </div>

      {tab === "Moderation" ? <ModerationQueue /> : <ContentManager />}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute allow={ADMIN_ROLES}>
      <AdminDashboardInner />
    </ProtectedRoute>
  );
}
