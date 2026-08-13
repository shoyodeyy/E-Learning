import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function VerifyRoute() {
    const { isVerified, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return isVerified ? <Navigate to="/" /> : <Outlet />;
}
