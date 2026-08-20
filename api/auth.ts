import { api } from "./client";
import type { ApiEnvelope, User } from "@/types";

export async function registerRequest(payload: {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}) {
  const { data } = await api.post<ApiEnvelope<{ user: User; accessToken: string }>>("/auth/register", payload);
  return data.data;
}

export async function loginRequest(payload: { emailOrUsername: string; password: string }) {
  const { data } = await api.post<ApiEnvelope<{ user: User; accessToken: string }>>("/auth/login", payload);
  return data.data;
}

export async function logoutRequest() {
  await api.post("/auth/logout");
}

export async function fetchMe() {
  const { data } = await api.get<ApiEnvelope<User>>("/auth/me");
  return data.data;
}
