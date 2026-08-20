import { api } from "./client";
import { uploadToCloudinary } from "./uploads";
import type { ApiEnvelope, Paginated, VideoItem } from "@/types";

export async function fetchVideos(params: {
  category?: string;
  tag?: string;
  search?: string;
  isShort?: boolean;
  page?: number;
}) {
  const { data } = await api.get<ApiEnvelope<Paginated<VideoItem>>>("/videos", { params });
  return data.data;
}

export async function fetchVideo(id: string) {
  const { data } = await api.get<ApiEnvelope<VideoItem>>(`/videos/${id}`);
  return data.data;
}

export async function uploadVideo(payload: {
  file: File;
  title: string;
  description?: string;
  category?: string;
  tags?: string;
  isShort?: boolean;
  onProgress?: (pct: number) => void;
}) {
  const { url } = await uploadToCloudinary(payload.file, "videos", payload.onProgress);
  const { data } = await api.post<ApiEnvelope<VideoItem>>("/videos", {
    title: payload.title,
    description: payload.description,
    category: payload.category,
    tags: payload.tags,
    isShort: Boolean(payload.isShort),
    url,
  });
  return data.data;
}

export async function deleteVideo(id: string) {
  await api.delete(`/videos/${id}`);
}
