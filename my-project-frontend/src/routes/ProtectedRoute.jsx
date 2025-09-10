import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
    const { isAuthenticated, user, loading } = useAuth();

    // Show loading while checking authentication
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
console.log(user);

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}