
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, LayoutDashboard, User, Book, CircleStar } from "lucide-react";


export default function UserSidebar({mobile = false}) {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        {
        id: "dashboard",
        link: "/user/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard
        },
        {id: "profile", link: "/user/profile", label: "Profile", icon: User},
        {
        id: "registrations",
        link: "/user/registration",
        label: "My Registrations",
        icon: Book
        },
        {
            id:"favorite",
            link:"/user/favorite",
            label: "Favorite Events",
            icon: CircleStar
        }
    ];

    useEffect(() => window.scrollTo(0, 0), []);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    // 👉 Mobile Bottom Navigation
    if (mobile) {
        return (<nav className="w-full bg-white border-t border-gray-200 shadow-md flex justify-around py-2 rounded-lg">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.link;
                    const Icon = item.icon;
                    return (<Link
                            key={item.id}
                            to={item.link}
                            className={`group flex gap-1 items-center transition-colors duration-200 ${isActive ? "text-purple-600" : "text-gray-600 hover:text-purple-600"}`}
                        >
                            <Icon size={20}
                                  className={`shrink-0 ${isActive ? "text-purple-600" : "text-gray-600 group-hover:text-purple-600"}`}/>
                            <span>{item.label}</span>
                        </Link>);
                })}
            </nav>);
    }

    // 👉 Desktop / Tablet Sidebar
    return (<aside
            className={`
                hidden lg:block
                ${isCollapsed ? "w-16" : "w-64"} 
                bg-white shadow-sm border-r border-gray-200 min-h-screen transition-all duration-300 ease-in-out
            `}
        >
            {/* Header with toggle button */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <button onClick={toggleSidebar}
                        className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    {isCollapsed ? <ChevronRight size={20} className="text-gray-600"/> :
                        <ChevronLeft size={20} className="text-gray-600"/>}
                </button>
            </div>

            {/* Navigation */}
            <div className="p-4">
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.link;
                        const Icon = item.icon;
                        return (<Link
                                key={item.id}
                                to={item.link}
                                className={`
                                    group relative
                                    w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors duration-200
                                    ${isActive ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"}
                                    ${isCollapsed ? "justify-center" : "space-x-3"}
                                `}
                            >
                                <Icon size={20} className="shrink-0"/>

                                {!isCollapsed && <span className="font-medium">{item.label}</span>}

                                {isCollapsed && (<span
                                                        className="absolute left-full ml-2 px-2 py-1 rounded-md shadow-md
                                                            bg-gray-800 text-white text-xs whitespace-nowrap hidden group-hover:block z-100"
                                                    >
                                        {item.label}
                                    </span>)}
                            </Link>);
                    })}
                </nav>
            </div>
        </aside>);
}
