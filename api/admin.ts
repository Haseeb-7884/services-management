import { api } from "./client";
import type { AdminStats, AdminUserRow, ApiEnvelope, Paginated, PendingContentItem, User } from "@/types";

export async function fetchAdminStats() {
  const { data } = await api.get<ApiEnvelope<AdminStats>>("/admin/stats");
  return data.data;
}

export async function fetchUsers(params: { role?: string; search?: string; page?: number; limit?: number }) {
  const { data } = await api.get<ApiEnvelope<Paginated<AdminUserRow>>>("/admin/users", { params });
  return data.data;
}

export async function promoteToAdmin(username: string) {
  const { data } = await api.post<ApiEnvelope<User>>(`/admin/users/${username}/admin`);
  return data.data;
}

export async function revokeAdmin(username: string) {
  const { data } = await api.delete<ApiEnvelope<User>>(`/admin/users/${username}/admin`);
  return data.data;
}

export async function grantCreator(username: string) {
  const { data } = await api.post<ApiEnvelope<User>>(`/admin/users/${username}/creator`);
  return data.data;
}

export async function revokeCreator(username: string) {
  const { data } = await api.delete<ApiEnvelope<User>>(`/admin/users/${username}/creator`);
  return data.data;
}

export async function fetchPendingContent(params: { type?: string; page?: number; limit?: number } = {}) {
  const { data } = await api.get<ApiEnvelope<Paginated<PendingContentItem>>>("/admin/content/pending", { params });
  return data.data;
}

export async function approveContent(type: string, id: string) {
  await api.post(`/admin/content/${type}/${id}/approve`);
}

export async function rejectContent(type: string, id: string, reason?: string) {
  await api.post(`/admin/content/${type}/${id}/reject`, { reason });
}
