"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock3, Eye, Heart, Upload, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchDashboardStats } from "@/api/dashboard";
import { deleteVideo } from "@/api/videos";
import { deleteImage } from "@/api/images";
import { deleteArticle } from "@/api/articles";
import { formatCount } from "@/utils/format";
import { ContentTable } from "@/components/ContentTable";
import type { DashboardContentItem, DashboardStatsResponse } from "@/types";

const TYPE_COLORS: Record<string, string> = {
  Video: "var(--brand-primary)",
  Article: "#7c3aed",
  Image: "#db2777",
};

export default function DashboardOverview() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const creatorName = user?.profile.displayName || user?.username || "there";

  const load = () => {
    setLoading(true);
    fetchDashboardStats()
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (row: DashboardContentItem) => {
    if (row.type === "Video") await deleteVideo(row.id);
    else if (row.type === "Image") await deleteImage(row.id);
    else await deleteArticle(row.id);
    load();
  };

  if (loading || !data) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[120px] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--surface-card)" }} />
        ))}
      </div>
    );
  }

  const pendingCount = data.content.filter((c) => c.status === "pending").length;
  const typeCounts = data.content.reduce<Record<string, number>>((acc, c) => {
    acc[c.type] = (acc[c.type] ?? 0) + 1;
    return acc;
  }, {});

  const statCards = [
    { label: "Total Views", value: formatCount(data.stats.totalViews), icon: Eye, color: "var(--brand-primary)" },
    { label: "Followers", value: formatCount(data.stats.followers), icon: Users, color: "#7c3aed" },
    { label: "Total Likes", value: formatCount(data.stats.totalLikes), icon: Heart, color: "#db2777" },
    { label: "Pending Review", value: String(pendingCount), icon: Clock3, color: "#d97706" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--brand-text)] sm:text-[26px]">Welcome back, {creatorName}</h1>
          <p className="text-sm text-[var(--brand-text-muted)]">Here&apos;s what&apos;s happening with your channel today.</p>
        </div>
        <Link href="/upload" className="btn-glow flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold" style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}>
          <Upload size={16} /> Upload New
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mb-7 grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border p-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg" style={{ backgroundColor: `color-mix(in srgb, ${s.color} 14%, transparent)` }}>
              <s.icon size={18} color={s.color} />
            </div>
            <p className="mb-0.5 text-[28px] font-extrabold tracking-tight text-[var(--brand-text)]">{s.value}</p>
            <p className="text-[13px] font-medium text-[var(--brand-text-muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Content mix */}
      {data.stats.contentCount > 0 && (
        <div className="mb-6 rounded-2xl border p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
          <h2 className="mb-5 text-[17px] font-bold text-[var(--brand-text)]">Content Mix</h2>
          <div className="flex flex-col gap-4">
            {Object.entries(typeCounts).map(([type, count]) => {
              const percent = Math.round((count / data.stats.contentCount) * 100);
              return (
                <div key={type}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-[var(--brand-text)]">{type}</span>
                    <span className="text-[var(--brand-text-muted)]">
                      {count} · {percent}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: "var(--border-subtle)" }}>
                    <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: TYPE_COLORS[type] ?? "var(--brand-primary)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content preview */}
      <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--border-subtle)" }}>
          <h2 className="text-[17px] font-bold text-[var(--brand-text)]">My Content</h2>
          <Link href="/dashboard/content" className="text-sm font-semibold text-[var(--brand-primary)]">
            View all →
          </Link>
        </div>
        {data.content.length === 0 ? (
          <p className="p-10 text-center text-sm text-[var(--brand-text-muted)]">You haven&apos;t published anything yet.</p>
        ) : (
          <ContentTable rows={data.content.slice(0, 5)} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
