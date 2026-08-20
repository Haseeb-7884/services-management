import { api } from "./client";
import { uploadToCloudinary } from "./uploads";
import type { ApiEnvelope, Branding } from "@/types";

export async function fetchBranding() {
  const { data } = await api.get<ApiEnvelope<Branding>>("/config/branding");
  return data.data;
}

export async function updateBranding(payload: Partial<Branding>) {
  const { data } = await api.patch<ApiEnvelope<Branding>>("/config/branding", payload);
  return data.data;
}

export async function uploadLogo(file: File) {
  const { url } = await uploadToCloudinary(file, "avatars");
  const { data } = await api.post<ApiEnvelope<Branding>>("/config/branding/logo", { url });
  return data.data;
}

export async function uploadFavicon(file: File) {
  const { url } = await uploadToCloudinary(file, "avatars");
  const { data } = await api.post<ApiEnvelope<Branding>>("/config/branding/favicon", { url });
  return data.data;
}
