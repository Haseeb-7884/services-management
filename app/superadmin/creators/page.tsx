"use client";

import { Sparkles } from "lucide-react";
import { grantCreator, revokeCreator } from "@/api/admin";
import { RoleSlotManager } from "@/components/RoleSlotManager";

export default function SuperAdminCreators() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in srgb, #db2777 12%, transparent)" }}>
          <Sparkles size={18} color="#db2777" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[var(--brand-text)]">Creators</h1>
          <p className="text-sm text-[var(--brand-text-muted)]">Grant or revoke Creator status, unlocking uploads and the Creator dashboard.</p>
        </div>
      </div>

      <RoleSlotManager roleLabel="Creator" roleFilter="creator" onPromote={grantCreator} onRevoke={revokeCreator} />
    </div>
  );
}
