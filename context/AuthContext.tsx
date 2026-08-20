"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import { fetchMe, loginRequest, logoutRequest, registerRequest } from "@/api/auth";
import { updateProfile as updateProfileRequest, type UpdateProfilePayload } from "@/api/users";
import { api } from "@/api/client";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isBootstrapping: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (payload: { username: string; email: string; password: string; displayName?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, setAuth, setAccessToken, setUser, clearAuth } = useAuthStore();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    // On page load there's no access token in memory, only the httpOnly
    // refresh cookie (if the user was previously logged in). Silently try to
    // trade it for a fresh access token, then hydrate the user.
    (async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        const token = data?.data?.accessToken as string | undefined;
        if (token) {
          setAccessToken(token);
          const me = await fetchMe();
          setAuth(me, token);
        }
      } catch {
        clearAuth();
      } finally {
        setIsBootstrapping(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (emailOrUsername: string, password: string) => {
    const { user: loggedInUser, accessToken } = await loginRequest({ emailOrUsername, password });
    setAuth(loggedInUser, accessToken);
  };

  const register = async (payload: { username: string; email: string; password: string; displayName?: string }) => {
    const { user: newUser, accessToken } = await registerRequest(payload);
    setAuth(newUser, accessToken);
  };

  const logout = async () => {
    await logoutRequest().catch(() => undefined);
    clearAuth();
  };

  const updateProfile = async (payload: UpdateProfilePayload) => {
    const updated = await updateProfileRequest(payload);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, isBootstrapping, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
