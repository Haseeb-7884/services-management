"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Search, ShieldAlert, ShieldOff, Users } from "lucide-react";
import { fetchUsers, updateUserStatus } from "@/api/admin";
import { getErrorMessage } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import type { AdminUserRow, Role } from "@/types";

const ROLE_FILTERS: { label: string; value: Role | "" }[] = [
  { label: "All roles", value: "" },
  { label: "Owner", value: "owner" },
  { label: "Super Admin", value: "super_admin" },
  { label: "Admin", value: "admin" },
  { label: "Moderator", value: "moderator" },
  { label: "Creator", value: "creator" },
  { label: "Premium", value: "premium" },
  { label: "Standard", value: "standard" },
];

const STATUS_STYLE: Record<AdminUserRow["status"], { bg: string; fg: string; label: string }> = {
  active: { bg: "rgba(22,163,74,0.1)", fg: "#16a34a", label: "Active" },
  suspended: { bg: "rgba(217,119,6,0.12)", fg: "#d97706", label: "Suspended" },
  banned: { bg: "rgba(220,38,38,0.1)", fg: "#dc2626", label: "Banned" },
};

const PAGE_SIZE = 20;

export default function SuperAdminUsers() {
  const { user: me } = useAuth();

  const [items, setItems] = useState<AdminUserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const [roleFilter, setRoleFilter] = useState<Role | "">("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    fetchUsers({ role: roleFilter || undefined, search: search || undefined, page, limit: PAGE_SIZE })
      .then((res) => {
        setItems(res.items);
        setTotal(res.total);
        setPages(res.pages);
      })
      .catch((err) => setError(getErrorMessage(err, "Couldn't load users")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, search, page]);

  const runSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleStatusChange = async (u: AdminUserRow, status: AdminUserRow["status"]) => {
    setBusy(u.username);
    setError("");
    try {
      await updateUserStatus(u.username, status);
      setItems((prev) => prev.map((row) => (row.username === u.username ? { ...row, status } : row)));
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't update this user"));
    } finally {
      setBusy(null);
    }
  };

  const canModerate = (u: AdminUserRow) => u.role !== "owner" && u.username !== me?.username;

  const rangeLabel = useMemo(() => {
    if (total === 0) return "0 users";
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, total);
    return `${start}-${end} of ${total} users`;
  }, [page, total]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 12%, transparent)" }}>
          <Users size={18} color="var(--brand-primary)" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[var(--brand-text)]">Users</h1>
          <p className="text-sm text-[var(--brand-text-muted)]">Search every account on the platform and manage access.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand-text-muted)]" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder="Search by username or email…"
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
          value={roleFilter}
          onChange={(e) => {
            setPage(1);
            setRoleFilter(e.target.value as Role | "");
          }}
          className="rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", color: "var(--brand-text)" }}
        >
          {ROLE_FILTERS.map((r) => (
            <option key={r.label} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wide text-[var(--brand-text-muted)]" style={{ borderColor: "var(--border-subtle)" }}>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
                    <td className="px-4 py-3" colSpan={5}>
                      <div className="h-8 w-full animate-pulse rounded-lg" style={{ backgroundColor: "var(--surface-card-hover)" }} />
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-[var(--brand-text-muted)]" colSpan={5}>
                    No users found.
                  </td>
                </tr>
              ) : (
                items.map((u) => {
                  const s = STATUS_STYLE[u.status];
                  return (
                    <tr key={u._id} className="border-b transition-colors last:border-0 hover:bg-[var(--surface-card-hover)]" style={{ borderColor: "var(--border-subtle)" }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))" }}>
                            {u.profile.avatarUrl ? <img src={u.profile.avatarUrl} alt={u.username} className="h-full w-full object-cover" /> : (u.profile.displayName || u.username).charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[var(--brand-text)]">{u.profile.displayName || u.username}</p>
                            <p className="truncate text-xs text-[var(--brand-text-muted)]">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold capitalize" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 10%, transparent)", color: "var(--brand-primary)" }}>
                          {u.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ backgroundColor: s.bg, color: s.fg }}>
                          {s.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-[var(--brand-text-muted)]">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {!canModerate(u) ? (
                          <span className="text-xs text-[var(--brand-text-muted)]">—</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {u.status !== "active" && (
                              <button
                                onClick={() => handleStatusChange(u, "active")}
                                disabled={busy === u.username}
                                className="flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold text-green-600 transition-all duration-150 hover:bg-green-50 active:scale-95 disabled:opacity-50"
                                style={{ borderColor: "rgba(22,163,74,0.3)" }}
                              >
                                <RotateCcw size={12} /> Reactivate
                              </button>
                            )}
                            {u.status !== "suspended" && (
                              <button
                                onClick={() => handleStatusChange(u, "suspended")}
                                disabled={busy === u.username}
                                className="flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold text-amber-600 transition-all duration-150 hover:bg-amber-50 active:scale-95 disabled:opacity-50"
                                style={{ borderColor: "rgba(217,119,6,0.3)" }}
                              >
                                <ShieldAlert size={12} /> Suspend
                              </button>
                            )}
                            {u.status !== "banned" && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Ban @${u.username}? They will be immediately signed out and unable to log back in.`)) handleStatusChange(u, "banned");
                                }}
                                disabled={busy === u.username}
                                className="flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold text-red-600 transition-all duration-150 hover:bg-red-50 active:scale-95 disabled:opacity-50"
                                style={{ borderColor: "rgba(220,38,38,0.3)" }}
                              >
                                <ShieldOff size={12} /> Ban
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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
