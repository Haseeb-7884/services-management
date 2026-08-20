"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types";

export function ProtectedRoute({
  children,
  allow,
}: {
  children: ReactNode;
  /** Optional role allow-list. Omit to just require any authenticated user. */
  allow?: Role[];
}) {
  const { user, isBootstrapping } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isBootstrapping) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (allow && !allow.includes(user.role)) router.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBootstrapping, user]);

  if (isBootstrapping || !user || (allow && !allow.includes(user.role))) {
    return <div className="grid min-h-[40vh] place-items-center text-[var(--brand-text-muted)]">Loading…</div>;
  }

  return <>{children}</>;
}
