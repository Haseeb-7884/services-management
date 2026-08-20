"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Camera, CheckCircle, Check, Eye, FileText, Globe, Heart, ImageIcon, Link2, MessageSquare, Play, Share2 } from "lucide-react";
import { fetchChannelContent, fetchProfile, updateProfile, uploadAvatar, uploadCover } from "@/api/users";
import { getErrorMessage } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import { FollowButton } from "@/components/FollowButton";
import { useSeo } from "@/hooks/useSeo";
import { formatCount } from "@/utils/format";
import type { ChannelContentItem, User } from "@/types";

const TABS = [
  { label: "Posts", type: "all" as const },
  { label: "Videos", type: "video" as const },
  { label: "Shorts", type: "short" as const },
  { label: "Images", type: "image" as const },
  { label: "Articles", type: "article" as const },
  { label: "About", type: "about" as const },
];
const VERIFIED_ROLES = new Set(["creator", "moderator", "admin", "super_admin", "owner"]);

export default function Profile() {
  const params = useParams<{ username: string }>();
  const username = params?.username ?? "";
  const { user: viewer } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [profileError, setProfileError] = useState("");
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["type"]>("all");
  const [copied, setCopied] = useState(false);

  const [content, setContent] = useState<ChannelContentItem[]>([]);
  const [contentLoading, setContentLoading] = useState(true);

  const load = () => {
    setProfileError("");
    fetchProfile(username)
      .then((p) => {
        setProfile(p);
        setBio(p.profile.bio ?? "");
        setDisplayName(p.profile.displayName ?? "");
      })
      .catch((err) => setProfileError(getErrorMessage(err, "Couldn't load this channel")));
  };

  useEffect(() => {
    setProfile(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  useEffect(() => {
    if (!profile || activeTab === "about") return;
    setContentLoading(true);
    fetchChannelContent(username, activeTab)
      .then((res) => setContent(res.items))
      .catch(() => setContent([]))
      .finally(() => setContentLoading(false));
  }, [username, activeTab, profile]);

  useSeo({
    title: profile ? `${profile.profile.displayName || profile.username} (@${profile.username})` : `@${username}`,
    description: profile ? profile.profile.bio || profile.profile.tagline || `Check out @${profile.username}'s channel.` : undefined,
    image: profile?.profile.avatarUrl,
    type: "profile",
    noindex: Boolean(profileError),
  });

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: profile?.username, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // user cancelled the native share sheet, or clipboard access was denied - not an error worth surfacing
    }
  };

  if (profileError) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="mb-2 text-lg font-bold text-[var(--brand-text)]">Channel not found</p>
        <p className="text-sm text-[var(--brand-text-muted)]">{profileError}</p>
      </div>
    );
  }

  if (!profile) return <p className="mx-auto max-w-5xl px-4 py-10 text-[var(--brand-text-muted)]">Loading profile…</p>;

  const isOwnProfile = viewer?.username === profile.username;
  const isVerified = VERIFIED_ROLES.has(profile.role);
  const name = profile.profile.displayName || profile.username;

  const saveProfile = async () => {
    await updateProfile({ bio, displayName });
    setEditing(false);
    load();
  };

  return (
    <div>
      {/* Banner */}
      <div className="group relative h-[220px] overflow-hidden bg-[var(--brand-bg-start)] sm:h-[280px]">
        {profile.profile.coverUrl ? (
          <img src={profile.profile.coverUrl} alt="Cover" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" style={{ background: "linear-gradient(135deg, var(--brand-text), color-mix(in srgb, var(--brand-text) 70%, var(--brand-primary) 30%))", opacity: 0.9 }} />
        )}
        <div className="absolute inset-0" style={{ background: "var(--scrim-strong)" }} />
        {isOwnProfile && (
          <label className="absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition group-hover:opacity-100" style={{ backgroundColor: "rgba(0,0,0,0.35)" }} title="Change cover photo">
            <span className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
              <Camera size={16} /> Change cover
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                if (e.target.files?.[0]) {
                  await uploadCover(e.target.files[0]);
                  load();
                }
              }}
            />
          </label>
        )}
      </div>

      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="relative -mt-12 mb-6">
          <div className="flex flex-wrap items-center gap-5">
            <div className="group relative shrink-0">
              <div className="h-28 w-28 overflow-hidden rounded-full border-4" style={{ borderColor: "var(--brand-bg-end)", boxShadow: "0 0 0 2px var(--border-medium)" }}>
                {profile.profile.avatarUrl ? (
                  <img src={profile.profile.avatarUrl} alt={name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-3xl font-bold text-white" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))" }}>
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                {isOwnProfile && (
                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full opacity-0 transition group-hover:opacity-100" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} title="Change avatar">
                    <Camera size={22} color="#fff" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          await uploadAvatar(e.target.files[0]);
                          load();
                        }
                      }}
                    />
                  </label>
                )}
              </div>
              {isVerified && (
                <div className="absolute bottom-1 right-1 grid h-6 w-6 place-items-center rounded-full border-2" style={{ backgroundColor: "var(--brand-primary)", borderColor: "var(--brand-bg-end)" }}>
                  <CheckCircle size={12} color="var(--brand-bg-start)" fill="var(--brand-bg-start)" />
                </div>
              )}
            </div>

            <div className="min-w-[200px] flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-extrabold tracking-tight text-[var(--brand-text)] sm:text-[28px]">{name}</h1>
                {isVerified && (
                  <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide" style={{ borderColor: "var(--border-highlight)", backgroundColor: "color-mix(in srgb, var(--brand-primary) 10%, transparent)", color: "var(--brand-primary)" }}>
                    Verified Creator
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--brand-text-muted)]">
                @{profile.username}
                <span className="mx-1.5">·</span>
                <strong className="font-semibold text-[var(--brand-text)]">{formatCount(profile.followersCount)}</strong> followers
                <span className="mx-1.5">·</span>
                <strong className="font-semibold text-[var(--brand-text)]">{formatCount(profile.followingCount)}</strong> following
              </p>
              {profile.profile.tagline && <p className="mb-2 mt-1 text-sm font-medium text-[var(--brand-text)]">{profile.profile.tagline}</p>}
              {profile.profile.category && (
                <span className="mb-2 mt-1 inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold" style={{ borderColor: "var(--border-medium)", color: "var(--brand-text-muted)" }}>
                  {profile.profile.category}
                </span>
              )}
            </div>

            <div className="ml-auto flex gap-2.5">
              {!isOwnProfile && (
                <>
                  <FollowButton username={profile.username} initiallyFollowed={Boolean(profile.isFollowedByViewer)} />
                  {viewer && (
                    <Link href={`/messages?to=${profile.username}`} className="rounded-lg border px-3.5 py-2 text-sm font-medium transition hover:bg-[var(--surface-card-hover)]" style={{ borderColor: "var(--border-subtle)" }}>
                      Message
                    </Link>
                  )}
                </>
              )}
              <button
                onClick={handleShare}
                className="grid h-10 w-10 place-items-center rounded-lg border transition hover:bg-[var(--surface-card-hover)]"
                style={{ borderColor: "var(--border-subtle)" }}
                aria-label="Share channel"
                title={copied ? "Link copied!" : "Share channel"}
              >
                {copied ? <Check size={17} color="#16a34a" /> : <Share2 size={17} className="text-[var(--brand-text-muted)]" />}
              </button>
            </div>
          </div>

          {/* Bio */}
          {editing ? (
            <div className="mt-5 max-w-lg space-y-3">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display name"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Bio"
                rows={3}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}
              />
              <div className="flex gap-2">
                <button onClick={saveProfile} className="rounded-lg px-4 py-1.5 text-sm font-semibold" style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}>
                  Save
                </button>
                <button onClick={() => setEditing(false)} className="rounded-lg border px-4 py-1.5 text-sm" style={{ borderColor: "var(--border-subtle)" }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--brand-text-muted)]">{profile.profile.bio || "No bio yet."}</p>
              {profile.profile.socialLinks && Object.values(profile.profile.socialLinks).some(Boolean) && (
                <div className="mt-3 flex items-center gap-3">
                  {profile.profile.socialLinks.website && (
                    <a href={profile.profile.socialLinks.website} target="_blank" rel="noreferrer" aria-label="Website" className="flex items-center gap-1 text-xs font-medium text-[var(--brand-text-muted)] transition hover:text-[var(--brand-primary)]">
                      <Globe size={15} /> Website
                    </a>
                  )}
                  {profile.profile.socialLinks.twitter && (
                    <a href={profile.profile.socialLinks.twitter} target="_blank" rel="noreferrer" aria-label="X / Twitter" className="flex items-center gap-1 text-xs font-medium text-[var(--brand-text-muted)] transition hover:text-[var(--brand-primary)]">
                      <Link2 size={15} /> X / Twitter
                    </a>
                  )}
                  {profile.profile.socialLinks.instagram && (
                    <a href={profile.profile.socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="flex items-center gap-1 text-xs font-medium text-[var(--brand-text-muted)] transition hover:text-[var(--brand-primary)]">
                      <Link2 size={15} /> Instagram
                    </a>
                  )}
                  {profile.profile.socialLinks.youtube && (
                    <a href={profile.profile.socialLinks.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="flex items-center gap-1 text-xs font-medium text-[var(--brand-text-muted)] transition hover:text-[var(--brand-primary)]">
                      <Link2 size={15} /> YouTube
                    </a>
                  )}
                </div>
              )}
              {isOwnProfile && (
                <button onClick={() => setEditing(true)} className="mt-2 text-sm font-medium text-[var(--brand-primary)] underline">
                  Edit profile
                </button>
              )}
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="scrollbar-none mb-8 flex gap-1 overflow-x-auto border-b" style={{ borderColor: "var(--border-subtle)" }}>
          {TABS.map((tab) => (
            <button
              key={tab.type}
              onClick={() => setActiveTab(tab.type)}
              className="whitespace-nowrap px-4 py-3 text-sm font-semibold transition"
              style={{
                color: activeTab === tab.type ? "var(--brand-primary)" : "var(--brand-text-muted)",
                borderBottom: activeTab === tab.type ? "2px solid var(--brand-primary)" : "2px solid transparent",
                marginBottom: "-1px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content grid */}
        {activeTab === "about" ? (
          <div className="max-w-2xl pb-16 text-sm leading-relaxed text-[var(--brand-text-muted)]">{profile.profile.bio || `${name} hasn't added an About section yet.`}</div>
        ) : contentLoading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 pb-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[280/220] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--surface-card)" }} />
            ))}
          </div>
        ) : content.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border py-16 text-center" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
            <div className="grid h-12 w-12 place-items-center rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 10%, transparent)" }}>
              <Play size={20} color="var(--brand-primary)" />
            </div>
            <p className="text-sm font-medium text-[var(--brand-text)]">Nothing here yet</p>
            <p className="max-w-xs text-sm text-[var(--brand-text-muted)]">{isOwnProfile ? "Upload your first post to see it show up here." : `${name} hasn't published anything in this category yet.`}</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 pb-16">
            {content.map((post) => {
              const isVideoLike = post.contentType === "video" || post.contentType === "short";
              const card = (
                <div className="card-hover cursor-pointer overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
                  <div className="relative h-[175px] bg-[var(--brand-bg-start)]">
                    {post.thumbnailUrl ? (
                      <img src={post.thumbnailUrl} alt={post.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center">
                        {post.contentType === "article" ? <FileText size={28} className="text-[var(--brand-text-muted)]" /> : <ImageIcon size={28} className="text-[var(--brand-text-muted)]" />}
                      </div>
                    )}
                    {isVideoLike && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-black/50">
                          <Play size={20} color="#fff" fill="#fff" />
                        </div>
                      </div>
                    )}
                    {post.contentType === "short" && (
                      <span className="absolute left-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white" style={{ backgroundColor: "var(--brand-primary)" }}>
                        Short
                      </span>
                    )}
                    {post.contentType === "article" && (
                      <span className="absolute left-2.5 top-2.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ borderColor: "var(--border-medium)", backgroundColor: "var(--brand-bg-end)", color: "var(--brand-text-muted)" }}>
                        Article
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2.5 line-clamp-2 text-[15px] font-bold leading-snug text-[var(--brand-text)]">{post.title || "Untitled"}</h3>
                    <div className="flex items-center justify-between text-xs text-[var(--brand-text-muted)]">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <div className="flex gap-3">
                        <span className="flex items-center gap-1">
                          <Eye size={12} /> {formatCount(post.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={12} /> {formatCount(post.likesCount)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={12} /> {formatCount(post.commentsCount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );

              if (isVideoLike) {
                return (
                  <Link key={post.id} href={`/videos/${post.id}`}>
                    {card}
                  </Link>
                );
              }
              if (post.contentType === "image") {
                return (
                  <Link key={post.id} href={`/images/${post.id}`}>
                    {card}
                  </Link>
                );
              }
              return <div key={post.id}>{card}</div>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
