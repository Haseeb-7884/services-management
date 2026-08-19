import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Video as VideoIcon } from "lucide-react";
import { fetchVideos } from "../api/videos";
import { VideoCard } from "../components/VideoCard";
import { TOPIC_CATEGORIES } from "../constants/categories";
import { useSeo } from "../hooks/useSeo";
import type { VideoItem } from "../types";

export function VideoFeed() {
  const [urlParams] = useSearchParams();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [search, setSearch] = useState(urlParams.get("search") ?? "");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useSeo({ title: "Videos", description: "Long-form videos and shorts from every channel." });

  useEffect(() => {
    setLoading(true);
    fetchVideos({
      search: search || undefined,
      category: category === "All" ? undefined : category.toLowerCase(),
      page: 1,
    })
      .then((res) => setVideos(res.items))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">Videos</h1>
        <p className="text-sm text-[var(--brand-text-muted)]">Long-form videos and shorts from every channel.</p>
      </div>

      <div className="relative mb-5 max-w-md">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--brand-text-muted)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search videos…"
          className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--border-highlight)]"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", color: "var(--brand-text)" }}
        />
      </div>

      <div className="scrollbar-none mb-7 flex gap-2 overflow-x-auto pb-1">
        {TOPIC_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition"
            style={
              category === cat
                ? { backgroundColor: "var(--brand-primary)", borderColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }
                : { borderColor: "var(--border-subtle)", color: "var(--brand-text-muted)", backgroundColor: "var(--surface-card)" }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-video animate-pulse rounded-xl" style={{ backgroundColor: "var(--surface-card)" }} />
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((v) => (
            <VideoCard key={v._id} video={v} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border py-16 text-center" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
          <div className="grid h-12 w-12 place-items-center rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 10%, transparent)" }}>
            <VideoIcon size={20} color="var(--brand-primary)" />
          </div>
          <p className="text-sm font-medium text-[var(--brand-text)]">No videos found</p>
          <p className="max-w-xs text-sm text-[var(--brand-text-muted)]">Try a different search term or category, or check back once creators start publishing.</p>
        </div>
      )}
    </div>
  );
}
