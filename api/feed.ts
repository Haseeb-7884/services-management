import { api } from "./client";
import type { ApiEnvelope, FeaturedCreator, FeedItem, Paginated, PlatformStats } from "@/types";

export async function fetchFeed(params: {
  type?: "all" | "video" | "short" | "image" | "article";
  category?: string;
  page?: number;
  limit?: number;
}) {
  const { data } = await api.get<ApiEnvelope<Paginated<FeedItem>>>("/feed", { params });
  return data.data;
}

export async function fetchTrending(limit = 10) {
  const { data } = await api.get<ApiEnvelope<FeedItem[]>>("/feed/trending", { params: { limit } });
  return data.data;
}

export async function fetchFeaturedCreators(limit = 8) {
  const { data } = await api.get<ApiEnvelope<FeaturedCreator[]>>("/feed/creators", { params: { limit } });
  return data.data;
}

export async function fetchPlatformStats() {
  const { data } = await api.get<ApiEnvelope<PlatformStats>>("/feed/stats");
  return data.data;
}
