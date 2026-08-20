import { api } from "./client";
import { uploadToCloudinary } from "./uploads";
import type { ApiEnvelope, ImageItem, Paginated } from "@/types";

export async function fetchImages(params: { category?: string; tag?: string; search?: string; page?: number }) {
  const { data } = await api.get<ApiEnvelope<Paginated<ImageItem>>>("/images", { params });
  return data.data;
}

export async function fetchImage(id: string) {
  const { data } = await api.get<ApiEnvelope<ImageItem>>(`/images/${id}`);
  return data.data;
}

export async function uploadImage(payload: {
  file: File;
  caption?: string;
  category?: string;
  tags?: string;
  onProgress?: (pct: number) => void;
}) {
  const { url } = await uploadToCloudinary(payload.file, "images", payload.onProgress);
  const { data } = await api.post<ApiEnvelope<ImageItem>>("/images", {
    caption: payload.caption,
    category: payload.category,
    tags: payload.tags,
    url,
  });
  return data.data;
}

export async function deleteImage(id: string) {
  await api.delete(`/images/${id}`);
}
