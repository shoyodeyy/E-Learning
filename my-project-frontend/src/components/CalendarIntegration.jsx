import { useState } from "react";
import api from "../api/axios";
import { CalendarDays, CalendarPlus } from "lucide-react";
import { toast } from "react-toastify";

export default function CalendarIntegration({ eventId, variant = "floating" }) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await api.get(`/events/${eventId}/calendar`);
            if (res.data?.google_url) {
                window.open(res.data.google_url, "_blank");
            } else {
                toast.error("Google Calendar link not found.");
            }
        } catch (err) {
            console.error("Error fetching calendar link:", err);
            toast.error("Unable to create calendar link.");
        } finally {
            setLoading(false);
        }
    };

    const Trigger = () => {
        if (variant === "inline") {
            return (
                <button
                    onClick={handleClick}
                    disabled={loading}
                    className="cursor-pointer flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-lg border border-gray-200 transition-all duration-200 disabled:opacity-50"
                >
                    <CalendarPlus className="w-5 h-5" />
                    <span>{loading ? "Loading..." : "Add to Calendar"}</span>
                </button>
            );
        }
        return (
            <button
                onClick={handleClick}
                disabled={loading}
                className="cursor-pointer fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center rounded-full shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 z-40"
            >
                {loading ? <span className="text-xs">...</span> : <CalendarDays className="w-6 h-6" />}
            </button>
        );
    };

    return <Trigger />;
}
