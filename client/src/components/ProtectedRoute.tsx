import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export const ProtectedRoute = () => {
  const { user, ready } = useAuthContext();
  if (!ready) return null;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export const AdminRoute = () => {
  const { user, ready } = useAuthContext();
  if (!ready) return null;
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
