import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function GuestRoute() {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) return null;

    if (isAuthenticated) {
        switch (user?.role) {
            case "admin":
                return <Navigate to="/admin/dashboard" replace />;
            case "organizer":
                return <Navigate to="/organizer/dashboard" replace />;
            case "participant":
            default:
                return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
}