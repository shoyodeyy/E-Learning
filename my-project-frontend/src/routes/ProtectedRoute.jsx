import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ isAuthenticated, role, allowedRoles }) {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/403" replace />;
    }

    return <Outlet />;
}
