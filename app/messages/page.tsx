"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, MessageCircle } from "lucide-react";
import { fetchMessages, fetchMyConversations, getOrCreateConversation, sendMessage } from "@/api/messages";
import { getErrorMessage } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import type { Conversation, MessageItem } from "@/types";

function otherParticipant(conversation: Conversation, myId: string) {
  return conversation.participants.find((p) => p._id !== myId) ?? conversation.participants[0];
}

function MessagesInner() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      try {
        const startUsername = searchParams.get("to");
        if (startUsername) {
          const convo = await getOrCreateConversation(startUsername);
          setActiveId(convo._id);
        }
        const list = await fetchMyConversations();
        setConversations(list);
        setActiveId((current) => current ?? list[0]?._id ?? null);
      } catch (err) {
        setError(getErrorMessage(err, "Couldn't load conversations"));
      } finally {
        setLoading(false);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeId) return;
    fetchMessages(activeId)
      .then((res) => setMessages(res.items))
      .catch((err) => setError(getErrorMessage(err, "Couldn't load messages")));
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim() || !activeId) return;
    const body = draft.trim();
    setDraft("");
    const sent = await sendMessage(activeId, body);
    setMessages((prev) => [...prev, sent]);
  };

  if (!user) return null;

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-6xl">
      {/* Conversation list */}
      <aside className="w-full max-w-xs shrink-0 overflow-y-auto border-r px-3 py-5" style={{ borderColor: "var(--border-subtle)" }}>
        <h1 className="mb-4 px-2 text-xl font-extrabold tracking-tight text-[var(--brand-text)]">Messages</h1>
        {loading && <p className="px-2 text-sm text-[var(--brand-text-muted)]">Loading…</p>}
        {!loading && conversations.length === 0 && <p className="px-2 text-sm text-[var(--brand-text-muted)]">No conversations yet. Visit a creator&apos;s channel to start one.</p>}
        <div className="flex flex-col gap-1">
          {conversations.map((c) => {
            const other = otherParticipant(c, user._id);
            const active = c._id === activeId;
            return (
              <button
                key={c._id}
                onClick={() => setActiveId(c._id)}
                className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition"
                style={{ backgroundColor: active ? "color-mix(in srgb, var(--brand-primary) 10%, transparent)" : "transparent" }}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))" }}>
                  {other.profile?.avatarUrl ? <img src={other.profile.avatarUrl} alt={other.username} className="h-full w-full object-cover" /> : (other.profile?.displayName || other.username).charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[var(--brand-text)]">{other.profile?.displayName || other.username}</span>
                  <span className="block truncate text-xs text-[var(--brand-text-muted)]">{c.lastMessage?.body || "No messages yet"}</span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Thread */}
      <section className="flex flex-1 flex-col">
        {error && <p className="px-6 pt-4 text-sm text-red-600">{error}</p>}
        {!activeId ? (
          <div className="grid flex-1 place-items-center text-[var(--brand-text-muted)]">
            <div className="text-center">
              <MessageCircle size={28} className="mx-auto mb-3" />
              <p className="text-sm">Select a conversation to start chatting.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
              {messages.map((m) => {
                const mine = m.sender._id === user._id;
                return (
                  <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className="max-w-[70%] rounded-2xl px-4 py-2.5 text-sm"
                      style={mine ? { backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" } : { backgroundColor: "var(--surface-card)", color: "var(--brand-text)", border: "1px solid var(--border-subtle)" }}
                    >
                      {m.body}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
            <div className="flex items-center gap-2 border-t px-4 py-3" style={{ borderColor: "var(--border-subtle)" }}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Write a message…"
                className="flex-1 rounded-full border px-4 py-2.5 text-sm outline-none focus:border-[var(--border-highlight)]"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", color: "var(--brand-text)" }}
              />
              <button
                onClick={handleSend}
                disabled={!draft.trim()}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full disabled:opacity-40"
                style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}
                aria-label="Send"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default function Messages() {
  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <MessagesInner />
      </Suspense>
    </ProtectedRoute>
  );
}
