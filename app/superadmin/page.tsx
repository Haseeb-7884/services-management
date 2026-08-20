"use client";

import { useEffect, useState } from "react";
import { ClipboardList, ShieldCheck, Sparkles, Users } from "lucide-react";
import { fetchAdminStats, grantCreator, promoteToAdmin, revokeAdmin, revokeCreator } from "@/api/admin";
import { ModerationQueue } from "@/components/ModerationQueue";
import { RoleSlotManager } from "@/components/RoleSlotManager";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import type { AdminStats, Role } from "@/types";

const SUPER_ADMIN_ROLES: Role[] = ["super_admin", "owner"];
const TABS = ["Overview", "Admins", "Creators", "Moderation"] as const;

function SuperAdminDashboardInner() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch(() => undefined);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-2 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 12%, transparent)" }}>
          <ShieldCheck size={18} color="var(--brand-primary)" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">Super Admin Dashboard</h1>
      </div>
      <p className="mb-6 text-sm text-[var(--brand-text-muted)]">Manage Admin slots, Creator status, and content moderation across the platform.</p>

      <div className="scrollbar-none mb-7 flex gap-1 overflow-x-auto rounded-full border p-1" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition"
            style={tab === t ? { backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" } : { color: "var(--brand-text-muted)" }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && stats && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {[
            { label: "Total Users", value: stats.totalUsers, icon: Users, color: "var(--brand-primary)" },
            { label: "Admin Slots Used", value: `${stats.adminSlotsUsed} / ${stats.adminSlotsTotal}`, icon: ShieldCheck, color: "#7c3aed" },
            { label: "Creators", value: stats.totalCreators, icon: Sparkles, color: "#db2777" },
            { label: "Pending Review", value: stats.pendingContentCount, icon: ClipboardList, color: "#d97706" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border p-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg" style={{ backgroundColor: `color-mix(in srgb, ${s.color} 14%, transparent)` }}>
                <s.icon size={18} color={s.color} />
              </div>
              <p className="mb-0.5 text-[26px] font-extrabold tracking-tight text-[var(--brand-text)]">{s.value}</p>
              <p className="text-[13px] font-medium text-[var(--brand-text-muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "Admins" && (
        <RoleSlotManager roleLabel="Admin" roleFilter="admin" slotInfo={stats ? { used: stats.adminSlotsUsed, total: stats.adminSlotsTotal } : undefined} onPromote={promoteToAdmin} onRevoke={revokeAdmin} />
      )}

      {tab === "Creators" && <RoleSlotManager roleLabel="Creator" roleFilter="creator" onPromote={grantCreator} onRevoke={revokeCreator} />}

      {tab === "Moderation" && <ModerationQueue />}
    </div>
  );
}

export default function SuperAdminDashboard() {
  return (
    <ProtectedRoute allow={SUPER_ADMIN_ROLES}>
      <SuperAdminDashboardInner />
    </ProtectedRoute>
  );
}
