import { api } from "./client";
import type { ApiEnvelope, Branding } from "../types";

export async function fetchBranding() {
  const { data } = await api.get<ApiEnvelope<Branding>>("/config/branding");
  return data.data;
}

export async function updateBranding(payload: Partial<Branding>) {
  const { data } = await api.patch<ApiEnvelope<Branding>>("/config/branding", payload);
  return data.data;
}

export async function uploadLogo(file: File) {
  const form = new FormData();
  form.append("logo", file);
  const { data } = await api.post<ApiEnvelope<Branding>>("/config/branding/logo", form);
  return data.data;
}

export async function uploadFavicon(file: File) {
  const form = new FormData();
  form.append("favicon", file);
  const { data } = await api.post<ApiEnvelope<Branding>>("/config/branding/favicon", form);
  return data.data;
}
