"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, Clock, Eye, FileText, Heart, Layers, MessageSquare, Play, ShieldCheck } from "lucide-react";
import { useBranding } from "@/context/BrandingContext";
import { fetchFeaturedCreators, fetchFeed, fetchPlatformStats, fetchTrending } from "@/api/feed";
import { FollowButton } from "@/components/FollowButton";
import { formatCount, formatDuration, formatRelativeTime } from "@/utils/format";
import { CONTENT_TYPE_FILTERS } from "@/constants/categories";
import type { FeaturedCreator, FeedItem, PlatformStats } from "@/types";

// Home doesn't call useSeo() itself - as the site root, it's meant to show
// the Owner's branding-level SEO defaults (BrandingContext sets those on
// every load), not page-specific overrides.

const WHY_JOIN = [
  { icon: Layers, title: "Built for every format", description: "Videos, shorts, articles, images and live streams all live in one channel - no juggling five different platforms." },
  { icon: BarChart3, title: "Grow with real insight", description: "Audience analytics and content performance that actually explain what's working, not just vanity numbers." },
  { icon: ShieldCheck, title: "Own your audience", description: "Followers, memberships and messages stay tied to your channel - not locked behind an opaque algorithm." },
];

const STAT_LABELS: { key: keyof PlatformStats; label: string }[] = [
  { key: "totalUsers", label: "Registered users" },
  { key: "activeCreators", label: "Active creators" },
  { key: "contentPublished", label: "Content published" },
  { key: "totalViews", label: "Total views" },
];

const FILTER_TO_TYPE: Record<string, "all" | "video" | "short" | "image" | "article"> = {
  All: "all",
  Videos: "video",
  Articles: "article",
  Images: "image",
  Shorts: "short",
};

function TypeBadge({ type }: { type: FeedItem["type"] }) {
  if (type !== "article") return null;
  return (
    <span className="absolute left-2.5 top-2.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ borderColor: "var(--border-medium)", backgroundColor: "var(--brand-bg-end)", color: "var(--brand-text-muted)" }}>
      Article
    </span>
  );
}

function PlayOverlay({ size = 44 }: { size?: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="grid place-items-center rounded-full bg-black/45 backdrop-blur-sm" style={{ width: size, height: size }}>
        <Play size={size * 0.42} color="#fff" fill="#fff" />
      </div>
    </div>
  );
}

function feedItemHref(item: FeedItem) {
  if (item.type === "video" || item.type === "short") return `/videos/${item.id}`;
  if (item.type === "image") return `/images/${item.id}`;
  return `/articles/${item.id}`;
}

export default function Home() {
  const { branding } = useBranding();
  const [activeCategory, setActiveCategory] = useState("All");

  const [trending, setTrending] = useState<FeedItem[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [creators, setCreators] = useState<FeaturedCreator[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);

  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [feedPage, setFeedPage] = useState(1);
  const [feedPages, setFeedPages] = useState(1);
  const [feedLoading, setFeedLoading] = useState(true);

  useEffect(() => {
    fetchTrending(10).then(setTrending).finally(() => setTrendingLoading(false));
    fetchFeaturedCreators(8).then(setCreators).catch(() => setCreators([]));
    fetchPlatformStats().then(setStats).catch(() => setStats(null));
  }, []);

  useEffect(() => {
    setFeedLoading(true);
    setFeedPage(1);
    fetchFeed({ type: FILTER_TO_TYPE[activeCategory], page: 1, limit: 12 })
      .then((res) => {
        setFeed(res.items);
        setFeedPages(res.pages);
      })
      .finally(() => setFeedLoading(false));
  }, [activeCategory]);

  const loadMoreFeed = () => {
    const nextPage = feedPage + 1;
    fetchFeed({ type: FILTER_TO_TYPE[activeCategory], page: nextPage, limit: 12 }).then((res) => {
      setFeed((prev) => [...prev, ...res.items]);
      setFeedPage(nextPage);
    });
  };

  const hero = trending[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {hero ? (
        <Link href={feedItemHref(hero)} className="relative mb-10 flex h-[420px] overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-lg)" }}>
          {hero.thumbnailUrl ? (
            <Image src={hero.thumbnailUrl} alt={hero.title} fill priority sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" />
          ) : (
            <div className="h-full w-full" style={{ background: "linear-gradient(135deg, var(--brand-text), color-mix(in srgb, var(--brand-text) 70%, var(--brand-primary) 30%))" }} />
          )}
          <div className="absolute inset-0" style={{ background: "var(--scrim-diagonal)" }} />
          <div className="absolute bottom-0 left-0 max-w-xl p-8 sm:p-10">
            <span className="mb-4 inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 55%, transparent)" }}>
              Trending {hero.type === "short" ? "Short" : hero.type}
            </span>
            <h1 className="font-display mb-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">{hero.title}</h1>
            {hero.excerpt && <p className="mb-6 text-sm leading-relaxed text-white/85 sm:text-base line-clamp-2">{hero.excerpt}</p>}
            <div className="btn-glow inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold" style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}>
              {hero.type === "article" ? <><FileText size={16} /> Read now</> : <><Play size={16} fill="#fff" /> Watch now</>}
            </div>
          </div>
        </Link>
      ) : (
        !trendingLoading && (
          <div className="relative mb-10 flex h-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl border p-8 text-center" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
            <h1 className="font-display mb-3 text-2xl font-extrabold tracking-tight text-[var(--brand-text)] sm:text-3xl">Welcome to {branding.siteName}</h1>
            <p className="mb-6 max-w-md text-sm text-[var(--brand-text-muted)]">Nothing has been published yet - be the first to upload a video, image or article.</p>
            <Link href="/upload" className="btn-glow rounded-lg px-5 py-2.5 text-sm font-bold" style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}>
              Publish something
            </Link>
          </div>
        )
      )}

      <div className="scrollbar-none mb-10 flex gap-2 overflow-x-auto pb-1">
        {CONTENT_TYPE_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition"
            style={activeCategory === cat ? { backgroundColor: "var(--brand-primary)", borderColor: "var(--brand-primary)", color: "var(--brand-bg-start)" } : { borderColor: "var(--border-subtle)", color: "var(--brand-text-muted)", backgroundColor: "var(--surface-card)" }}
          >
            {cat}
          </button>
        ))}
      </div>

      {(trendingLoading || trending.length > 0) && (
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--brand-text)]">Trending Now</h2>
            <Link href="/videos" className="text-sm font-semibold text-[var(--brand-primary)]">See all →</Link>
          </div>
          <div className="scrollbar-none flex gap-4 overflow-x-auto pb-2">
            {trendingLoading
              ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-[195px] w-[220px] shrink-0 animate-pulse rounded-2xl" style={{ backgroundColor: "var(--surface-card)" }} />)
              : trending.map((item) => (
                  <Link key={item.id} href={feedItemHref(item)} className="card-hover w-[220px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
                    <div className="relative h-[130px] bg-[var(--brand-bg-start)]">
                      {item.thumbnailUrl ? <Image src={item.thumbnailUrl} alt={item.title} fill sizes="220px" className="object-cover" /> : <div className="grid h-full w-full place-items-center"><FileText size={22} className="text-[var(--brand-text-muted)]" /></div>}
                      {(item.type === "video" || item.type === "short") && (
                        <>
                          <PlayOverlay size={36} />
                          {Boolean(item.durationSec) && <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold text-white">{formatDuration(item.durationSec)}</span>}
                        </>
                      )}
                      <TypeBadge type={item.type} />
                    </div>
                    <div className="p-3.5">
                      <p className="mb-2 line-clamp-2 text-[13px] font-semibold text-[var(--brand-text)]">{item.title}</p>
                      <div className="flex items-center justify-between text-xs text-[var(--brand-text-muted)]">
                        <span>{item.owner.profile?.displayName || item.owner.username}</span>
                        <span className="flex items-center gap-1"><Eye size={11} /> {formatCount(item.views)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </section>
      )}

      {creators.length > 0 && (
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--brand-text)]">Featured Creators</h2>
          </div>
          <div className="scrollbar-none flex gap-5 overflow-x-auto pb-2">
            {creators.map((c) => (
              <div key={c._id} className="flex w-[140px] shrink-0 flex-col items-center gap-2.5 text-center">
                <Link href={`/u/${c.username}`} className="h-20 w-20 overflow-hidden rounded-full border-2" style={{ borderColor: "var(--border-medium)" }}>
                  {c.profile.avatarUrl ? (
                    <Image src={c.profile.avatarUrl} alt={c.profile.displayName || c.username} width={80} height={80} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-xl font-bold text-white" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))" }}>
                      {(c.profile.displayName || c.username).charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
                <div>
                  <Link href={`/u/${c.username}`} className="mb-0.5 block text-[13px] font-semibold text-[var(--brand-text)]">{c.profile.displayName || c.username}</Link>
                  <p className="mb-2 text-[11px] text-[var(--brand-text-muted)]">{formatCount(c.followersCount)} followers</p>
                  <FollowButton username={c.username} initiallyFollowed={false} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {stats && (
        <div className="mb-10 grid grid-cols-2 gap-4 rounded-2xl border p-6 sm:grid-cols-4" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
          {STAT_LABELS.map((s) => (
            <div key={s.key} className="text-center sm:text-left">
              <p className="text-2xl font-extrabold tracking-tight text-[var(--brand-text)] sm:text-[26px]">{formatCount(stats[s.key])}</p>
              <p className="text-xs text-[var(--brand-text-muted)] sm:text-[13px]">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <section>
        <h2 className="mb-5 text-xl font-bold text-[var(--brand-text)]">For You</h2>
        {feedLoading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[330px] animate-pulse rounded-2xl" style={{ backgroundColor: "var(--surface-card)" }} />)}
          </div>
        ) : feed.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border py-16 text-center" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
            <p className="text-sm font-medium text-[var(--brand-text)]">Nothing here yet</p>
            <p className="max-w-xs text-sm text-[var(--brand-text-muted)]">{activeCategory === "All" ? "No content has been published yet." : `No ${activeCategory.toLowerCase()} published yet.`}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
              {feed.map((item) => (
                <Link key={item.id} href={feedItemHref(item)} className="card-hover cursor-pointer overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
                  <div className="relative h-[190px] bg-[var(--brand-bg-start)]">
                    {item.thumbnailUrl ? <Image src={item.thumbnailUrl} alt={item.title} fill sizes="(max-width: 768px) 50vw, 280px" className="object-cover" /> : <div className="grid h-full w-full place-items-center"><FileText size={26} className="text-[var(--brand-text-muted)]" /></div>}
                    {(item.type === "video" || item.type === "short") && (
                      <>
                        <PlayOverlay />
                        {Boolean(item.durationSec) && <span className="absolute bottom-2.5 right-2.5 rounded bg-black/80 px-2 py-0.5 text-xs font-semibold text-white">{formatDuration(item.durationSec)}</span>}
                      </>
                    )}
                    <TypeBadge type={item.type} />
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 text-[15px] font-bold leading-snug text-[var(--brand-text)]">{item.title}</h3>
                    {item.excerpt && <p className="mb-3 line-clamp-2 text-[13px] leading-relaxed text-[var(--brand-text-muted)]">{item.excerpt}</p>}
                    <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
                      <span className="flex items-center gap-2">
                        {item.owner.profile?.avatarUrl ? (
                          <Image src={item.owner.profile.avatarUrl} alt="" width={28} height={28} className="h-7 w-7 rounded-full border object-cover" style={{ borderColor: "var(--border-medium)" }} />
                        ) : (
                          <span className="grid h-7 w-7 place-items-center rounded-full border text-xs font-bold" style={{ borderColor: "var(--border-medium)", color: "var(--brand-primary)" }}>
                            {(item.owner.profile?.displayName || item.owner.username).charAt(0).toUpperCase()}
                          </span>
                        )}
                        <span>
                          <span className="block text-xs font-semibold text-[var(--brand-text)]">{item.owner.profile?.displayName || item.owner.username}</span>
                          <span className="flex items-center gap-1 text-[11px] text-[var(--brand-text-muted)]"><Clock size={10} /> {formatRelativeTime(item.createdAt)}</span>
                        </span>
                      </span>
                      <div className="flex gap-3 text-xs text-[var(--brand-text-muted)]">
                        <span className="flex items-center gap-1"><Heart size={13} /> {formatCount(item.likesCount)}</span>
                        <span className="flex items-center gap-1"><MessageSquare size={13} /> {formatCount(item.commentsCount)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {feedPage < feedPages && (
              <div className="mt-8 text-center">
                <button onClick={loadMoreFeed} className="rounded-lg border px-6 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface-card-hover)]" style={{ borderColor: "var(--border-subtle)" }}>
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="mt-16">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">Why creators choose {branding.siteName}</h2>
          <p className="mx-auto max-w-lg text-sm text-[var(--brand-text-muted)]">Everything you need to publish, grow and connect with your audience - in one place.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {WHY_JOIN.map((item) => (
            <div key={item.title} className="rounded-2xl border p-6" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-sm)" }}>
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 12%, transparent)" }}>
                <item.icon size={20} color="var(--brand-primary)" />
              </div>
              <h3 className="mb-2 text-[15px] font-bold text-[var(--brand-text)]">{item.title}</h3>
              <p className="text-[13px] leading-relaxed text-[var(--brand-text-muted)]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mt-16 overflow-hidden rounded-3xl p-10 text-center sm:p-14" style={{ background: "linear-gradient(160deg, var(--brand-text), color-mix(in srgb, var(--brand-text) 80%, black))" }}>
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: "var(--brand-primary)" }} />
        <h2 className="font-display relative mb-3 text-2xl font-extrabold text-white sm:text-3xl">Ready to grow your audience?</h2>
        <p className="relative mx-auto mb-7 max-w-md text-sm text-white/70 sm:text-base">Join {branding.siteName} today and start publishing to a home built for creators, not algorithms.</p>
        <div className="relative flex flex-wrap items-center justify-center gap-3">
          <Link href="/register" className="btn-glow flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold" style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}>
            Get started free <ArrowRight size={16} />
          </Link>
          <Link href="/pricing" className="rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm">View plans</Link>
        </div>
      </section>
    </div>
  );
}
