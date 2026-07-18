// src/components/layout/UserProtectedRoute.jsx
//
// Guards routes that require any signed-in user, including the dashboard.
// Guests are sent to the shared login page while authenticated users are
// allowed through to the protected content.
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../ui/Spinner";

const LOGIN_PATH = "/login";

function UserProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
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

  return <Outlet />;
}

export default UserProtectedRoute;
