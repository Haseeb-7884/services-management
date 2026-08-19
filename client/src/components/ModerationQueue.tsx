import { useEffect, useState } from "react";
import { FileText, ImageIcon, Video as VideoIcon } from "lucide-react";
import { approveContent, fetchPendingContent, rejectContent } from "../api/admin";
import { getErrorMessage } from "../api/client";
import type { PendingContentItem } from "../types";

const TYPE_ICON = { video: VideoIcon, image: ImageIcon, article: FileText } as const;

/** Shared between the Admin and Super Admin dashboards - both moderate the
 *  same global content queue, since moderation state isn't owned by any
 *  one Admin (it's just whatever's currently pending). */
export function ModerationQueue() {
  const [items, setItems] = useState<PendingContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchPendingContent({ limit: 30 })
      .then((res) => setItems(res.items))
      .catch((err) => setError(getErrorMessage(err, "Couldn't load the moderation queue")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (item: PendingContentItem) => {
    setBusyId(item.id);
    try {
      await approveContent(item.contentType, item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't approve this item"));
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (item: PendingContentItem) => {
    setBusyId(item.id);
    try {
      await rejectContent(item.contentType, item.id, reason.trim() || undefined);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setRejectingId(null);
      setReason("");
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't reject this item"));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl" style={{ backgroundColor: "var(--surface-card)" }} />
        ))}
      </div>
    );
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border py-14 text-center" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
        <p className="text-sm font-medium text-[var(--brand-text)]">Queue is empty</p>
        <p className="mt-1 text-sm text-[var(--brand-text-muted)]">Nothing waiting for review right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const Icon = TYPE_ICON[item.contentType];
        const ownerName = item.owner.profile?.displayName || item.owner.username;
        const isRejecting = rejectingId === item.id;
        return (
          <div
            key={item.id}
            className="rounded-2xl border p-4"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="flex items-center gap-3.5">
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--brand-bg-start)]">
                {item.thumbnailUrl ? (
                  <img src={item.thumbnailUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center">
                    <Icon size={18} className="text-[var(--brand-text-muted)]" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--brand-text)]">{item.title || "Untitled"}</p>
                <p className="mt-0.5 text-xs text-[var(--brand-text-muted)]">
                  <span className="uppercase tracking-wide">{item.contentType}</span> · by {ownerName} ·{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => handleApprove(item)}
                  disabled={busyId === item.id}
                  className="rounded-lg px-3.5 py-1.5 text-sm font-semibold disabled:opacity-50"
                  style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}
                >
                  Approve
                </button>
                <button
                  onClick={() => setRejectingId(isRejecting ? null : item.id)}
                  disabled={busyId === item.id}
                  className="rounded-lg border px-3.5 py-1.5 text-sm font-semibold text-red-600 disabled:opacity-50"
                  style={{ borderColor: "rgba(220,38,38,0.3)" }}
                >
                  Reject
                </button>
              </div>
            </div>

            {isRejecting && (
              <div className="mt-3 flex gap-2 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason (optional) - shown to the creator"
                  className="flex-1 rounded-lg border px-3 py-1.5 text-sm outline-none"
                  style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--brand-bg-start)", color: "var(--brand-text)" }}
                />
                <button
                  onClick={() => handleReject(item)}
                  disabled={busyId === item.id}
                  className="rounded-lg px-3.5 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  Confirm reject
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
