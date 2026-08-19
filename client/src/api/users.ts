import { api } from "./client";
import type { ApiEnvelope, ChannelContentItem, FollowerItem, Paginated, User } from "../types";

export async function fetchProfile(username: string) {
  const { data } = await api.get<ApiEnvelope<User>>(`/users/${username}`);
  return data.data;
}

export async function fetchFollowers(username: string, limit = 100) {
  const { data } = await api.get<ApiEnvelope<FollowerItem[]>>(`/users/${username}/followers`, {
    params: { limit },
  });
  return data.data;
}

export async function fetchChannelContent(
  username: string,
  type: "all" | "video" | "short" | "image" | "article" = "all",
  page = 1,
  limit = 24
) {
  const { data } = await api.get<ApiEnvelope<Paginated<ChannelContentItem>>>(
    `/users/${username}/content`,
    { params: { type, page, limit } }
  );
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

export async function uploadAvatar(file: File) {
  const form = new FormData();
  form.append("avatar", file);
  const { data } = await api.post<ApiEnvelope<User>>("/users/me/avatar", form);
  return data.data;
}

export async function uploadCover(file: File) {
  const form = new FormData();
  form.append("cover", file);
  const { data } = await api.post<ApiEnvelope<User>>("/users/me/cover", form);
  return data.data;
}

export async function followUser(username: string) {
  await api.post(`/users/${username}/follow`);
}

export async function unfollowUser(username: string) {
  await api.delete(`/users/${username}/follow`);
}
