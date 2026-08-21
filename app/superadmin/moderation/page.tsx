"use client";

import { ClipboardList } from "lucide-react";
import { ModerationQueue } from "@/components/ModerationQueue";

export default function SuperAdminModeration() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in srgb, #d97706 12%, transparent)" }}>
          <ClipboardList size={18} color="#d97706" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[var(--brand-text)]">Moderation Queue</h1>
          <p className="text-sm text-[var(--brand-text-muted)]">Review and approve or reject content awaiting publication.</p>
        </div>
      </div>

      <ModerationQueue />
    </div>
  );
}
