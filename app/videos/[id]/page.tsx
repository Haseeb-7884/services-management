"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Check, Clock, Eye, MessageSquare, Play, Share2 } from "lucide-react";
import { fetchVideo, fetchVideos } from "@/api/videos";
import { fetchProfile } from "@/api/users";
import { FollowButton } from "@/components/FollowButton";
import { LikeButton } from "@/components/LikeButton";
import { CommentSection } from "@/components/CommentSection";
import { VideoPlayer } from "@/components/VideoPlayer";
import { formatCount, formatDuration } from "@/utils/format";
import { getErrorMessage } from "@/api/client";
import { useSeo } from "@/hooks/useSeo";
import { toDescription } from "@/utils/seo";
import type { VideoItem } from "@/types";

export default function VideoDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [video, setVideo] = useState<VideoItem | null>(null);
  const [error, setError] = useState("");
  const [upNext, setUpNext] = useState<VideoItem[]>([]);
  const [ownerFollowed, setOwnerFollowed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setVideo(null);
    setError("");
    fetchVideo(id)
      .then(setVideo)
      .catch((err) => setError(getErrorMessage(err, "This video couldn't be loaded")));
  }, [id]);

  useEffect(() => {
    if (!video) return;
    fetchVideos({ category: video.category, page: 1 })
      .then((res) => setUpNext(res.items.filter((v) => v._id !== video._id).slice(0, 8)))
      .catch(() => setUpNext([]));
    fetchProfile(video.owner.username)
      .then((p) => setOwnerFollowed(Boolean(p.isFollowedByViewer)))
      .catch(() => setOwnerFollowed(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?._id]);

  useSeo({
    title: video ? `${video.title} - ${video.owner.profile?.displayName || video.owner.username}` : "Loading video…",
    description: video ? toDescription(video.description) || `Watch "${video.title}" on ${video.owner.profile?.displayName || video.owner.username}'s channel.` : undefined,
    image: video?.thumbnailUrl,
    type: "video.other",
  });

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: video?.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // user cancelled the native share sheet, or clipboard access was denied
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="mb-2 text-lg font-bold text-[var(--brand-text)]">Video not found</p>
        <p className="text-sm text-[var(--brand-text-muted)]">{error}</p>
      </div>
    );
  }

  if (!video) return <p className="mx-auto max-w-5xl px-4 py-10 text-[var(--brand-text-muted)]">Loading…</p>;

  const ownerName = video.owner.profile?.displayName || video.owner.username;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main column */}
        <div>
          <div className="mb-6">
            <VideoPlayer src={video.url} poster={video.thumbnailUrl} title={video.title} />
          </div>

          <h1 className="mb-4 text-2xl font-extrabold leading-tight tracking-tight text-[var(--brand-text)]">{video.title}</h1>

          <div className="mb-5 flex flex-wrap items-center gap-3.5">
            <Link href={`/u/${video.owner.username}`} className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2" style={{ borderColor: "var(--border-medium)" }}>
              {video.owner.profile?.avatarUrl ? (
                <img src={video.owner.profile.avatarUrl} alt={ownerName} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm font-bold" style={{ backgroundColor: "var(--surface-card)", color: "var(--brand-primary)" }}>
                  {ownerName.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
            <div>
              <Link href={`/u/${video.owner.username}`} className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-[var(--brand-text)]">{ownerName}</span>
                <CheckCircle size={14} color="var(--brand-primary)" fill="var(--brand-primary)" />
              </Link>
              <div className="mt-0.5 flex gap-3.5 text-xs text-[var(--brand-text-muted)]">
                <span className="flex items-center gap-1">
                  <Eye size={12} /> {formatCount(video.views)} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {new Date(video.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="ml-auto">
              <FollowButton username={video.owner.username} initiallyFollowed={ownerFollowed} />
            </div>
          </div>

          {/* Action row */}
          <div className="mb-6 flex flex-wrap gap-2 border-y py-4" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium text-[var(--brand-text-muted)]" style={{ borderColor: "var(--border-subtle)" }}>
              <LikeButton targetType="Video" targetId={video._id} initialCount={video.likesCount} />
            </div>
            <button
              onClick={() => document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium text-[var(--brand-text-muted)] transition hover:text-[var(--brand-text)]"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <MessageSquare size={15} /> {video.commentsCount}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium text-[var(--brand-text-muted)] transition hover:text-[var(--brand-text)]"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              {copied ? <Check size={15} color="#16a34a" /> : <Share2 size={15} />} {copied ? "Copied!" : "Share"}
            </button>
          </div>

          {/* Description */}
          {video.description && (
            <div className="mb-8 rounded-2xl border p-5" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
              <p className="text-sm leading-relaxed text-[var(--brand-text-muted)]">{video.description}</p>
            </div>
          )}

          <div id="comments">
            <CommentSection targetType="Video" targetId={video._id} />
          </div>
        </div>

        {/* Sidebar - Up Next: more videos from the same category */}
        <div className="lg:sticky lg:top-24">
          <h3 className="mb-4 text-base font-bold text-[var(--brand-text)]">Up Next</h3>
          {upNext.length === 0 ? (
            <p className="text-sm text-[var(--brand-text-muted)]">No more videos in this category yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {upNext.map((item) => (
                <Link
                  key={item._id}
                  href={`/videos/${item._id}`}
                  className="card-hover flex cursor-pointer gap-3 rounded-xl border p-2.5"
                  style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}
                >
                  <div className="relative h-[72px] w-[120px] shrink-0 overflow-hidden rounded-lg bg-[var(--brand-bg-start)]">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <video src={item.url} className="h-full w-full object-cover" muted />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play size={16} color="rgba(255,255,255,0.9)" fill="rgba(255,255,255,0.9)" />
                    </div>
                    {Boolean(item.durationSec) && (
                      <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-bold text-white">{formatDuration(item.durationSec)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 line-clamp-2 text-[13px] font-semibold leading-snug text-[var(--brand-text)]">{item.title}</p>
                    <p className="mb-0.5 text-[11px] text-[var(--brand-text-muted)]">{item.owner.profile?.displayName || item.owner.username}</p>
                    <p className="flex items-center gap-1 text-[11px] text-[var(--brand-text-muted)]">
                      <Eye size={10} /> {formatCount(item.views)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
