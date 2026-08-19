import { useEffect, useState } from "react";
import { Search, UserMinus, UserPlus } from "lucide-react";
import { fetchUsers } from "../api/admin";
import { getErrorMessage } from "../api/client";
import type { AdminUserRow, Role } from "../types";

/**
 * Reusable "who currently holds this role, and who should I promote next"
 * panel - used for Admin slots, Creator status, and (Owner-only) Super
 * Admin assignment. Each is structurally the same: a list of current
 * holders with a revoke action, plus search-and-promote for anyone else.
 */
export function RoleSlotManager({
  roleLabel,
  roleFilter,
  slotInfo,
  onPromote,
  onRevoke,
}: {
  roleLabel: string;
  roleFilter: Role;
  slotInfo?: { used: number; total: number };
  onPromote: (username: string) => Promise<unknown>;
  onRevoke: (username: string) => Promise<unknown>;
}) {
  const [holders, setHolders] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminUserRow[]>([]);
  const [searching, setSearching] = useState(false);

  const loadHolders = () => {
    setLoading(true);
    fetchUsers({ role: roleFilter, limit: 50 })
      .then((res) => setHolders(res.items))
      .catch((err) => setError(getErrorMessage(err, "Couldn't load the list")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const runSearch = async () => {
    if (!query.trim()) return setResults([]);
    setSearching(true);
    try {
      const res = await fetchUsers({ search: query.trim(), limit: 8 });
      setResults(res.items.filter((u) => u.role !== roleFilter));
    } catch (err) {
      setError(getErrorMessage(err, "Search failed"));
    } finally {
      setSearching(false);
    }
  };

  const handlePromote = async (username: string) => {
    setBusy(username);
    setError("");
    try {
      await onPromote(username);
      setResults((prev) => prev.filter((u) => u.username !== username));
      loadHolders();
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't promote this user"));
    } finally {
      setBusy(null);
    }
  };

  const handleRevoke = async (username: string) => {
    setBusy(username);
    setError("");
    try {
      await onRevoke(username);
      loadHolders();
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't revoke this user"));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-[var(--brand-text)]">Current {roleLabel}s</h2>
        {slotInfo && (
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{
              backgroundColor: slotInfo.used >= slotInfo.total ? "rgba(220,38,38,0.1)" : "color-mix(in srgb, var(--brand-primary) 12%, transparent)",
              color: slotInfo.used >= slotInfo.total ? "#dc2626" : "var(--brand-primary)",
            }}
          >
            {slotInfo.used} / {slotInfo.total} slots used
          </span>
        )}
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="mb-6 space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl" style={{ backgroundColor: "var(--surface-card)" }} />
          ))}
        </div>
      ) : holders.length === 0 ? (
        <p className="mb-6 text-sm text-[var(--brand-text-muted)]">No one currently holds this role.</p>
      ) : (
        <div className="mb-6 space-y-2">
          {holders.map((u) => (
            <div
              key={u._id}
              className="flex items-center gap-3 rounded-xl border px-4 py-2.5"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))" }}
              >
                {u.profile.avatarUrl ? (
                  <img src={u.profile.avatarUrl} alt={u.username} className="h-full w-full object-cover" />
                ) : (
                  (u.profile.displayName || u.username).charAt(0).toUpperCase()
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--brand-text)]">{u.profile.displayName || u.username}</p>
                <p className="truncate text-xs text-[var(--brand-text-muted)]">@{u.username}</p>
              </div>
              <button
                onClick={() => handleRevoke(u.username)}
                disabled={busy === u.username}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
                style={{ borderColor: "rgba(220,38,38,0.3)" }}
              >
                <UserMinus size={13} /> Revoke
              </button>
            </div>
          ))}
        </div>
      )}

      <h3 className="mb-2.5 text-sm font-bold text-[var(--brand-text)]">Assign a new {roleLabel}</h3>
      <div className="mb-3 flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--brand-text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder="Search by username or email…"
            className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", color: "var(--brand-text)" }}
          />
        </div>
        <button
          onClick={runSearch}
          disabled={searching}
          className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-[var(--surface-card-hover)]"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          Search
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((u) => (
            <div
              key={u._id}
              className="flex items-center gap-3 rounded-xl border px-4 py-2.5"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--brand-text)]">{u.profile.displayName || u.username}</p>
                <p className="truncate text-xs text-[var(--brand-text-muted)]">
                  @{u.username} · currently {u.role.replace("_", " ")}
                </p>
              </div>
              <button
                onClick={() => handlePromote(u.username)}
                disabled={busy === u.username}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}
              >
                <UserPlus size={13} /> Make {roleLabel}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
