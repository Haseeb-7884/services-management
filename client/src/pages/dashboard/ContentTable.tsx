import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Trash2 } from "lucide-react";
import type { DashboardContentItem } from "../../types";

const STATUS_STYLE: Record<DashboardContentItem["status"], { bg: string; color: string; label: string }> = {
  approved: { bg: "rgba(22,163,74,0.1)", color: "#16a34a", label: "Published" },
  pending: { bg: "rgba(217,119,6,0.1)", color: "#d97706", label: "Pending review" },
  rejected: { bg: "rgba(220,38,38,0.1)", color: "#dc2626", label: "Rejected" },
};

function contentHref(row: DashboardContentItem) {
  if (row.type === "Video") return `/videos/${row.id}`;
  if (row.type === "Image") return `/images/${row.id}`;
  return `/articles/${row.id}`;
}

export function ContentTable({
  rows,
  onDelete,
}: {
  rows: DashboardContentItem[];
  onDelete?: (row: DashboardContentItem) => Promise<void>;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (row: DashboardContentItem) => {
    if (!onDelete) return;
    if (!window.confirm(`Delete "${row.title || "this item"}"? This can't be undone.`)) return;
    setDeletingId(row.id);
    try {
      await onDelete(row);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
            {["Content", "Type", "Status", "Views", "Date", "Actions"].map((h) => (
              <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--brand-text-muted)]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id} className={i < rows.length - 1 ? "border-b" : ""} style={{ borderColor: "var(--border-subtle)" }}>
              <td className="px-5 py-3.5">
                <Link to={contentHref(row)} className="flex items-center gap-3">
                  {row.thumbnailUrl ? (
                    <img src={row.thumbnailUrl} alt={row.title} className="h-9 w-14 shrink-0 rounded-md object-cover" />
                  ) : (
                    <div className="grid h-9 w-14 shrink-0 place-items-center rounded-md" style={{ backgroundColor: "var(--brand-bg-start)" }}>
                      <FileText size={14} className="text-[var(--brand-text-muted)]" />
                    </div>
                  )}
                  <span className="max-w-[240px] truncate text-[13px] font-semibold text-[var(--brand-text)]">{row.title || "Untitled"}</span>
                </Link>
              </td>
              <td className="px-5 py-3.5 text-[13px] text-[var(--brand-text-muted)]">{row.type}</td>
              <td className="px-5 py-3.5">
                <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide" style={{ backgroundColor: STATUS_STYLE[row.status].bg, color: STATUS_STYLE[row.status].color }}>
                  {STATUS_STYLE[row.status].label}
                </span>
              </td>
              <td className="px-5 py-3.5 text-[13px] font-medium text-[var(--brand-text)]">{row.views}</td>
              <td className="px-5 py-3.5 text-[13px] text-[var(--brand-text-muted)]">{new Date(row.createdAt).toLocaleDateString()}</td>
              <td className="px-5 py-3.5">
                <button
                  onClick={() => handleDelete(row)}
                  disabled={!onDelete || deletingId === row.id}
                  className="grid h-8 w-8 place-items-center rounded-md border disabled:opacity-50"
                  style={{ borderColor: "rgba(220,38,38,0.25)", backgroundColor: "rgba(220,38,38,0.06)" }}
                  title="Delete"
                >
                  <Trash2 size={13} color="#dc2626" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
