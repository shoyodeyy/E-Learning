import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function GuestRoute() {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return null;
    if (user?.role === "admin") return <Navigate to="/admin/dashboard" />;

    return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
}
