import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

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
                    <h1 className="text-xl font-bold">Instructor Dashboard</h1>
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

            <main className="max-w-7xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-bold">Instructor Controls</h2>
                    <p className="mt-2 text-gray-600">Create and manage your courses here.</p>
                </div>
            </main>
        </div>
    );
}
