"use client";

import { useEffect, useState } from "react";
import { UserCog } from "lucide-react";
import { fetchAdminStats, promoteToAdmin, revokeAdmin } from "@/api/admin";
import { RoleSlotManager } from "@/components/RoleSlotManager";
import type { AdminStats } from "@/types";

export default function SuperAdminAdmins() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch(() => undefined);
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in srgb, #7c3aed 12%, transparent)" }}>
          <UserCog size={18} color="#7c3aed" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[var(--brand-text)]">Admins</h1>
          <p className="text-sm text-[var(--brand-text-muted)]">Assign or revoke Admin access. Limited to a fixed number of slots.</p>
        </div>
      </div>

      <RoleSlotManager roleLabel="Admin" roleFilter="admin" slotInfo={stats ? { used: stats.adminSlotsUsed, total: stats.adminSlotsTotal } : undefined} onPromote={promoteToAdmin} onRevoke={revokeAdmin} />
    </div>
  );
}
