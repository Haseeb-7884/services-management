import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

export function ProtectedRoute({
  children,
  allow,
}: {
  children: ReactNode;
  /** Optional role allow-list. Omit to just require any authenticated user. */
  allow?: Role[];
}) {
  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <div className="grid min-h-[40vh] place-items-center text-[var(--brand-text-muted)]">Loading…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(user.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
}
