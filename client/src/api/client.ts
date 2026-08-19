import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // sends the httpOnly refresh cookie
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const { data } = await axios.post(
      `${API_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const token = data?.data?.accessToken as string | undefined;
    if (token) useAuthStore.getState().setAccessToken(token);
    return token ?? null;
  } catch {
    useAuthStore.getState().clearAuth();
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      refreshPromise ??= refreshAccessToken();
      const token = await refreshPromise;
      refreshPromise = null;
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Turns any axios error into a message that actually tells you what
 * happened, instead of every failure collapsing into the same generic
 * string. Also logs the raw error so it's visible in the browser console
 * for debugging (status code, response body, or "no response at all").
 */
export function getErrorMessage(err: unknown, fallback: string): string {
  // eslint-disable-next-line no-console
  console.error("[api error]", err);

  if (!err || typeof err !== "object") return fallback;
  const anyErr = err as any;

  if (anyErr.response) {
    // Server responded with an error status.
    return (
      anyErr.response.data?.message ??
      `Server error (${anyErr.response.status}). Check the server terminal for details.`
    );
  }
  if (anyErr.request) {
    // Request was sent but no response came back - server down, wrong
    // VITE_API_URL, or CORS blocked the response before it reached axios.
    return `Can't reach the API at ${API_URL}. Is the server running, and does VITE_API_URL match it?`;
  }
  return anyErr.message ?? fallback;
}
