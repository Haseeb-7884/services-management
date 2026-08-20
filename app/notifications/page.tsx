"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Heart, MessageSquare, UserPlus } from "lucide-react";
import { fetchMyNotifications, markAllNotificationsRead, markNotificationRead } from "@/api/notifications";
import { getErrorMessage } from "@/api/client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import type { NotificationItem } from "@/types";

const TYPE_ICON = { follow: UserPlus, like: Heart, comment: MessageSquare } as const;

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function messageFor(n: NotificationItem) {
  const name = n.actor.profile?.displayName || n.actor.username;
  if (n.type === "follow") return `${name} started following you`;
  if (n.type === "like") return `${name} liked your ${n.targetType?.toLowerCase() ?? "content"}`;
  return `${name} commented on your ${n.targetType?.toLowerCase() ?? "content"}`;
}

function NotificationsInner() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyNotifications(1, 50)
      .then((res) => setItems(res.items))
      .catch((err) => setError(getErrorMessage(err, "Couldn't load notifications")))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClick = async (n: NotificationItem) => {
    if (n.read) return;
    await markNotificationRead(n._id);
    setItems((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">Notifications</h1>
        {items.some((n) => !n.read) && (
          <button onClick={handleMarkAllRead} className="text-sm font-semibold text-[var(--brand-primary)] hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      {loading && <p className="text-sm text-[var(--brand-text-muted)]">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl border p-10 text-center" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
          <Bell size={28} className="mx-auto mb-3 text-[var(--brand-text-muted)]" />
          <p className="text-sm text-[var(--brand-text-muted)]">You&apos;re all caught up — no notifications yet.</p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
        {items.map((n, i) => {
          const Icon = TYPE_ICON[n.type];
          return (
            <button
              key={n._id}
              onClick={() => handleClick(n)}
              className={`flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-[var(--surface-card-hover)] ${i < items.length - 1 ? "border-b" : ""}`}
              style={{ borderColor: "var(--border-subtle)", backgroundColor: n.read ? "transparent" : "color-mix(in srgb, var(--brand-primary) 5%, transparent)" }}
            >
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 12%, transparent)" }}>
                <Icon size={15} color="var(--brand-primary)" />
              </span>
              <span className="flex-1">
                <span className="block text-sm text-[var(--brand-text)]">{messageFor(n)}</span>
                <span className="mt-0.5 block text-xs text-[var(--brand-text-muted)]">{timeAgo(n.createdAt)}</span>
              </span>
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: "var(--brand-primary)" }} />}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-[var(--brand-text-muted)]">
        Looking for messages instead?{" "}
        <Link href="/messages" className="font-semibold text-[var(--brand-primary)]">
          Go to Messages
        </Link>
      </p>
    </div>
  );
}

export default function Notifications() {
  return (
    <ProtectedRoute>
      <NotificationsInner />
    </ProtectedRoute>
  );
}
