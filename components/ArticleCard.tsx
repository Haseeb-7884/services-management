import Link from "next/link";
import { FileText, Heart, MessageCircle } from "lucide-react";
import type { ArticleItem } from "@/types";

export function ArticleCard({ article }: { article: ArticleItem }) {
  return (
    <Link
      href={`/articles/${article._id}`}
      className="card-hover group overflow-hidden rounded-xl border block"
      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}
    >
      <div className="aspect-video w-full overflow-hidden bg-[var(--brand-bg-start)]">
        {article.coverImageUrl ? (
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <FileText size={28} className="text-[var(--brand-text-muted)]" />
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-[var(--brand-text)]">{article.title}</h3>
        <p className="mt-1 text-xs text-[var(--brand-text-muted)]">
          {article.owner?.profile?.displayName || article.owner?.username}
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs text-[var(--brand-text-muted)]">
          <span className="flex items-center gap-1"><Heart size={14} /> {article.likesCount}</span>
          <span className="flex items-center gap-1"><MessageCircle size={14} /> {article.commentsCount}</span>
        </div>
      </div>
    </Link>
  );
}
