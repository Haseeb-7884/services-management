"use client";

import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { fetchImages } from "@/api/images";
import { ImageCard } from "@/components/ImageCard";
import { TOPIC_CATEGORIES } from "@/constants/categories";
import { useSeo } from "@/hooks/useSeo";
import type { ImageItem } from "@/types";

export default function ImageGallery() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useSeo({ title: "Images", description: "Photo posts and galleries from creators." });

  useEffect(() => {
    setLoading(true);
    fetchImages({ category: category === "All" ? undefined : category.toLowerCase(), page: 1 })
      .then((res) => setImages(res.items))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-extrabold tracking-tight text-[var(--brand-text)]">Images</h1>
        <p className="text-sm text-[var(--brand-text-muted)]">Photo posts and galleries from creators you follow.</p>
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl" style={{ backgroundColor: "var(--surface-card)" }} />
          ))}
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <ImageCard key={img._id} image={img} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border py-16 text-center" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)" }}>
          <div className="grid h-12 w-12 place-items-center rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 10%, transparent)" }}>
            <ImageIcon size={20} color="var(--brand-primary)" />
          </div>
          <p className="text-sm font-medium text-[var(--brand-text)]">No images found</p>
          <p className="max-w-xs text-sm text-[var(--brand-text-muted)]">Try a different category, or check back once creators start publishing.</p>
        </div>
      )}
    </div>
  );
}
