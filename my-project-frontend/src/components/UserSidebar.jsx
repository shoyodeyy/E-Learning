import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, User, BookOpen, Calendar, Settings, ChevronLeft, ChevronRight } from "lucide-react";

export default function ExpandableSidebar() {
    const [isExpanded, setIsExpanded] = useState(true);
    const location = useLocation();

    const menuItems = [
        { id: "dashboard", link: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "profile", link: "/profile", label: "Profile", icon: User },
        { id: "registrations", link: "/registration", label: "My Registrations", icon: BookOpen },

    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:flex flex-col bg-white shadow-lg border-r border-gray-200 min-h-screen transition-all duration-300 ${
                    isExpanded ? "w-64" : "w-16"
                }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {isExpanded && (
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">PP</span>
                                </div>
                                <span className="font-bold text-blue-600 text-lg">ParticipantPortal</span>
                            </div>
                        )}
                        <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                            {isExpanded ? <ChevronLeft size={20} className="text-gray-600" /> : <ChevronRight size={20} className="text-gray-600" />}
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <div className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.link;
                            const IconComponent = item.icon;

                            return (
                                <div key={item.id} className="relative group">
                                    <Link
                                        to={item.link}
                                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                    >
                                        <IconComponent size={20} className="flex-shrink-0" />
                                        {isExpanded && <span className="font-medium truncate">{item.label}</span>}
                                    </Link>

                                    {/* Tooltip for collapsed state */}
                                    {!isExpanded && (
                                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </nav>
            </aside>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <nav className="flex justify-around py-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.link;
                        const IconComponent = item.icon;

                        return (
                            <Link
                                key={item.id}
                                to={item.link}
                                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                                    isActive ? "text-blue-600" : "text-gray-600"
                                }`}
                            >
                                <IconComponent size={20} />
                                <span className="text-xs mt-1 font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
