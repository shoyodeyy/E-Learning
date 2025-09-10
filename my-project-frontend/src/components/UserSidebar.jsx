import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function UserSidebar({ mobile = false }) {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { id: "dashboard", link: "/user/dashboard", label: "Dashboard", icon: "📊" },
        { id: "profile", link: "/user/profile", label: "Profile", icon: "👤" },
        { id: "registrations", link: "/user/registration", label: "My Registrations", icon: "📋" },
    ];

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    // 👉 Mobile Bottom Navigation
    if (mobile) {
        return (
            <nav className="w-full bg-white border-t border-gray-200 shadow-md flex justify-around py-2 rounded-lg">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.link;
                    return (
                        <Link
                            key={item.id}
                            to={item.link}
                            className={`
                                flex flex-col items-center text-xs font-medium flex-1 py-1
                                ${isActive ? "text-purple-600" : "text-gray-500 hover:text-purple-600"}
                            `}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        );
    }

    // 👉 Desktop / Tablet Sidebar
    return (
        <aside
            className={`
                hidden lg:block
                ${isCollapsed ? "w-16" : "w-64"} 
                bg-white shadow-sm border-r border-gray-200 min-h-screen transition-all duration-300 ease-in-out
            `}
        >
            {/* Header with toggle button */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <button onClick={toggleSidebar} className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    {isCollapsed ? <ChevronRight size={20} className="text-gray-600" /> : <ChevronLeft size={20} className="text-gray-600" />}
                </button>
            </div>

            {/* Navigation */}
            <div className="p-4">
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.link;
                        return (
                            <Link
                                key={item.id}
                                to={item.link}
                                className={`
                                    w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors duration-200
                                    ${
                                        isActive
                                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                            : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                                    }
                                    ${isCollapsed ? "justify-center" : "space-x-3"}
                                `}
                            >
                                <span className="text-lg flex-shrink-0">{item.icon}</span>
                                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
