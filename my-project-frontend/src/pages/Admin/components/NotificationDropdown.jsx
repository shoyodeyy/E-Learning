import { Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import api from "../../../api/axios.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function NotificationDropdown() {
    const { user, token } = useAuth();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (open && user) {
            fetchNotifications();
        }
    }, [open, user]);
    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setNotifications(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (error) {
            console.error("Failed to load notifications", error);
            setNotifications([]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    console.log(notifications)

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition"
            >
                <Bell className="w-6 h-6 text-gray-700" />
                {notifications.some((n) => !n.is_read) && (
                    <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b font-semibold text-gray-700">
                        Notifications
                    </div>
                    <ul className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <li
                                    key={n.notification_id}
                                    onClick={async () => {
                                        try {
                                            await api.patch(
                                                `/notifications/${n.notification_id}/read`,
                                                {},
                                                {
                                                    headers: {
                                                        Authorization: `Bearer ${token}`,
                                                    },
                                                }
                                            );
                                            navigate(`/admin/approvals/events/${n.event_id}`);
                                        } catch (err) {
                                            console.error("Failed to mark as read", err);
                                            navigate(
                                                `/admin/approvals/events/${n.event_id}`
                                            );
                                        }
                                    }}
                                    className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 ${
                                        n.is_read
                                            ? "text-gray-500"
                                            : "text-gray-800 font-medium"
                                    }`}
                                >
                                    {n.message}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-3 text-sm text-gray-500">
                                No notifications
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
