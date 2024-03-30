import { TOKEN } from "constants";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const UN_AUTHENTICATED_ENTRY_PATH = "/admin/sign-in";
const AUTHENTICATED_ENTRY_PATH = "/admin/exercises";

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
