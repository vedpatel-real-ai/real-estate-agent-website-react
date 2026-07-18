// src/components/layout/AdminLayout.jsx
//
// Package 5.1 — Admin Layout + Routing.
//
// Sidebar admin shell. Replaces the previous single-page tab-switcher in
// `pages/AdminDashboard.jsx` (Blueprint Part A Section 3h/9) with a real
// sidebar + deep-linkable per-module routes, rendered via <Outlet />.
//
// Module rebuilds themselves (tabbed PropertyModule, TipTap BlogModule,
// Leads pipeline, Testimonials, new Settings) are Packages 5.2–5.5, not
// this package — the nav below links to each module's new route.
// PropertyModule (5.2), BlogModule (5.3), LeadsModule (5.4), and
// TestimonialsModule (5.5) are now the rebuilt versions at
// `components/admin/`; SettingsModule (5.5) is new. `AdminUsers.jsx`
// remains the pre-existing, unmodified implementation — 5.5 does not
// implement the role-permission matrix (no matrix is defined anywhere
// in the Blueprint/redesign plan), so nothing supersedes it yet (see
// IMPLEMENTATION_STATE.md).
//
// Additive-only touch for Package 5.5: this file gains one nav entry
// (`/admin/settings`) so the new SettingsModule is reachable — no other
// structural change, consistent with Package 5.4's precedent of an
// additive-only App.jsx touch for a relocated/new module route.
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Newspaper,
  Users,
  MessageSquareQuote,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./AdminLayout.css";

const ADMIN_LOGIN_PATH = "/mppateL123";

const NAV_ITEMS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/properties", label: "Properties", icon: Building2 },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/leads", label: "Leads", icon: Users },
  {
    to: "/admin/testimonials",
    label: "Testimonials",
    icon: MessageSquareQuote,
  },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/admins", label: "Admins", icon: ShieldCheck },
];

/**
 * AdminLayout
 *
 * Persistent sidebar + header shell for every route nested under
 * `/admin`. Renders the active module via <Outlet />. Sidebar collapses
 * to a slide-in drawer on narrow viewports (existing project convention
 * for a hamburger toggle, matching `NavigationBar.jsx`'s mobile pattern).
 */
function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const closeMobileNav = () => setMobileNavOpen(false);

  const handleLogout = async () => {
    await signOut();
    navigate(ADMIN_LOGIN_PATH, { replace: true });
  };

  return (
    <div className="admin-layout">
      <header className="admin-layout__topbar">
        <button
          type="button"
          className="admin-layout__menu-toggle"
          aria-label={mobileNavOpen ? "Close admin menu" : "Open admin menu"}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="admin-layout__brand">DreamSpace Demo Admin</span>
        <div className="admin-layout__topbar-spacer" />
        {user?.email && (
          <span className="admin-layout__user">{user.email}</span>
        )}
        <button
          type="button"
          className="admin-layout__logout"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </header>

      <div className="admin-layout__body">
        {mobileNavOpen && (
          <button
            type="button"
            className="admin-layout__scrim"
            aria-label="Close admin menu"
            onClick={closeMobileNav}
          />
        )}

        <nav
          className={
            mobileNavOpen
              ? "admin-layout__sidebar admin-layout__sidebar--open"
              : "admin-layout__sidebar"
          }
          aria-label="Admin sections"
        >
          <ul className="admin-layout__nav-list">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={closeMobileNav}
                  className={({ isActive }) =>
                    isActive
                      ? "admin-layout__nav-link admin-layout__nav-link--active"
                      : "admin-layout__nav-link"
                  }
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
