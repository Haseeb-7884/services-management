"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LayoutDashboard, Menu, ShieldCheck, Sparkles, UserCog, Users, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useSeo } from "@/hooks/useSeo";
import type { Role, User } from "@/types";

const SUPER_ADMIN_ROLES: Role[] = ["super_admin", "owner"];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "/superadmin", end: true },
  { icon: Users, label: "Users", href: "/superadmin/users", end: false },
  { icon: UserCog, label: "Admins", href: "/superadmin/admins", end: false },
  { icon: Sparkles, label: "Creators", href: "/superadmin/creators", end: false },
  { icon: ClipboardList, label: "Moderation", href: "/superadmin/moderation", end: false },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ icon: Icon, label, href, end }) => {
        const isActive = end ? pathname === href : pathname === href || pathname?.startsWith(`${href}/`);
        return (
          <Link
            key={label}
            href={href}
            onClick={onNavigate}
            className="group flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-150 active:scale-[0.98]"
            style={
              isActive
                ? { backgroundColor: "color-mix(in srgb, var(--brand-primary) 10%, transparent)", border: "1px solid var(--border-highlight)", color: "var(--brand-primary)" }
                : { backgroundColor: "transparent", border: "1px solid transparent", color: "var(--brand-text-muted)" }
            }
          >
            <Icon size={17} className="shrink-0 transition-transform duration-150 group-hover:scale-110" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarHeader({ user }: { user: User | null }) {
  const name = user?.profile.displayName || user?.username || "Super Admin";
  return (
    <div className="mb-6 flex items-center gap-2.5 pl-1">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 14%, transparent)" }}>
        <ShieldCheck size={18} color="var(--brand-primary)" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-bold text-[var(--brand-text)]">{name}</p>
        <p className="text-[11px] capitalize text-[var(--brand-text-muted)]">{user?.role.replace("_", " ") || "Super Admin"}</p>
      </div>
    </div>
  );
}

function SuperAdminShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useSeo({ title: "Super Admin", description: "Platform-wide administration.", noindex: true });

  return (
    <div className="flex w-full">
      {/* Fixed desktop sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[240px] shrink-0 flex-col gap-1 overflow-y-auto border-r px-3 py-7 md:flex" style={{ borderColor: "var(--border-subtle)" }}>
        <SidebarHeader user={user} />
        <SidebarNav />
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40 animate-[fadeIn_150ms_ease-out]" onClick={() => setSidebarOpen(false)} />
          <aside
            className="animate-slide-in-left absolute left-0 top-0 h-full w-64 overflow-y-auto border-r px-4 py-6"
            style={{ backgroundColor: "var(--brand-bg-end)", borderColor: "var(--border-subtle)" }}
          >
            <div className="mb-6 flex items-center justify-between">
              <SidebarHeader user={user} />
              <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="rounded-lg p-1 text-[var(--brand-text-muted)] transition hover:bg-[var(--surface-card-hover)]">
                <X size={20} />
              </button>
            </div>
            <SidebarNav onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => setSidebarOpen(true)}
          className="mb-4 grid h-10 w-10 place-items-center rounded-lg border transition active:scale-95 md:hidden"
          style={{ borderColor: "var(--border-subtle)" }}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        {children}
      </main>
    </div>
  );
}

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allow={SUPER_ADMIN_ROLES}>
      <SuperAdminShell>{children}</SuperAdminShell>
    </ProtectedRoute>
  );
}
