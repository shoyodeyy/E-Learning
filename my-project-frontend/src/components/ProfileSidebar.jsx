import { Link, useLocation } from "react-router-dom";
import Avatar from "./Avatar.jsx";

export default function ProfileSidebar({ user }) {
    const location = useLocation();

    const menuItems = [

        { name: "Public profile", path: "/profile" },
        { name: "Account security", path: "/profile/security" },
        { name: "Payment methods", path: "/profile/payment" },
        { name: "Notifications", path: "/profile/notifications" },
    ];

    return (
        <aside className="w-full md:w-64 bg-white shadow rounded p-6">
            {/* Sidebar content */}
            <div>
                <div className="flex flex-col items-center mb-6">
                    <Avatar name={user.name} avatarUrl={user.avatarUrl} size={96} />
                    <h2 className="mt-4 font-semibold text-lg">{user.name}</h2>
                    <p className="text-gray-500 text-sm">{user.role}</p>
                </div>

                <nav className="space-y-1 w-full">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`block px-3 py-2 rounded hover:bg-purple-50 
                            `}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
}
