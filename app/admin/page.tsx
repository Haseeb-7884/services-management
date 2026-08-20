"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { fetchAdminStats } from "@/api/admin";
import { ModerationQueue } from "@/components/ModerationQueue";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import type { AdminStats, Role } from "@/types";

const ADMIN_ROLES: Role[] = ["moderator", "admin", "super_admin", "owner"];

function AdminDashboardInner() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch(() => undefined);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-2 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 12%, transparent)" }}>
          <ClipboardList size={18} color="var(--brand-primary)" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">Admin Dashboard</h1>
      </div>
      <p className="mb-7 text-sm text-[var(--brand-text-muted)]">Review content uploaded by creators before it goes live. {stats ? `${stats.pendingContentCount} waiting for review.` : ""}</p>

      <ModerationQueue />
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
