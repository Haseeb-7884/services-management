import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Check, CheckCircle, Clock, Eye, Share2 } from "lucide-react";
import { fetchImage, fetchImages } from "../api/images";
import { fetchProfile } from "../api/users";
import { FollowButton } from "../components/FollowButton";
import { LikeButton } from "../components/LikeButton";
import { CommentSection } from "../components/CommentSection";
import { formatCount } from "../utils/format";
import { getErrorMessage } from "../api/client";
import { useSeo } from "../hooks/useSeo";
import type { ImageItem } from "../types";

export function ImageDetail() {
  const { id = "" } = useParams();
  const [image, setImage] = useState<ImageItem | null>(null);
  const [error, setError] = useState("");
  const [more, setMore] = useState<ImageItem[]>([]);
  const [ownerFollowed, setOwnerFollowed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setImage(null);
    setError("");
    fetchImage(id)
      .then(setImage)
      .catch((err) => setError(getErrorMessage(err, "This image couldn't be loaded")));
  }, [id]);

  useEffect(() => {
    if (!image) return;
    fetchImages({ category: image.category, page: 1 })
      .then((res) => setMore(res.items.filter((i) => i._id !== image._id).slice(0, 9)))
      .catch(() => setMore([]));
    fetchProfile(image.owner.username)
      .then((p) => setOwnerFollowed(Boolean(p.isFollowedByViewer)))
      .catch(() => setOwnerFollowed(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image?._id]);

  useSeo({
    title: image ? `${image.caption || "Image"} - ${image.owner.profile?.displayName || image.owner.username}` : "Loading image…",
    description: image ? `An image post by ${image.owner.profile?.displayName || image.owner.username}${image.caption ? `: ${image.caption}` : "."}` : undefined,
    image: image?.url,
  });

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: image?.caption || "Image post", url });
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
        <p className="mb-2 text-lg font-bold text-[var(--brand-text)]">Image not found</p>
        <p className="text-sm text-[var(--brand-text-muted)]">{error}</p>
      </div>
    );
  }

  if (!image) return <p className="mx-auto max-w-5xl px-4 py-10 text-[var(--brand-text-muted)]">Loading…</p>;

  const ownerName = image.owner.profile?.displayName || image.owner.username;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main column */}
        <div>
          <div className="mb-6 overflow-hidden rounded-2xl border bg-[var(--brand-bg-start)]" style={{ borderColor: "var(--border-subtle)" }}>
            <img src={image.url} alt={image.caption || "Image post"} className="max-h-[70vh] w-full object-contain" />
          </div>

          {image.caption && (
            <h1 className="mb-4 text-xl font-extrabold leading-tight tracking-tight text-[var(--brand-text)]">{image.caption}</h1>
          )}

          <div className="mb-5 flex flex-wrap items-center gap-3.5">
            <Link to={`/u/${image.owner.username}`} className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2" style={{ borderColor: "var(--border-medium)" }}>
              {image.owner.profile?.avatarUrl ? (
                <img src={image.owner.profile.avatarUrl} alt={ownerName} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm font-bold" style={{ backgroundColor: "var(--surface-card)", color: "var(--brand-primary)" }}>
                  {ownerName.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
            <div>
              <Link to={`/u/${image.owner.username}`} className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-[var(--brand-text)]">{ownerName}</span>
                <CheckCircle size={14} color="var(--brand-primary)" fill="var(--brand-primary)" />
              </Link>
              <div className="mt-0.5 flex gap-3.5 text-xs text-[var(--brand-text-muted)]">
                <span className="flex items-center gap-1">
                  <Eye size={12} /> {formatCount(image.views)} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {new Date(image.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="ml-auto">
              <FollowButton username={image.owner.username} initiallyFollowed={ownerFollowed} />
            </div>
          </div>

          {/* Action row */}
          <div className="mb-6 flex flex-wrap gap-2 border-y py-4" style={{ borderColor: "var(--border-subtle)" }}>
            <div
              className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium text-[var(--brand-text-muted)]"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <LikeButton targetType="Image" targetId={image._id} initialCount={image.likesCount} />
            </div>
            <button
              onClick={() => document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium text-[var(--brand-text-muted)] transition hover:text-[var(--brand-text)]"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              {image.commentsCount} comments
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
            <CommentSection targetType="Image" targetId={image._id} />
          </div>
        </div>

        {/* Sidebar - more images in this category */}
        <div className="lg:sticky lg:top-24">
          <h3 className="mb-4 text-base font-bold text-[var(--brand-text)]">More like this</h3>
          {more.length === 0 ? (
            <p className="text-sm text-[var(--brand-text-muted)]">No more images in this category yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {more.map((item) => (
                <Link
                  key={item._id}
                  to={`/images/${item._id}`}
                  className="aspect-square overflow-hidden rounded-lg bg-[var(--brand-bg-start)]"
                >
                  <img src={item.url} alt={item.caption || "Image post"} className="h-full w-full object-cover transition hover:scale-105" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
