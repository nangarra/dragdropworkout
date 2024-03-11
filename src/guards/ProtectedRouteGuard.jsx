import { TOKEN } from "constants";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const UN_AUTHENTICATED_ENTRY_PATH = "/sign-in";
const AUTHENTICATED_ENTRY_PATH = "/workouts";

const ProtectedRouteGuard = () => {
  const location = useLocation();

  const token = localStorage.getItem(TOKEN);
  const navigateTo = location.search
    ? `${UN_AUTHENTICATED_ENTRY_PATH}${location.search}`
    : UN_AUTHENTICATED_ENTRY_PATH;

  if (!token) {
    return <Navigate to={navigateTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteGuard;
