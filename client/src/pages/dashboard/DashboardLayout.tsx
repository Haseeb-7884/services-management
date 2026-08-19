import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BarChart2, Film, LayoutDashboard, Menu, Settings, Users, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSeo } from "../../hooks/useSeo";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard", end: true },
  { icon: Film, label: "My Content", to: "/dashboard/content", end: false },
  { icon: BarChart2, label: "Analytics", to: "/dashboard/analytics", end: false },
  { icon: Users, label: "Audience", to: "/dashboard/audience", end: false },
  { icon: Settings, label: "Settings", to: "/dashboard/settings", end: false },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ icon: Icon, label, to, end }) => (
        <NavLink
          key={label}
          to={to}
          end={end}
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition"
          style={({ isActive }) =>
            isActive
              ? { backgroundColor: "color-mix(in srgb, var(--brand-primary) 10%, transparent)", border: "1px solid var(--border-highlight)", color: "var(--brand-primary)" }
              : { backgroundColor: "transparent", border: "1px solid transparent", color: "var(--brand-text-muted)" }
          }
        >
          <Icon size={17} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarHeader({ user }: { user: { profile: { displayName?: string; avatarUrl?: string }; username: string; role: string } | null }) {
  const name = user?.profile.displayName || user?.username || "Creator";
  return (
    <div className="mb-6 flex items-center gap-2.5 pl-1">
      <div className="h-8 w-8 overflow-hidden rounded-full border-2" style={{ borderColor: "var(--border-medium)" }}>
        {user?.profile.avatarUrl ? (
          <img src={user.profile.avatarUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))" }}>
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div>
        <p className="text-[13px] font-bold text-[var(--brand-text)]">{name}</p>
        <p className="text-[11px] capitalize text-[var(--brand-text-muted)]">{user?.role.replace("_", " ") || "Creator"}</p>
      </div>
    </div>
  );
}

/**
 * Dashboard app-shell: sidebar (desktop pinned + mobile drawer) around a
 * routed <Outlet/>. Full browser width on purpose - this is a standard
 * admin-dashboard layout, not a centered marketing page, so the sidebar
 * pins to the true left edge and content fills the rest of the width.
 */
export function DashboardLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useSeo({ title: "Creator Dashboard", description: "Manage your channel.", noindex: true });

  return (
    <div className="flex w-full">
      {/* Desktop sidebar */}
      <aside
        className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[220px] shrink-0 flex-col gap-1 overflow-y-auto border-r px-3 py-7 md:flex"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <SidebarHeader user={user} />
        <SidebarNav />
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside
            className="absolute left-0 top-0 h-full w-64 overflow-y-auto border-r px-4 py-6"
            style={{ backgroundColor: "var(--brand-bg-end)", borderColor: "var(--border-subtle)" }}
          >
            <div className="mb-6 flex items-center justify-between">
              <SidebarHeader user={user} />
              <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="text-[var(--brand-text-muted)]">
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
          className="mb-4 grid h-10 w-10 place-items-center rounded-lg border md:hidden"
          style={{ borderColor: "var(--border-subtle)" }}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <Outlet />
      </main>
    </div>
  );
}
