// src/pages/admin/AdminDashboardPage.jsx
//
// Package 5.1 — Admin Layout + Routing.
//
// Relocated + rebuilt from `pages/AdminDashboard.jsx` (superseded — see
// IMPLEMENTATION_STATE.md Deleted Files). The old file was a single-page
// tab-switcher that rendered every module inline (Blueprint Part A
// Section 3h/9). That responsibility now belongs to routing itself:
// `App.jsx` mounts each module at its own path under `AdminLayout`
// (`components/layout/AdminLayout.jsx`), guarded by `ProtectedRoute`
// (`components/layout/ProtectedRoute.jsx`).
//
// This file is now just the `/admin` index route: a lightweight landing
// screen with quick links into each section. It intentionally does NOT
// implement the redesign plan's Section 8 "Overview module" metric
// cards (total properties / new leads today / etc.) — that feature was
// not mapped to any package in the Blueprint's Section 13 roster (no
// `OverviewModule.jsx` create entry, no Depends-on/completion-criteria
// row references it), so building it here would be an undocumented
// scope expansion rather than an approved package. See
// IMPLEMENTATION_STATE.md's Known Deviations for this gap.
import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Newspaper,
  Users,
  MessageSquareQuote,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./AdminDashboardPage.css";

const SECTIONS = [
  {
    to: "/admin/properties",
    label: "Properties",
    description: "Add, edit, and publish property listings.",
    icon: Building2,
  },
  {
    to: "/admin/blog",
    label: "Blog",
    description: "Manage blog posts and drafts.",
    icon: Newspaper,
  },
  {
    to: "/admin/leads",
    label: "Leads",
    description: "Review inquiries submitted from the site.",
    icon: Users,
  },
  {
    to: "/admin/testimonials",
    label: "Testimonials",
    description: "Manage client testimonials shown on the homepage.",
    icon: MessageSquareQuote,
  },
  {
    to: "/admin/admins",
    label: "Admins",
    description: "Manage admin accounts.",
    icon: ShieldCheck,
  },
];

function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="admin-overview">
      <h1 className="admin-overview__title">
        {user?.email ? `Welcome back, ${user.email}` : "Welcome back"}
      </h1>
      <p className="admin-overview__subtitle">Choose a section to manage.</p>

      <div className="admin-overview__grid">
        {SECTIONS.map(({ to, label, description, icon: Icon }) => (
          <Link key={to} to={to} className="admin-overview__card">
            <Icon
              size={26}
              className="admin-overview__card-icon"
              aria-hidden="true"
            />
            <span className="admin-overview__card-title">{label}</span>
            <span className="admin-overview__card-desc">{description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
