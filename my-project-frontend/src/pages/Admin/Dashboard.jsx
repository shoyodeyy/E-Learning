import { useEffect } from "react";
import {Outlet, useNavigate} from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import AdminSidebar from "./AdminSidebar.jsx";

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout, refreshUser } = useAuth();

    useEffect(() => {
        if (!user) return;

        if (!user.email_verified_at) {
            refreshUser();
        }
    }, [user, refreshUser]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <div className="flex items-center space-x-3">
                        {user.email_verified_at ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">✓ Verified</span>
                        ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">⚠ Unverified</span>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex h-[calc(100vh-5rem)] overflow-hidden flex gap-3">
                <div className="flex-[2] ">
                    <AdminSidebar />
                </div>

                <div className="flex-[14] bg-white p-6 rounded-lg shadow">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
