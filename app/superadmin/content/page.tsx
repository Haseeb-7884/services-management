"use client";

import { Film } from "lucide-react";
import { ContentManager } from "@/components/ContentManager";

export default function SuperAdminContent() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 12%, transparent)" }}>
          <Film size={18} color="var(--brand-primary)" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[var(--brand-text)]">Content</h1>
          <p className="text-sm text-[var(--brand-text-muted)]">Every video, image and article on the platform. Deleting removes it from Cloudinary and the database too.</p>
        </div>
      </div>

      <ContentManager />
    </div>
  );
}
