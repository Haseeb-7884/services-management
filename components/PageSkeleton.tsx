// Shared loading UI used by every route's loading.tsx. Every page in this
// app is a "use client" component that fetches its data in a useEffect
// after mount (see api/feed.ts, api/videos.ts, etc.) - without a Suspense
// fallback, Next.js just shows a blank white screen for the entire
// navigation-to-first-paint window, which reads as the whole site
// "lagging" even when the actual fetch is fast. Dropping a loading.tsx next
// to each route's page.tsx makes Next.js render this instantly on
// navigation while the new route's JS + data load in the background - pure
// perceived-performance, no behavior change.
function Block({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl ${className}`} style={{ backgroundColor: "var(--surface-card-hover)" }} />;
}

export function PageSkeleton({ variant = "grid" }: { variant?: "grid" | "list" | "spinner" | "detail" }) {
  if (variant === "spinner") {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--brand-primary)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="mx-auto max-w-5xl space-y-3 px-4 py-8">
        <Block className="mb-4 h-8 w-56" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Block key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Block className="mb-5 aspect-video w-full" />
        <Block className="mb-3 h-7 w-2/3" />
        <Block className="mb-2 h-4 w-1/3" />
        <Block className="h-24 w-full" />
      </div>
    );
  }

  // grid (default) - matches the video/image/article/feed card layouts
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Block className="mb-6 h-8 w-48" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <Block className="mb-2.5 h-[150px] w-full" />
            <Block className="mb-1.5 h-4 w-4/5" />
            <Block className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
