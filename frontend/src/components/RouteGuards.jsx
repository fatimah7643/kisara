import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Halaman yang wajib login. Contoh: <ProtectedRoute roles={["creator"]}>...</ProtectedRoute>
export function ProtectedRoute({ children, roles }) {
  const { user, profile } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(profile?.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

// Halaman khusus tamu (login / register). Yang sudah login dilempar keluar.
export function GuestRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user) return <Navigate to={location.state?.from || "/dashboard"} replace />;
  return children;
}