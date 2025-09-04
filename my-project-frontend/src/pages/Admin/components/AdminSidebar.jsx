import { Link } from "react-router-dom"
import { User, LayoutDashboard, BookOpen, KeyRound, LogOut, Ticket } from "lucide-react"

import { useAuth } from "../../../context/AuthContext.jsx"

const AdminSidebar = ({ isCollapsed = false, setIsMobileSidebarOpen }) => {
    const { logout } = useAuth()

    const handleLogout = (e) => {
        e.preventDefault()
        const confirmed = window.confirm("Are you sure you want to log out?")
        if (confirmed) {
            logout()
        }
    }

    const handleLinkClick = () => {
        if (window.innerWidth < 768 && setIsMobileSidebarOpen) {
            setIsMobileSidebarOpen(false)
        }
    }

    return (
        <aside
            className={`
            ${isCollapsed ? "w-38 lg:w-20" : "w-38 lg:w-64"} 
            min-h-screen bg-purple-700 text-white flex flex-col shadow-lg transition-all duration-300 ease-in-out
        `}
        >
            <div className="flex-row px-2 lg:px-4 py-4">
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/admin/dashboard"
                            onClick={handleLinkClick}
                            className={`
                                flex items-center gap-2 lg:gap-3 px-3 py-2 rounded-lg hover:bg-purple-600 transition
                                ${isCollapsed ? "lg:justify-center" : ""}
                            `}
                            title={isCollapsed ? "Dashboard" : ""}
                        >
                            <LayoutDashboard size={18} className="flex-shrink-0" />
                            <span className={isCollapsed ? "lg:hidden" : ""}>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/course"
                            onClick={handleLinkClick}
                            className={`
                                flex items-center gap-2 lg:gap-3 px-3 py-2 rounded-lg hover:bg-purple-600 transition
                                ${isCollapsed ? "lg:justify-center" : ""}
                            `}
                            title={isCollapsed ? "Course" : ""}
                        >
                            <BookOpen size={18} className="flex-shrink-0" />
                            <span className={isCollapsed ? "lg:hidden" : ""}>Course</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/user"
                            onClick={handleLinkClick}
                            className={`
                                flex items-center gap-2 lg:gap-3 px-3 py-2 rounded-lg hover:bg-purple-600 transition
                                ${isCollapsed ? "lg:justify-center" : ""}
                            `}
                            title={isCollapsed ? "User" : ""}
                        >
                            <User size={18} className="flex-shrink-0" />
                            <span className={isCollapsed ? "lg:hidden" : ""}>User</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/vouchers"
                            onClick={handleLinkClick}
                            className={`
                                flex items-center gap-2 lg:gap-3 px-3 py-2 rounded-lg hover:bg-purple-600 transition
                                ${isCollapsed ? "lg:justify-center" : ""}
                            `}
                            title={isCollapsed ? "Voucher" : ""}
                        >
                            <Ticket size={18} className="flex-shrink-0" />
                            <span className={isCollapsed ? "lg:hidden" : ""}>Voucher</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/change-password"
                            onClick={handleLinkClick}
                            className={`
                                flex items-center gap-2 lg:gap-3 px-3 py-2 rounded-lg hover:bg-purple-600 transition
                                ${isCollapsed ? "lg:justify-center" : ""}
                            `}
                            title={isCollapsed ? "Change Password" : ""}
                        >
                            <KeyRound size={18} className="flex-shrink-0" />
                            <span className={isCollapsed ? "lg:hidden" : ""}>Change Password</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="p-4 border-t border-purple-600">
                <button
                    onClick={handleLogout}
                    className={`
                        flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer
                        ${isCollapsed ? "lg:justify-center" : ""}
                    `}
                    title={isCollapsed ? "Logout" : ""}
                >
                    <LogOut size={18} className="flex-shrink-0" />
                    <span className={isCollapsed ? "lg:hidden" : ""}>Logout</span>
                </button>
            </div>
        </aside>
    )
}

export default AdminSidebar