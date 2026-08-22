import { api } from "./client";
import type { ApiEnvelope, PlanItem } from "@/types";

export async function fetchPlans() {
  const { data } = await api.get<ApiEnvelope<PlanItem[]>>("/plans");
  return data.data;
}

export async function fetchPlan(slug: string) {
  const { data } = await api.get<ApiEnvelope<PlanItem>>(`/plans/${slug}`);
  return data.data;
}

/** Admin-only: includes deactivated plans too (requires MANAGE_SUBSCRIPTION_PLANS). */
export async function fetchAllPlans() {
  const { data } = await api.get<ApiEnvelope<PlanItem[]>>("/plans", { params: { all: "true" } });
  return data.data;
}

export type PlanPayload = {
  name: string;
  slug: string;
  monthly: number;
  yearly: number;
  description?: string;
  features: { text: string; included: boolean }[];
  cta?: string;
  highlight?: boolean;
  badge?: string;
  order?: number;
};

export async function createPlan(payload: PlanPayload) {
  const { data } = await api.post<ApiEnvelope<PlanItem>>("/plans", payload);
  return data.data;
}

export async function updatePlan(id: string, payload: Partial<PlanPayload> & { isActive?: boolean }) {
  const { data } = await api.patch<ApiEnvelope<PlanItem>>(`/plans/id/${id}`, payload);
  return data.data;
}

/** Soft-delete (sets isActive: false) - use updatePlan(id, { isActive: true }) to bring one back. */
export async function deletePlan(id: string) {
  await api.delete(`/plans/id/${id}`);
}
