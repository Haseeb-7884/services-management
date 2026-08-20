"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { fetchMyContent } from "@/api/dashboard";
import { deleteVideo } from "@/api/videos";
import { deleteImage } from "@/api/images";
import { deleteArticle } from "@/api/articles";
import { ContentTable } from "@/components/ContentTable";
import type { DashboardContentItem } from "@/types";

const STATUSES = ["All", "approved", "pending", "rejected"] as const;
const STATUS_LABEL: Record<(typeof STATUSES)[number], string> = {
  All: "All",
  approved: "Published",
  pending: "Pending review",
  rejected: "Rejected",
};

export default function DashboardContent() {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<DashboardContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchMyContent()
      .then(setItems)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (row: DashboardContentItem) => {
    if (row.type === "Video") await deleteVideo(row.id);
    else if (row.type === "Image") await deleteImage(row.id);
    else await deleteArticle(row.id);
    setItems((prev) => prev.filter((r) => r.id !== row.id));
  };

  const rows = items.filter((r) => {
    const matchesStatus = status === "All" || r.status === status;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">My Content</h1>
      <p className="mb-6 text-sm text-[var(--brand-text-muted)]">Every video, article and image you&apos;ve published.</p>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--brand-text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your content…"
            className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--border-highlight)]"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", color: "var(--brand-text)" }}
          />
        </div>
        <div className="flex gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className="rounded-full border px-3.5 py-1.5 text-xs font-semibold transition"
              style={
                status === s
                  ? { backgroundColor: "var(--brand-primary)", borderColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }
                  : { borderColor: "var(--border-subtle)", color: "var(--brand-text-muted)", backgroundColor: "var(--surface-card)" }
              }
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
        {loading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg" style={{ backgroundColor: "var(--brand-bg-start)" }} />
            ))}
          </div>
        ) : rows.length > 0 ? (
          <ContentTable rows={rows} onDelete={handleDelete} />
        ) : (
          <p className="p-10 text-center text-sm text-[var(--brand-text-muted)]">{items.length === 0 ? "You haven't published anything yet." : "No content matches that filter."}</p>
        )}
      </div>
    </div>
  );
}
