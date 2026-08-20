import Link from "next/link";
import { Eye, Heart, MessageCircle } from "lucide-react";
import type { VideoItem } from "@/types";

export function VideoCard({ video }: { video: VideoItem }) {
  return (
    <Link
      href={`/videos/${video._id}`}
      className="card-hover group overflow-hidden rounded-xl border block"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}
    >
      <div className="aspect-video w-full overflow-hidden bg-[var(--brand-bg-start)]">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <video src={video.url} className="h-full w-full object-cover" muted />
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-[var(--brand-text)]">{video.title}</h3>
        <p className="mt-1 text-xs text-[var(--brand-text-muted)]">
          {video.owner?.profile?.displayName || video.owner?.username}
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs text-[var(--brand-text-muted)]">
          <span className="flex items-center gap-1"><Eye size={14} /> {video.views}</span>
          <span className="flex items-center gap-1"><Heart size={14} /> {video.likesCount}</span>
          <span className="flex items-center gap-1"><MessageCircle size={14} /> {video.commentsCount}</span>
        </div>
      </div>
    </Link>
  );
}
