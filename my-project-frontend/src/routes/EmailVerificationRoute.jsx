import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext.jsx";

export default function EmailVerificationRoute() {
    const { isAuthenticated, needsEmailVerification, loading } = useAuth();

    if (loading) return null;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        toast.warn("Please login");
        return <Navigate to="/login" />;
    }

    // If email is already verified, redirect to home
    if (!needsEmailVerification) {
        toast.warn("Account is already verified");
        return <Navigate to="/" />;
    }

    // Allow access to email verification pages
    return <Outlet />;
}
