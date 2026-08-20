"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { fetchFollowers } from "@/api/users";
import { formatCount, formatRelativeTime } from "@/utils/format";
import type { FollowerItem } from "@/types";

export default function DashboardAudience() {
  const { user } = useAuth();
  const [followers, setFollowers] = useState<FollowerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchFollowers(user.username, 50)
      .then(setFollowers)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">Audience</h1>
      <p className="mb-7 text-sm text-[var(--brand-text-muted)]">Who&apos;s following your channel.</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Follower count callout */}
        <div className="h-fit rounded-2xl border p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
          <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 12%, transparent)" }}>
            <Users size={20} color="var(--brand-primary)" />
          </div>
          <p className="mb-0.5 text-[32px] font-extrabold tracking-tight text-[var(--brand-text)]">{formatCount(user?.followersCount)}</p>
          <p className="text-[13px] text-[var(--brand-text-muted)]">Total followers</p>
          <p className="mt-4 text-xs leading-relaxed text-[var(--brand-text-muted)]">Follower growth over time isn&apos;t tracked yet - this shows your current count and most recent followers.</p>
        </div>

        {/* Recent followers */}
        <div className="h-fit rounded-2xl border p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
          <h2 className="mb-5 text-[17px] font-bold text-[var(--brand-text)]">Recent Followers</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 animate-pulse rounded-lg" style={{ backgroundColor: "var(--brand-bg-start)" }} />
              ))}
            </div>
          ) : followers.length === 0 ? (
            <p className="text-sm text-[var(--brand-text-muted)]">No followers yet - once people start following you, they&apos;ll show up here.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {followers.map((f) => (
                <Link key={f._id} href={`/u/${f.username}`} className="flex items-center gap-3">
                  {f.profile.avatarUrl ? (
                    <img src={f.profile.avatarUrl} alt={f.profile.displayName || f.username} className="h-9 w-9 rounded-full border object-cover" style={{ borderColor: "var(--border-medium)" }} />
                  ) : (
                    <span className="grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))" }}>
                      {(f.profile.displayName || f.username).charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--brand-text)]">{f.profile.displayName || f.username}</p>
                    <p className="truncate text-xs text-[var(--brand-text-muted)]">@{f.username}</p>
                  </div>
                  <span className="shrink-0 text-xs text-[var(--brand-text-muted)]">{formatRelativeTime(f.followedAt)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
