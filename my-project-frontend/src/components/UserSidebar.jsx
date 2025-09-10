import { Link, useLocation } from "react-router-dom";

export default function UserSidebar() {
    const location = useLocation();

    const menuItems = [
        { id: "dashboard", link: "/dashboard", label: "Dashboard", icon: "📊" },
        { id: "registrations", link: "/registration", label: "My Registrations", icon: "📋" },
    ];

    return (
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
            <div className="p-6">
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.link;

                        return (
                            <Link
                                to={item.link}
                                key={item.id}
                                className={`cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                                    isActive
                                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                        : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
