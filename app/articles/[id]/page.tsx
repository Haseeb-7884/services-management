"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Check, CheckCircle, Clock, Eye, Share2 } from "lucide-react";
import { fetchArticle, fetchArticles } from "@/api/articles";
import { fetchProfile } from "@/api/users";
import { FollowButton } from "@/components/FollowButton";
import { LikeButton } from "@/components/LikeButton";
import { CommentSection } from "@/components/CommentSection";
import { formatCount } from "@/utils/format";
import { getErrorMessage } from "@/api/client";
import { useSeo } from "@/hooks/useSeo";
import { toDescription } from "@/utils/seo";
import type { ArticleItem } from "@/types";

export default function ArticleDetail() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [article, setArticle] = useState<ArticleItem | null>(null);
  const [error, setError] = useState("");
  const [more, setMore] = useState<ArticleItem[]>([]);
  const [ownerFollowed, setOwnerFollowed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setArticle(null);
    setError("");
    fetchArticle(id)
      .then(setArticle)
      .catch((err) => setError(getErrorMessage(err, "This article couldn't be loaded")));
  }, [id]);

  useEffect(() => {
    if (!article) return;
    fetchArticles({ category: article.category, page: 1 })
      .then((res) => setMore(res.items.filter((a) => a._id !== article._id).slice(0, 6)))
      .catch(() => setMore([]));
    fetchProfile(article.owner.username)
      .then((p) => setOwnerFollowed(Boolean(p.isFollowedByViewer)))
      .catch(() => setOwnerFollowed(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?._id]);

  useSeo({
    title: article ? `${article.title} - ${article.owner.profile?.displayName || article.owner.username}` : "Loading article…",
    description: article ? toDescription(article.excerpt || article.body) : undefined,
    image: article?.coverImageUrl,
    type: "article",
  });

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: article?.title, url });
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
        <p className="mb-2 text-lg font-bold text-[var(--brand-text)]">Article not found</p>
        <p className="text-sm text-[var(--brand-text-muted)]">{error}</p>
      </div>
    );
  }

  if (!article) return <p className="mx-auto max-w-5xl px-4 py-10 text-[var(--brand-text-muted)]">Loading…</p>;

  const ownerName = article.owner.profile?.displayName || article.owner.username;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="mx-auto w-full max-w-2xl lg:mx-0">
          {article.coverImageUrl && (
            <div className="mb-6 aspect-video overflow-hidden rounded-2xl border bg-[var(--brand-bg-start)]" style={{ borderColor: "var(--border-subtle)" }}>
              <img src={article.coverImageUrl} alt={article.title} className="h-full w-full object-cover" />
            </div>
          )}

          <span className="mb-3 inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide" style={{ borderColor: "var(--border-medium)", color: "var(--brand-text-muted)" }}>
            {article.category}
          </span>
          <h1 className="mb-4 text-2xl font-extrabold leading-tight tracking-tight text-[var(--brand-text)] sm:text-3xl">{article.title}</h1>

          <div className="mb-6 flex flex-wrap items-center gap-3.5">
            <Link href={`/u/${article.owner.username}`} className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2" style={{ borderColor: "var(--border-medium)" }}>
              {article.owner.profile?.avatarUrl ? (
                <img src={article.owner.profile.avatarUrl} alt={ownerName} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm font-bold" style={{ backgroundColor: "var(--surface-card)", color: "var(--brand-primary)" }}>
                  {ownerName.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
            <div>
              <Link href={`/u/${article.owner.username}`} className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-[var(--brand-text)]">{ownerName}</span>
                <CheckCircle size={14} color="var(--brand-primary)" fill="var(--brand-primary)" />
              </Link>
              <div className="mt-0.5 flex gap-3.5 text-xs text-[var(--brand-text-muted)]">
                <span className="flex items-center gap-1">
                  <Eye size={12} /> {formatCount(article.views)} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {new Date(article.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="ml-auto">
              <FollowButton username={article.owner.username} initiallyFollowed={ownerFollowed} />
            </div>
          </div>

          {/* Body */}
          <div className="mb-8 whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--brand-text)]">{article.body}</div>

          {/* Action row */}
          <div className="mb-6 flex flex-wrap gap-2 border-y py-4" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium text-[var(--brand-text-muted)]" style={{ borderColor: "var(--border-subtle)" }}>
              <LikeButton targetType="Article" targetId={article._id} initialCount={article.likesCount} />
            </div>
            <button
              onClick={() => document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium text-[var(--brand-text-muted)] transition hover:text-[var(--brand-text)]"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              {article.commentsCount} comments
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium text-[var(--brand-text-muted)] transition hover:text-[var(--brand-text)]"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              {copied ? <Check size={15} color="#16a34a" /> : <Share2 size={15} />} {copied ? "Copied!" : "Share"}
            </button>
          </div>

          <div id="comments">
            <CommentSection targetType="Article" targetId={article._id} />
          </div>
        </div>

        {/* Sidebar - more articles in this category */}
        <div className="lg:sticky lg:top-24">
          <h3 className="mb-4 text-base font-bold text-[var(--brand-text)]">More articles</h3>
          {more.length === 0 ? (
            <p className="text-sm text-[var(--brand-text-muted)]">No more articles in this category yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {more.map((item) => (
                <Link
                  key={item._id}
                  href={`/articles/${item._id}`}
                  className="card-hover flex cursor-pointer gap-3 rounded-xl border p-2.5"
                  style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}
                >
                  {item.coverImageUrl && (
                    <div className="h-[60px] w-[90px] shrink-0 overflow-hidden rounded-lg bg-[var(--brand-bg-start)]">
                      <img src={item.coverImageUrl} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 line-clamp-2 text-[13px] font-semibold leading-snug text-[var(--brand-text)]">{item.title}</p>
                    <p className="text-[11px] text-[var(--brand-text-muted)]">{item.owner.profile?.displayName || item.owner.username}</p>
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
