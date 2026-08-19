import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  FileText,
  Film,
  Heart,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  Tag,
  User as UserIcon,
  UserPlus,
  X,
} from "lucide-react";
import { useBranding } from "../context/BrandingContext";
import { useAuth } from "../context/AuthContext";
import { fetchMyNotifications, markNotificationRead } from "../api/notifications";
import type { NotificationItem } from "../types";

const NOTIF_ICON = { follow: UserPlus, like: Heart, comment: MessageSquare } as const;

function notifMessage(n: NotificationItem) {
  const name = n.actor.profile?.displayName || n.actor.username;
  if (n.type === "follow") return `${name} started following you`;
  if (n.type === "like") return `${name} liked your ${n.targetType?.toLowerCase() ?? "content"}`;
  return `${name} commented on your ${n.targetType?.toLowerCase() ?? "content"}`;
}

// Pure site-navigation - lives in the hamburger drawer, YouTube-sidebar
// style, instead of a row of pills competing with the search bar for space
// in the top bar.
const NAV_LINKS = [
  { to: "/", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/videos", label: "Videos", icon: Film, end: false },
  { to: "/images", label: "Images", icon: ImageIcon, end: false },
  { to: "/articles", label: "Articles", icon: FileText, end: false },
  { to: "/pricing", label: "Pricing", icon: Tag, end: false },
];

const CREATOR_DASHBOARD_ROLES = new Set(["creator", "moderator", "admin", "super_admin", "owner"]);
const ADMIN_ROLES = new Set(["moderator", "admin", "super_admin", "owner"]);
const SUPER_ADMIN_ROLES = new Set(["super_admin", "owner"]);

function initialsOf(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function drawerLinkStyle({ isActive }: { isActive: boolean }) {
  return {
    color: isActive ? "var(--brand-primary)" : "var(--brand-text)",
    backgroundColor: isActive ? "color-mix(in srgb, var(--brand-primary) 10%, transparent)" : "transparent",
  };
}

export function Navbar() {
  const { branding } = useBranding();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const displayName = user?.profile.displayName || user?.username || "";
  const canSeeDashboard = Boolean(user && CREATOR_DASHBOARD_ROLES.has(user.role));
  const canSeeAdmin = Boolean(user && ADMIN_ROLES.has(user.role));
  const canSeeSuperAdmin = Boolean(user && SUPER_ADMIN_ROLES.has(user.role));

  // Poll unread count so the bell badge stays fresh without needing the
  // dropdown to be opened.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = () => {
      fetchMyNotifications(1, 8)
        .then((res) => {
          if (cancelled) return;
          setNotifications(res.items);
          setUnreadCount(res.unreadCount);
        })
        .catch(() => {
          // Silent: the bell just won't show a badge if this fails.
        });
    };
    load();
    const interval = setInterval(load, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user]);

  const handleNotifClick = async (n: NotificationItem) => {
    if (!n.read) {
      await markNotificationRead(n._id);
      setNotifications((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
      setUnreadCount((c) => Math.max(0, c - 1));
    }
  };

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    setDrawerOpen(false);
    navigate("/");
  };

  const runSearch = (query: string) => {
    const q = query.trim();
    setDrawerOpen(false);
    navigate(q ? `/videos?search=${encodeURIComponent(q)}` : "/videos");
  };

  // "/" focuses search, matching the quick-search shortcut hint shown in the bar.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Close the avatar/notification dropdowns on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ borderColor: "var(--border-subtle)", backgroundColor: "color-mix(in srgb, var(--brand-bg-end) 92%, transparent)" }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--brand-text-muted)] transition hover:bg-[var(--surface-card-hover)]"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <Link to="/" className="flex shrink-0 items-center gap-2 font-semibold">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt={branding.siteName} className="h-9 w-9 rounded-xl object-cover" />
            ) : (
              <span
                className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold"
                style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))", color: "var(--brand-bg-start)", boxShadow: "0 4px 14px var(--glow-primary)" }}
              >
                {initialsOf(branding.siteName)}
              </span>
            )}
            <span className="hidden text-[17px] tracking-tight text-[var(--brand-text)] sm:inline">{branding.siteName}</span>
          </Link>

          {/* Search - dominant, centered, YouTube-pill style with an attached search button. Desktop only; mobile gets its own row below. */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runSearch(searchRef.current?.value ?? "");
            }}
            className="mx-auto hidden w-full max-w-xl flex-1 items-center md:flex"
          >
            <div className="flex w-full overflow-hidden rounded-full border" style={{ borderColor: "var(--border-subtle)" }}>
              <input
                ref={searchRef}
                placeholder="Search videos…"
                className="w-full bg-transparent py-2 pl-4 pr-2 text-sm outline-none"
                style={{ backgroundColor: "var(--surface-card)", color: "var(--brand-text)" }}
              />
              <button
                type="submit"
                aria-label="Search"
                className="grid w-12 shrink-0 place-items-center border-l transition hover:bg-[var(--surface-card-hover)]"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--brand-bg-end)" }}
              >
                <Search size={16} className="text-[var(--brand-text-muted)]" />
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            {user && (
              <Link
                to="/upload"
                className="grid h-9 w-9 place-items-center rounded-full transition hover:opacity-90"
                style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 12%, transparent)", color: "var(--brand-primary)" }}
                aria-label="Create"
                title="Create"
              >
                <Plus size={19} />
              </Link>
            )}

            {user && (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen((v) => !v)}
                    className="relative grid h-9 w-9 place-items-center rounded-full text-[var(--brand-text-muted)] transition hover:bg-[var(--surface-card-hover)] hover:text-[var(--brand-primary)]"
                    aria-label="Notifications"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: "var(--brand-primary)", boxShadow: "0 0 0 2px var(--brand-bg-end)" }} />
                    )}
                  </button>

                  {notifOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border py-1.5"
                      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-lg)" }}
                    >
                      <div className="border-b px-3.5 py-2.5 text-sm font-semibold text-[var(--brand-text)]" style={{ borderColor: "var(--border-subtle)" }}>
                        Notifications
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 && (
                          <p className="px-3.5 py-6 text-center text-sm text-[var(--brand-text-muted)]">No notifications yet.</p>
                        )}
                        {notifications.map((n) => {
                          const Icon = NOTIF_ICON[n.type];
                          return (
                            <button
                              key={n._id}
                              onClick={() => handleNotifClick(n)}
                              className="flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left transition hover:bg-[var(--surface-card-hover)]"
                              style={{ backgroundColor: n.read ? "transparent" : "color-mix(in srgb, var(--brand-primary) 5%, transparent)" }}
                            >
                              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--brand-primary) 12%, transparent)" }}>
                                <Icon size={12} color="var(--brand-primary)" />
                              </span>
                              <span className="min-w-0 flex-1 text-xs text-[var(--brand-text)]">{notifMessage(n)}</span>
                            </button>
                          );
                        })}
                      </div>
                      <Link
                        to="/notifications"
                        onClick={() => setNotifOpen(false)}
                        className="block border-t px-3.5 py-2.5 text-center text-xs font-semibold text-[var(--brand-primary)]"
                        style={{ borderColor: "var(--border-subtle)" }}
                      >
                        View all
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/messages"
                  className="hidden h-9 w-9 place-items-center rounded-full text-[var(--brand-text-muted)] transition hover:bg-[var(--surface-card-hover)] hover:text-[var(--brand-primary)] sm:grid"
                  aria-label="Messages"
                  title="Messages"
                >
                  <MessageCircle size={18} />
                </Link>

                {/* Avatar + dropdown */}
                <div className="relative ml-0.5" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center gap-1 rounded-full py-0.5 pl-0.5 pr-1 transition hover:bg-[var(--surface-card-hover)] sm:pr-1.5"
                  >
                    <span
                      className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border text-sm font-semibold"
                      style={{ borderColor: "var(--border-medium)", color: "var(--brand-primary)" }}
                    >
                      {user.profile.avatarUrl ? (
                        <img src={user.profile.avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                      ) : (
                        initialsOf(displayName)
                      )}
                    </span>
                    <ChevronDown size={14} className={`hidden text-[var(--brand-text-muted)] transition-transform sm:block ${menuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {menuOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border py-1.5"
                      style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-lg)" }}
                    >
                      <div className="border-b px-3.5 py-2.5" style={{ borderColor: "var(--border-subtle)" }}>
                        <p className="truncate text-sm font-semibold text-[var(--brand-text)]">{displayName}</p>
                        <p className="truncate text-xs text-[var(--brand-text-muted)]">@{user.username}</p>
                      </div>
                      <Link
                        to={`/u/${user.username}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-[var(--brand-text)] transition hover:bg-[var(--surface-card-hover)]"
                      >
                        <UserIcon size={15} className="text-[var(--brand-text-muted)]" /> View channel
                      </Link>
                      {canSeeDashboard && (
                        <Link
                          to="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-[var(--brand-text)] transition hover:bg-[var(--surface-card-hover)]"
                        >
                          <LayoutDashboard size={15} className="text-[var(--brand-text-muted)]" /> Dashboard
                        </Link>
                      )}
                      {canSeeSuperAdmin ? (
                        <Link
                          to="/superadmin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-[var(--brand-text)] transition hover:bg-[var(--surface-card-hover)]"
                        >
                          <ShieldCheck size={15} className="text-[var(--brand-text-muted)]" /> Super Admin
                        </Link>
                      ) : canSeeAdmin ? (
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-[var(--brand-text)] transition hover:bg-[var(--surface-card-hover)]"
                        >
                          <ShieldCheck size={15} className="text-[var(--brand-text-muted)]" /> Admin
                        </Link>
                      ) : null}
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-[var(--brand-text)] transition hover:bg-[var(--surface-card-hover)]"
                      >
                        <LogOut size={15} className="text-[var(--brand-text-muted)]" /> Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {!user && (
              <>
                <Link to="/login" className="hidden text-sm font-medium text-[var(--brand-text-muted)] hover:text-[var(--brand-text)] sm:inline">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn-glow rounded-full px-4 py-2 text-sm font-semibold"
                  style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile search row - the pill search above is desktop-only */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch(mobileSearch);
          }}
          className="border-t px-4 py-2.5 md:hidden"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div className="flex overflow-hidden rounded-full border" style={{ borderColor: "var(--border-subtle)" }}>
            <input
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              placeholder="Search videos…"
              className="w-full bg-transparent py-2 pl-4 pr-2 text-sm outline-none"
              style={{ backgroundColor: "var(--surface-card)", color: "var(--brand-text)" }}
            />
            <button type="submit" aria-label="Search" className="grid w-11 shrink-0 place-items-center border-l" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--brand-bg-end)" }}>
              <Search size={15} className="text-[var(--brand-text-muted)]" />
            </button>
          </div>
        </form>
      </header>

      {/* Hamburger drawer - YouTube-sidebar style, shared between mobile and desktop */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <aside
            className="absolute left-0 top-0 flex h-full w-72 flex-col overflow-y-auto border-r px-3 py-4"
            style={{ backgroundColor: "var(--brand-bg-end)", borderColor: "var(--border-subtle)" }}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2 font-semibold">
                {branding.logoUrl ? (
                  <img src={branding.logoUrl} alt={branding.siteName} className="h-8 w-8 rounded-lg object-cover" />
                ) : (
                  <span
                    className="grid h-8 w-8 place-items-center rounded-lg text-xs font-bold"
                    style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))", color: "var(--brand-bg-start)" }}
                  >
                    {initialsOf(branding.siteName)}
                  </span>
                )}
                <span className="text-[15px] text-[var(--brand-text)]">{branding.siteName}</span>
              </Link>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="grid h-8 w-8 place-items-center rounded-full text-[var(--brand-text-muted)] hover:bg-[var(--surface-card-hover)]">
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
                  style={drawerLinkStyle}
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              ))}
            </nav>

            {user && (
              <>
                <div className="my-3 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
                <nav className="flex flex-col gap-1">
                  <NavLink
                    to="/upload"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
                    style={drawerLinkStyle}
                  >
                    <Plus size={17} /> Upload
                  </NavLink>
                  <NavLink
                    to="/notifications"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition"
                    style={drawerLinkStyle}
                  >
                    <span className="flex items-center gap-3">
                      <Bell size={17} /> Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: "var(--brand-primary)" }}>
                        {unreadCount}
                      </span>
                    )}
                  </NavLink>
                  <NavLink
                    to="/messages"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
                    style={drawerLinkStyle}
                  >
                    <MessageCircle size={17} /> Messages
                  </NavLink>
                  {canSeeDashboard && (
                    <NavLink
                      to="/dashboard"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
                      style={drawerLinkStyle}
                    >
                      <LayoutDashboard size={17} /> Dashboard
                    </NavLink>
                  )}
                  {canSeeSuperAdmin ? (
                    <NavLink
                      to="/superadmin"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
                      style={drawerLinkStyle}
                    >
                      <ShieldCheck size={17} /> Super Admin
                    </NavLink>
                  ) : canSeeAdmin ? (
                    <NavLink
                      to="/admin"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition"
                      style={drawerLinkStyle}
                    >
                      <ShieldCheck size={17} /> Admin
                    </NavLink>
                  ) : null}
                </nav>
              </>
            )}

            <div className="mt-auto flex flex-col gap-2 pt-4">
              {user ? (
                <>
                  <Link
                    to={`/u/${user.username}`}
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-lg border py-2.5 text-center text-sm font-medium text-[var(--brand-text)]"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    {displayName}'s channel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg border py-2.5 text-sm font-medium text-[var(--brand-text-muted)]"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-lg border py-2.5 text-center text-sm font-medium text-[var(--brand-text)]"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-lg py-2.5 text-center text-sm font-semibold"
                    style={{ backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
