import { api } from "./client";
import type { ApiEnvelope, Paginated, VideoItem } from "../types";

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
}) {
  const form = new FormData();
  form.append("video", payload.file);
  form.append("title", payload.title);
  if (payload.description) form.append("description", payload.description);
  if (payload.category) form.append("category", payload.category);
  if (payload.tags) form.append("tags", payload.tags);
  form.append("isShort", String(Boolean(payload.isShort)));

  const { data } = await api.post<ApiEnvelope<VideoItem>>("/videos", form);
  return data.data;
}

export async function deleteVideo(id: string) {
  await api.delete(`/videos/${id}`);
}
