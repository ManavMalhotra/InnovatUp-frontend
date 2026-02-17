import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircleNotch } from "@phosphor-icons/react";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <CircleNotch className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
}