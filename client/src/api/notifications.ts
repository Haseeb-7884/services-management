import { api } from "./client";
import type { ApiEnvelope, NotificationItem, Paginated } from "../types";

type NotificationsResponse = Paginated<NotificationItem> & { unreadCount: number };

export async function fetchMyNotifications(page = 1, limit = 20) {
  const { data } = await api.get<ApiEnvelope<NotificationsResponse>>("/notifications", {
    params: { page, limit },
  });
  return data.data;
}

export async function markNotificationRead(id: string) {
  const { data } = await api.patch<ApiEnvelope<NotificationItem>>(`/notifications/${id}/read`);
  return data.data;
}

export async function markAllNotificationsRead() {
  await api.patch("/notifications/read-all");
}
