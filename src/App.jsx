// src/App.jsx
import React from "react";

// ---------------------------------------------------------------------
// Design-system CSS MUST be imported first, before any component/page
// module. Previously these three imports sat in the middle of the
// import list (after NavigationBar/HomePage/etc.), which meant those
// components' own CSS was evaluated first and could silently win
// cascade ties against the global tokens/typography/reset layer below
// (e.g. HomePage.css's own `h1, h2, h3` rule overriding typography.css's
// global heading rule purely because of import order). Keeping this
// block first guarantees the intended layering: tokens -> typography ->
// global reset, then every component/page style on top of that.
// ---------------------------------------------------------------------
import "./styles/tokens.css"; // Design tokens (single source)
import "./styles/typography.css"; // Type scale + font imports
import "./styles/global.css"; // Base reset, layout, shared components
import "./App.css"; // App-specific styles

import { HelmetProvider } from "react-helmet-async";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import Properties from "./pages/Properties";
import ContactUs from "./pages/ContactUs";
import Blog from "./pages/Blog";
import AdminUpload from "./pages/AdminUpload"; // Admin Upload component
import AdminDashboardPage from "./components/admin/AdminDashboardPage"; // Admin overview (Package 5.1)
import AdminLogin from "./pages/public/AdminLogin"; // Legacy admin login page
import Login from "./pages/public/Login"; // Shared public+admin login (Auth Plan Phase C, replaces AdminLogin)
import SignUp from "./pages/public/SignUp"; // Public sign-up (Auth Plan Phase C)
import ResetPassword from "./pages/public/ResetPassword"; // Forgot/reset password (Auth Plan Phase C)
import Dashboard from "./pages/Dashboard"; // Signed-in user home base (Auth Plan Phase E)
import AdminLayout from "./components/layout/AdminLayout"; // Admin sidebar shell (Package 5.1)
import ProtectedRoute from "./components/layout/ProtectedRoute"; // Admin route guard (Package 5.1, role-aware per Auth Plan Phase B)
import UserProtectedRoute from "./components/layout/UserProtectedRoute"; // Any-signed-in-user route guard (Auth Plan Phase B)
import PropertyModule from "./components/admin/PropertyModule"; // Tabbed rebuild (Package 5.2)
import BlogModule from "./components/admin/BlogModule"; // TipTap rebuild (Package 5.3)
import LeadsModule from "./components/admin/LeadsModule"; // Pipeline rebuild (Package 5.4)
import TestimonialsModule from "./components/admin/TestimonialsModule"; // Rebuild (Package 5.5)
import SettingsModule from "./components/admin/SettingsModule"; // site_settings CRUD (Package 5.5)
import AdminUsers from "./components/AdminUsers";
import AdminRegister from "./pages/AdminRegister";
import BlogDetail from "./pages/BlogDetail"; // Blog Detail component
import OurTeam from "./pages/OurTeam"; // Our Team component
import PropertyDetailPage from "./pages/public/PropertyDetailPage"; // Property Detail page
import GuaranteedRentPage from "./pages/public/GuaranteedRentPage"; // Guaranteed Rent page (Package 4.5)
import NotFoundPage from "./pages/public/NotFoundPage"; // Dedicated 404 page (Package 6.2)
import ScrollToTop from "./components/ScrollToTop"; // ScrollToTop component
import ErrorBoundary from "./components/shared/ErrorBoundary"; // Render-error safety net (Package 6.2)

// Main application component with semantic layout for accessibility
function App() {
  return (
    <HelmetProvider>
      <Router>
        {/* NavigationBar should internally use semantic <nav> tags */}
        <NavigationBar />

        {/* Main content wrapped in a semantic <main> tag with added transition effects */}
        <main className="app-main transition">
          <ScrollToTop />
          {/* ErrorBoundary (Package 6.2) wraps only the routed page
              content — not NavigationBar/Footer — so a render error in
              any single page still leaves navigation and the footer
              usable instead of white-screening the whole app. */}
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/admin-secret-upload" element={<AdminUpload />} />
              {/* Auth Plan §4: the obscure admin-login URL now simply
                  redirects to the shared /login — there's no security
                  value left in the obscurity once ProtectedRoute does a
                  real role check, but no harm in leaving the URL live
                  as an alias either. */}
              <Route
                path="/mppateL123"
                element={<Navigate to="/login" replace />}
              />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route element={<UserProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              {/* Admin section (Package 5.1) — sidebar shell + per-module
                  deep-linkable routes, guarded by ProtectedRoute.
                  PropertyModule is the tabbed rebuild (Package 5.2).
                  BlogModule is the TipTap rebuild (Package 5.3).
                  LeadsModule is the pipeline rebuild (Package 5.4).
                  TestimonialsModule is the rebuild (Package 5.5); SettingsModule
                  is new (Package 5.5, site_settings CRUD). AdminUsers remains
                  the existing, unmodified implementation — Package 5.5 does not
                  implement the role-permission matrix (no matrix is defined in
                  the Blueprint/redesign plan, and no admin_users.role column
                  exists), so AdminUsers is intentionally retained rather than
                  superseded; see IMPLEMENTATION_STATE.md. */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="properties" element={<PropertyModule />} />
                  <Route path="blog" element={<BlogModule />} />
                  <Route path="leads" element={<LeadsModule />} />
                  <Route path="testimonials" element={<TestimonialsModule />} />
                  <Route path="settings" element={<SettingsModule />} />
                  <Route path="admins" element={<AdminUsers />} />
                </Route>
              </Route>
              <Route path="/properties/:id" element={<PropertyDetailPage />} />
              <Route path="/admin-register" element={<AdminRegister />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/our-team" element={<OurTeam />} />
              <Route path="/guaranteed-rent" element={<GuaranteedRentPage />} />
              {/* 404 Not Found route (Package 6.2) — dedicated page,
                  replacing the previous silent fallthrough to HomePage. */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* Footer ideally uses a semantic <footer> element internally */}
        <Footer />
      </Router>
    </HelmetProvider>
  );
}

export default App;
