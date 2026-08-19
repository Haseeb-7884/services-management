import { Link } from "react-router-dom";
import { Eye, Heart, MessageCircle } from "lucide-react";
import type { ImageItem } from "../types";

export function ImageCard({ image }: { image: ImageItem }) {
  return (
    <Link
      to={`/images/${image._id}`}
      className="card-hover group overflow-hidden rounded-xl border"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}
    >
      <div className="aspect-square w-full overflow-hidden bg-[var(--brand-bg-start)]">
        <img
          src={image.url}
          alt={image.caption || "Image post"}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        {image.caption && (
          <p className="line-clamp-2 text-sm text-[var(--brand-text)]">{image.caption}</p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs text-[var(--brand-text-muted)]">
          <span className="flex items-center gap-1"><Eye size={14} /> {image.views}</span>
          <span className="flex items-center gap-1"><Heart size={14} /> {image.likesCount}</span>
          <span className="flex items-center gap-1"><MessageCircle size={14} /> {image.commentsCount}</span>
        </div>
      </div>
    </Link>
  );
}
