import { Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import api from "../../../api/axios.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function NotificationDropdown() {
    const { user, token } = useAuth();
    const [open, setOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showOnLogin, setShowOnLogin] = useState(false);
    const hasShownOnLogin = useRef(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = Array.isArray(res.data.data) ? res.data.data : [];
            setNotifications(data);
            setUnreadCount(data.filter((n) => !n.is_read).length);
        } catch (error) {
            console.error("Failed to load notifications", error);
            setNotifications([]);
        }
    };

    useEffect(() => {
        if (!user) return;

        const loadNotifications = async () => {
            await fetchNotifications();
        };

        loadNotifications();
        const interval = setInterval(fetchNotifications, 30000); //30s api 1 lan
        return () => clearInterval(interval);
    }, [user]);

    // Hiển thị notification tự động chỉ 1 lần khi đăng nhập và có thông báo mới
    useEffect(() => {
        if (!user || hasShownOnLogin.current || unreadCount === 0) return;

        hasShownOnLogin.current = true;
        setShowOnLogin(true);
        const hideTimer = setTimeout(() => {
            setShowOnLogin(false);
        }, 3000);

        return () => clearTimeout(hideTimer);
    }, [user, unreadCount]);


    const closeDropdown = () => {
        setIsClosing(true);
        setTimeout(() => {
            setOpen(false);
            setShowOnLogin(false);
            setIsClosing(false);
        }, 200);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 🔹 Mark notification as read
    const handleClickNotification = async (n) => {
        try {
            await api.post(
                `/notifications/${n.notification_id}/read`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setNotifications((prev) =>
                prev.map((item) =>
                    item.notification_id === n.notification_id
                        ? { ...item, is_read: 1 }
                        : item
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read", err);
        } finally {
            closeDropdown();
            if (n.event_id) {
                // Nếu là admin và notification về event pending → chuyển đến trang xét duyệt
                if (user?.role === 'admin' && n.type === 'event_pending') {
                    navigate('/admin/approval/event');
                } else {
                    // Organizer → chuyển đến event detail
                    navigate(`/organizer/event-detail/${n.event_id}`);
                }
            }
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    if (open) {
                        closeDropdown();
                    } else {
                        setOpen(true);
                        setShowOnLogin(false);
                    }
                }}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
                <Bell className="w-6 h-6 text-gray-700" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </button>

            {(open || showOnLogin) && (
                <div 
                    className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    style={{
                        transformOrigin: 'top right',
                        animation: isClosing ? 'scaleOut 0.2s ease-in forwards' : 'scaleIn 0.2s ease-out'
                    }}
                >
                    <div className="p-3 border-b font-semibold text-gray-700 flex justify-between items-center">
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={async () => {
                                    await api.post("/notifications/read-all", {}, {
                                        headers: { Authorization: `Bearer ${token}` },
                                    });
                                    setNotifications((prev) =>
                                        prev.map((n) => ({ ...n, is_read: 1 }))
                                    );
                                    setUnreadCount(0);
                                }}
                                className="text-xs text-purple-600 hover:underline"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <ul className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {notifications.length > 0 ? (
                            notifications.map((n) => (
                                <li
                                    key={n.notification_id}
                                    onClick={() => handleClickNotification(n)}
                                    className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 ${
                                        n.is_read
                                            ? "text-gray-500"
                                            : "text-gray-800 font-medium bg-purple-50"
                                    }`}
                                >
                                    {n.message}
                                    <div className="text-xs text-gray-400">
                                        {new Date(n.created_at).toLocaleString()}
                                    </div>
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
