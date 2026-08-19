import { api } from "./client";
import type { ApiEnvelope, PlanItem } from "../types";

export async function fetchPlans() {
  const { data } = await api.get<ApiEnvelope<PlanItem[]>>("/plans");
  return data.data;
}

export async function fetchPlan(slug: string) {
  const { data } = await api.get<ApiEnvelope<PlanItem>>(`/plans/${slug}`);
  return data.data;
}
