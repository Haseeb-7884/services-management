import { api } from "./client";
import type { ApiEnvelope, ImageItem, Paginated } from "../types";

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
}) {
  const form = new FormData();
  form.append("image", payload.file);
  if (payload.caption) form.append("caption", payload.caption);
  if (payload.category) form.append("category", payload.category);
  if (payload.tags) form.append("tags", payload.tags);

  const { data } = await api.post<ApiEnvelope<ImageItem>>("/images", form);
  return data.data;
}

export async function deleteImage(id: string) {
  await api.delete(`/images/${id}`);
}
