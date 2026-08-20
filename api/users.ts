import { api } from "./client";
import { uploadToCloudinary } from "./uploads";
import type { ApiEnvelope, ChannelContentItem, FollowerItem, Paginated, User } from "@/types";

export async function fetchProfile(username: string) {
  const { data } = await api.get<ApiEnvelope<User>>(`/users/${username}`);
  return data.data;
}

export async function fetchFollowers(username: string, limit = 100) {
  const { data } = await api.get<ApiEnvelope<FollowerItem[]>>(`/users/${username}/followers`, { params: { limit } });
  return data.data;
}

export async function fetchChannelContent(
  username: string,
  type: "all" | "video" | "short" | "image" | "article" = "all",
  page = 1,
  limit = 24
) {
  const { data } = await api.get<ApiEnvelope<Paginated<ChannelContentItem>>>(`/users/${username}/content`, {
    params: { type, page, limit },
  });
  return data.data;
}

export interface UpdateProfilePayload {
  displayName?: string;
  bio?: string;
  tagline?: string;
  category?: string;
  socialLinks?: { website?: string; twitter?: string; instagram?: string; youtube?: string };
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const { data } = await api.patch<ApiEnvelope<User>>("/users/me", payload);
  return data.data;
}

// Uploads directly to Cloudinary first (see api/uploads.ts), then sends just
// the resulting url - not a multipart file - since Vercel serverless
// functions can't handle large request bodies the old multer flow relied on.
export async function uploadAvatar(file: File) {
  const { url } = await uploadToCloudinary(file, "avatars");
  const { data } = await api.post<ApiEnvelope<User>>("/users/me/avatar", { url });
  return data.data;
}

export async function uploadCover(file: File) {
  const { url } = await uploadToCloudinary(file, "covers");
  const { data } = await api.post<ApiEnvelope<User>>("/users/me/cover", { url });
  return data.data;
}

export async function followUser(username: string) {
  await api.post(`/users/${username}/follow`);
}

export async function unfollowUser(username: string) {
  await api.delete(`/users/${username}/follow`);
}
