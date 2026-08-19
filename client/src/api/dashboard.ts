import { api } from "./client";
import type { ApiEnvelope, DashboardContentItem, DashboardStatsResponse } from "../types";

export async function fetchDashboardStats() {
  const { data } = await api.get<ApiEnvelope<DashboardStatsResponse>>("/dashboard/stats");
  return data.data;
}

export async function fetchMyContent() {
  const { data } = await api.get<ApiEnvelope<DashboardContentItem[]>>("/dashboard/content");
  return data.data;
}
