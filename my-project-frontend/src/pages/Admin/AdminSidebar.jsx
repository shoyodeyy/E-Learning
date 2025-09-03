import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext.jsx";
import {
    User,
    LayoutDashboard,
    BookOpen,
    KeyRound,
    LogOut, Ticket
} from "lucide-react"; // icon từ lucide-react (tailwind-friendly)

const AdminSidebar = ({ setIsSidebarVisible }) => {
    const { logout } = useAuth();

    const handleLogout = (e) => {
        e.preventDefault();
        const confirmed = window.confirm('Are you sure you want to log out?');
        if (confirmed) {
            logout();
        }
    };

    const handleLinkClick = () => {
        if (window.innerWidth < 765) {
            setIsSidebarVisible(false);
        }
    };

    return (
        <aside className="w-64 min-h-screen bg-purple-700 text-white flex flex-col shadow-lg">
            <div className="flex-1 p-4">
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/admin/dashboard"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-600 transition"
                        >
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/course"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-600 transition"
                        >
                            <BookOpen size={18} />
                            <span>Course</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/user"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-600 transition"
                        >
                            <User size={18} />
                            <span>User</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/vouchers"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-600 transition"
                        >
                            <Ticket size={18} />
                            <span>Voucher</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/change-password"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-600 transition"
                        >
                            <KeyRound size={18} />
                            <span>Change Password</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="p-4 border-t border-purple-600">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
