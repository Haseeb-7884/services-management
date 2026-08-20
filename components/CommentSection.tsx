"use client";

import { useEffect, useState } from "react";
import { addComment, fetchComments } from "@/api/social";
import { useAuth } from "@/context/AuthContext";
import type { CommentItem } from "@/types";

export function CommentSection({ targetType, targetId }: { targetType: "Video" | "Image" | "Article"; targetId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments(targetType, targetId)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [targetType, targetId]);

  const submit = async () => {
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      const comment = await addComment({ targetType, targetId, body });
      setComments((prev) => [comment, ...prev]);
      setBody("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-semibold text-[var(--brand-text)]">Comments ({comments.length})</h3>

      {user && (
        <div className="mb-4 flex gap-2">
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 rounded-md border px-3 py-2 text-sm text-[var(--brand-text)] placeholder:text-[var(--brand-text-muted)] focus:outline-none focus:border-[var(--border-highlight)]"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--brand-bg-start)" }}
          />
          <button
            onClick={submit}
            disabled={submitting}
            className="rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}
          >
            Post
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[var(--brand-text-muted)]">Loading comments…</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c._id} className="rounded-md border p-3" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
              <p className="text-xs font-medium text-[var(--brand-text)]">{c.author.profile?.displayName || c.author.username}</p>
              <p className="mt-1 text-sm text-[var(--brand-text-muted)]">{c.body}</p>
            </li>
          ))}
          {comments.length === 0 && <p className="text-sm text-[var(--brand-text-muted)]">Be the first to comment.</p>}
        </ul>
      )}
    </div>
  );
}
