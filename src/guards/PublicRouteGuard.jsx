import { TOKEN } from "constants";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AUTHENTICATED_ENTRY_PATH = "/workouts";

const PublicRouteGuard = () => {
  const token = localStorage.getItem(TOKEN);
  const navigateTo = AUTHENTICATED_ENTRY_PATH;

  if (token) {
    return <Navigate to={navigateTo} />;
  }
  return <Outlet />;
};

export default PublicRouteGuard;
