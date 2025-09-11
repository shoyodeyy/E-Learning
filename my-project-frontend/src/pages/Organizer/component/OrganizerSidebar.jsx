import { Link } from "react-router-dom"
import {
    User,
    LayoutDashboard,
    KeyRound,
    ChevronLeft,
    ChevronRight, BookmarkPlus,
} from "lucide-react"

const OrganizerSidebar = ({
                          isCollapsed = false,
                          setIsCollapsed,
                          setIsMobileSidebarOpen,
                          horizontal = false,
                      }) => {
    const menuItems = [
        { to: "", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { to: "events", icon: <BookmarkPlus size={20}/> , label: "Create Events" },
        { to: "user", icon: <User size={20} />, label: "Events List" },
        { to: "change-password", icon: <KeyRound size={20} />, label: "Change Password" },
    ]

    const handleLinkClick = () => {
        if (window.innerWidth < 768 && setIsMobileSidebarOpen) {
            setIsMobileSidebarOpen(false)
        }
    }

    return (
        <aside
            className={`
                bg-purple-700 text-white shadow-lg
                ${horizontal
                ? "w-full flex flex-row justify-around items-center py-2"
                : `${isCollapsed ? "w-20" : "w-64"} h-full flex flex-col`}
                transition-all duration-300 ease-in-out
            `}
            style={!horizontal ? { minHeight: "100vh" } : {}}
        >
            {!horizontal && (
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex items-center justify-center w-full py-2 hover:bg-purple-600 transition"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            )}

            <ul className={`${horizontal ? "flex flex-row gap-4" : "flex-1 p-4 space-y-2"}`}>
                {menuItems.map((item, idx) => (
                    <li key={idx}>
                        <Link
                            to={item.to}
                            onClick={handleLinkClick}
                            className={`
                                flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-600 transition
                                ${isCollapsed || horizontal ? "justify-center" : ""}
                            `}
                            title={isCollapsed || horizontal ? item.label : ""}
                        >
                            {item.icon}
                            {!isCollapsed && !horizontal && <span>{item.label}</span>}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

export default OrganizerSidebar
