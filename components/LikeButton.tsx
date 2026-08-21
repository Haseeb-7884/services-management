"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toggleLike } from "@/api/social";
import { useAuth } from "@/context/AuthContext";

export function LikeButton({
  targetType,
  targetId,
  initialCount,
}: {
  targetType: "Video" | "Image" | "Article";
  targetId: string;
  initialCount: number;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [pop, setPop] = useState(false);

  const handleClick = async () => {
    if (!user) return router.push("/login");
    const result = await toggleLike(targetType, targetId);
    setLiked(result.liked);
    setCount((c) => c + (result.liked ? 1 : -1));
    if (result.liked) {
      // Little heart-pop bounce on like, like every social app does - the
      // most direct, cheap way to make a single tap feel acknowledged.
      setPop(true);
      setTimeout(() => setPop(false), 300);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group flex items-center gap-1.5 text-sm text-[var(--brand-text-muted)] transition-colors hover:text-[var(--brand-text)]"
    >
      <Heart
        size={18}
        fill={liked ? "var(--brand-primary)" : "none"}
        color={liked ? "var(--brand-primary)" : "currentColor"}
        className={`transition-transform duration-150 group-hover:scale-110 ${pop ? "scale-125" : "scale-100"}`}
      />
      {count}
    </button>
  );
}
