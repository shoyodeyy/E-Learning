import { Link, useLocation } from "react-router-dom";
import Avatar from "./Avatar.jsx";

export default function ProfileSidebar({ user }) {
    const location = useLocation();

    const menuItems = [
        { name: "Public profile", path: "/profile" },
        { name: "Payment methods", path: "/profile/payment" },
        { name: "Notifications", path: "/profile/notifications" },
    ];

    return (
        <aside className="col-span-3 bg-white shadow rounded p-6">
            <div className="flex flex-col items-center">
                <Avatar name={user.name} avatarUrl={user.avatarUrl} size={96} />
                <h2 className="mt-4 font-semibold text-lg">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.role}</p>
            </div>

            <nav className="mt-6 space-y-2 w-full">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`block px-3 py-2 rounded hover:bg-purple-50 ${
                            location.pathname === item.path
                                ? "bg-purple-100 font-semibold text-purple-700"
                                : "text-gray-700"
                        }`}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
