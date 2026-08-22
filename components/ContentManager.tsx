"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FileText, Search, Trash2 } from "lucide-react";
import { fetchAllContent } from "@/api/admin";
import { deleteVideo } from "@/api/videos";
import { deleteImage } from "@/api/images";
import { deleteArticle } from "@/api/articles";
import { getErrorMessage } from "@/api/client";
import { useConfirm } from "@/components/ConfirmDialog";
import type { AdminContentItem } from "@/types";

const TYPE_FILTERS = [
  { label: "All types", value: "all" },
  { label: "Videos", value: "video" },
  { label: "Images", value: "image" },
  { label: "Articles", value: "article" },
];

const STATUS_FILTERS = [
  { label: "All statuses", value: "" },
  { label: "Published", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
];

const STATUS_STYLE: Record<AdminContentItem["status"], { bg: string; fg: string; label: string }> = {
  approved: { bg: "rgba(22,163,74,0.1)", fg: "#16a34a", label: "Published" },
  pending: { bg: "rgba(217,119,6,0.12)", fg: "#d97706", label: "Pending" },
  rejected: { bg: "rgba(220,38,38,0.1)", fg: "#dc2626", label: "Rejected" },
};

function contentHref(item: AdminContentItem) {
  if (item.contentType === "video") return `/videos/${item.id}`;
  if (item.contentType === "image") return `/images/${item.id}`;
  return `/articles/${item.id}`;
}

async function deleteByType(item: AdminContentItem) {
  if (item.contentType === "video") return deleteVideo(item.id);
  if (item.contentType === "image") return deleteImage(item.id);
  return deleteArticle(item.id);
}

const PAGE_SIZE = 20;

// Shared between /admin and /superadmin - this is the "see and delete
// EVERYTHING on the platform" surface that was missing before: the
// moderation queue only ever showed pending items, and Admin/SuperAdmin had
// no way to reach content once it was already published. Deleting here
// hits the same DELETE /api/videos|images|articles/:id routes the owner's
// own "My Content" page uses, which now also clean up the Cloudinary asset
// (see lib/cloudinary.ts) - not just the DB row.
export function ContentManager() {
  const [items, setItems] = useState<AdminContentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const confirm = useConfirm();

  const [type, setType] = useState("all");
  const [status, setStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    fetchAllContent({ type, status: status || undefined, search: search || undefined, page, limit: PAGE_SIZE })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
        setPages(res.pages);
      })
      .catch((err) => setError(getErrorMessage(err, "Couldn't load content")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, status, search, page]);

  const runSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleDelete = async (item: AdminContentItem) => {
    const confirmed = await confirm({
      message: `Delete "${item.title || "this item"}"? This removes it from the site, the database, and Cloudinary. This can't be undone.`,
      danger: true,
    });
    if (!confirmed) return;
    setDeletingId(item.id);
    setError("");
    try {
      await deleteByType(item);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't delete this item"));
    } finally {
      setDeletingId(null);
    }
  };

  const rangeLabel = useMemo(() => {
    if (total === 0) return "0 items";
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, total);
    return `${start}-${end} of ${total} items`;
  }, [page, total]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand-text-muted)]" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder="Search by title/caption…"
            className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[var(--border-highlight)]"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", color: "var(--brand-text)" }}
          />
        </div>
        <button
          onClick={runSearch}
          className="rounded-lg border px-4 py-2 text-sm font-semibold transition-all duration-150 hover:bg-[var(--surface-card-hover)] active:scale-95"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          Search
        </button>
        <select
          value={type}
          onChange={(e) => {
            setPage(1);
            setType(e.target.value);
          }}
          className="rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", color: "var(--brand-text)" }}
        >
          {TYPE_FILTERS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", color: "var(--brand-text)" }}
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.label} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wide text-[var(--brand-text-muted)]" style={{ borderColor: "var(--border-subtle)" }}>
                <th className="px-4 py-3 font-semibold">Content</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Views</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                    <td className="px-4 py-3" colSpan={7}>
                      <div className="h-8 w-full animate-pulse rounded-lg" style={{ backgroundColor: "var(--surface-card-hover)" }} />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-[var(--brand-text-muted)]" colSpan={7}>
                    No content found.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const s = STATUS_STYLE[item.status];
                  return (
                    <tr key={item.id} className="border-b transition-colors last:border-0 hover:bg-[var(--surface-card-hover)]" style={{ borderColor: "var(--border-subtle)" }}>
                      <td className="px-4 py-3">
                        <Link href={contentHref(item)} className="flex items-center gap-3">
                          {item.thumbnailUrl ? (
                            <span className="relative block h-9 w-14 shrink-0 overflow-hidden rounded-md">
                              <Image src={item.thumbnailUrl} alt={item.title} fill sizes="56px" className="object-cover" />
                            </span>
                          ) : (
                            <span className="grid h-9 w-14 shrink-0 place-items-center rounded-md" style={{ backgroundColor: "var(--brand-bg-start)" }}>
                              <FileText size={14} className="text-[var(--brand-text-muted)]" />
                            </span>
                          )}
                          <span className="max-w-[220px] truncate text-[13px] font-semibold text-[var(--brand-text)]">{item.title || "Untitled"}</span>
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs capitalize text-[var(--brand-text-muted)]">{item.contentType}</td>
                      <td className="px-4 py-3">
                        <span className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ backgroundColor: s.bg, color: s.fg }}>
                          {s.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-[var(--brand-text-muted)]">{item.owner?.profile?.displayName || item.owner?.username || "—"}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-[var(--brand-text-muted)]">{item.views ?? 0}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-[var(--brand-text-muted)]">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(item)}
                          disabled={deletingId === item.id}
                          className="flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold text-red-600 transition-all duration-150 hover:bg-red-50 active:scale-95 disabled:opacity-50"
                          style={{ borderColor: "rgba(220,38,38,0.3)" }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <p className="text-[var(--brand-text-muted)]">{rangeLabel}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="grid h-8 w-8 place-items-center rounded-lg border transition-all duration-150 active:scale-90 disabled:opacity-40"
            style={{ borderColor: "var(--border-subtle)" }}
            aria-label="Previous page"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-xs text-[var(--brand-text-muted)]">
            Page {page} of {Math.max(pages, 1)}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page >= pages || loading}
            className="grid h-8 w-8 place-items-center rounded-lg border transition-all duration-150 active:scale-90 disabled:opacity-40"
            style={{ borderColor: "var(--border-subtle)" }}
            aria-label="Next page"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
