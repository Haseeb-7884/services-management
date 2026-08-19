import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { fetchDashboardStats } from "../../api/dashboard";
import { formatCount } from "../../utils/format";
import type { DashboardStatsResponse } from "../../types";

const TYPE_COLORS: Record<string, string> = {
  Video: "var(--brand-primary)",
  Article: "#7c3aed",
  Image: "#db2777",
};

const STATUS_COLORS: Record<string, string> = {
  approved: "#16a34a",
  pending: "#d97706",
  rejected: "#dc2626",
};
const STATUS_LABEL: Record<string, string> = { approved: "Published", pending: "Pending review", rejected: "Rejected" };

export function DashboardAnalytics() {
  const [data, setData] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div>
        <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">Analytics</h1>
        <p className="mb-7 text-sm text-[var(--brand-text-muted)]">How your content is performing.</p>
        <div className="h-64 animate-pulse rounded-2xl" style={{ backgroundColor: "var(--surface-card)" }} />
      </div>
    );
  }

  const topContent = [...data.content].sort((a, b) => b.views - a.views).slice(0, 5);
  const typeCounts = data.content.reduce<Record<string, number>>((acc, c) => {
    acc[c.type] = (acc[c.type] ?? 0) + 1;
    return acc;
  }, {});
  const statusCounts = data.content.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">Analytics</h1>
      <p className="mb-7 text-sm text-[var(--brand-text-muted)]">
        Real totals across everything you've published{data.content.length === 0 ? "." : ` (${data.content.length} items).`}
      </p>

      {data.content.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border py-16 text-center" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
          <p className="text-sm font-medium text-[var(--brand-text)]">No analytics yet</p>
          <p className="max-w-xs text-sm text-[var(--brand-text-muted)]">Publish your first video, image or article to start seeing performance data here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Top performing content */}
            <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
              <h2 className="mb-5 text-[17px] font-bold text-[var(--brand-text)]">Top Performing Content</h2>
              <div className="flex flex-col gap-4">
                {topContent.map((c, i) => (
                  <div key={c.id} className="flex items-center gap-3.5">
                    <span className="w-4 text-sm font-bold text-[var(--brand-text-muted)]">{i + 1}</span>
                    {c.thumbnailUrl ? (
                      <img src={c.thumbnailUrl} alt={c.title} className="h-10 w-16 shrink-0 rounded-md object-cover" />
                    ) : (
                      <div className="grid h-10 w-16 shrink-0 place-items-center rounded-md" style={{ backgroundColor: "var(--brand-bg-start)" }}>
                        <FileText size={16} className="text-[var(--brand-text-muted)]" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-[var(--brand-text)]">{c.title || "Untitled"}</p>
                      <p className="text-xs text-[var(--brand-text-muted)]">{c.type}</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--brand-text)]">{formatCount(c.views)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status breakdown */}
            <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
              <h2 className="mb-5 text-[17px] font-bold text-[var(--brand-text)]">Moderation Status</h2>
              <div className="flex flex-wrap gap-3">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-2 rounded-full border px-3.5 py-1.5" style={{ borderColor: "var(--border-subtle)" }}>
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[status] }} />
                    <span className="text-xs font-medium text-[var(--brand-text)]">{STATUS_LABEL[status] ?? status}</span>
                    <span className="text-xs text-[var(--brand-text-muted)]">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content type breakdown */}
          <div className="h-fit rounded-2xl border p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
            <h2 className="mb-5 text-[17px] font-bold text-[var(--brand-text)]">Content Mix</h2>
            <div className="flex flex-col gap-4">
              {Object.entries(typeCounts).map(([type, count]) => {
                const percent = Math.round((count / data.content.length) * 100);
                return (
                  <div key={type}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-[var(--brand-text)]">{type}</span>
                      <span className="text-[var(--brand-text-muted)]">{percent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: "var(--border-subtle)" }}>
                      <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: TYPE_COLORS[type] ?? "var(--brand-primary)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
