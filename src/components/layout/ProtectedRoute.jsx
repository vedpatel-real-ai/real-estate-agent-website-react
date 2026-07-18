// src/components/layout/ProtectedRoute.jsx
//
// Package 5.1 — Admin Layout + Routing.
// Extended (Auth & Favourites Architecture Plan §4) to close the role
// gap identified in the plan's §1.2: previously this only checked "is
// there a session?", which would let ANY newly-signed-up public user
// reach /admin once public sign-up exists. Now it also checks
// `useAuth().isAdmin` (database-backed, via `admin_users`) and only
// authenticated admins pass through. Authenticated-but-non-admin users
// are sent to /dashboard instead of the login page — they're logged in,
// just not an admin, so bouncing them back to login would be confusing.
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../ui/Spinner";

// The shared login route (Phase C). `/mppateL123` now redirects here
// (see App.jsx) rather than rendering its own page — there's no
// security value left in the obscure URL once role gating is real.
const LOGIN_PATH = "/login";

/**
 * ProtectedRoute
 *
 * Renders its nested routes (via <Outlet />) only when a Supabase Auth
 * session is present AND `admin_users.is_admin` is true for that user.
 * Shows a spinner while either check is resolving, rather than flashing
 * the login page or protected content.
 */
function ProtectedRoute() {
  const {
    isAuthenticated,
    isLoading,
    isAdmin,
    isAdminLoading,
    user,
    adminCheckedForUserId,
  } = useAuth();
  const location = useLocation();

  // Debug: surface auth state when route guard runs
  try {
    // eslint-disable-next-line no-console
    console.log("[ProtectedRoute] auth", {
      pathname: location.pathname,
      isAuthenticated,
      isLoading,
      isAdmin,
      isAdminLoading,
    });
  } catch (e) {}

  // Wait while either the auth session is initializing OR the admin
  // check is in-flight for the current user. Expose `adminCheckedForUserId`
  // from `useAuth` so we can detect whether the role check has already
  // been performed for this signed-in user — this avoids a race where
  // `isAdmin` is still false but the role-check hasn't started yet,
  // preventing a premature redirect to `/dashboard`.
  if (
    isLoading ||
    (isAuthenticated && (isAdminLoading || adminCheckedForUserId !== user?.id))
  ) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner
          size="large"
          variant="primary"
          label="Checking session…"
          showLabel
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_PATH} replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
