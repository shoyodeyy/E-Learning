import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { apiUrl } from "../../services/http.jsx";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import dayjs from "dayjs";
import {Eye, Pencil, Trash2} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

// Sample data cho chart (giữ nguyên)
const userRegistrationData = [
    { date: "Aug 12", desktop: 300, mobile: 200 },
    { date: "Aug 18", desktop: 450, mobile: 350 },
    { date: "Aug 23", desktop: 320, mobile: 280 },
    { date: "Aug 24", desktop: 380, mobile: 400 },
    { date: "Sep 7", desktop: 500, mobile: 450 },
    { date: "Sep 8", desktop: 420, mobile: 380 },
    { date: "Sep 9", desktop: 480, mobile: 420 },
];

const eventComparisonData = [
    { month: "April 2023", online: 14, offline: 21, hybrid: 18 },
    { month: "May 2023", online: 18, offline: 25, hybrid: 22 },
    { month: "June 2023", online: 22, offline: 28, hybrid: 26 },
];

// Stats Card Component
const StatsCard = ({ title, value, subtitle, icon, color }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
            <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
            >
                <span className="text-white text-xl">{icon}</span>
            </div>
        </div>
    </div>
);

// Chart Card Component
const ChartCard = ({ title, children }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        {children}
    </div>
);

// ✅ Event List Component (đã thay bằng dữ liệu thật)
const EventList = ({ events }) => {
    if (!events?.length)
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-gray-500 text-center">
                No recent events found.
            </div>
        );

    const navigate = useNavigate();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const { token } = useAuth();

    const handleDelete = (eventId) => {
        setSelectedEventId(eventId);
        setConfirmOpen(true);
    };

    async function confirmDelete() {
        if (!selectedEventId) return;
        try {
            await axios.delete(`${apiUrl}/events/${selectedEventId}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            toast.success("Event deleted successfully!");
            // reload list sau khi xóa (nếu EventList có fetch function)
            window.location.reload(); // hoặc gọi lại API fetch
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete event.");
        } finally {
            setConfirmOpen(false);
            setSelectedEventId(null);
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Recent Events
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                    The 5 most recently created or updated events.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">
                                Title
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">
                                Date
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">
                                Status
                            </th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-600 text-sm">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {events.map((event) => (
                            <tr
                                key={event.event_id}
                                className="border-b border-gray-50 hover:bg-purple-50 transition-colors"
                            >
                                <td className="py-4 px-4 font-medium text-gray-900">
                                    {event.title}
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-600">
                                    {dayjs(event.start_at).format(
                                        "MMM D, YYYY HH:mm"
                                    )}
                                </td>
                                <td className="py-4 px-4">
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                                                event.status === "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : event.status ===
                                                    "pending_create"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : event.status ===
                                                        "completed"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {event.status}
                                        </span>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button onClick={() => navigate(`/organizer/event-detail/${event.event_id}`)} className="p-2 cursor-pointer text-green-400 hover:text-green-500 transition-colors duration-200">
                                            <Eye className="size-5"/>
                                        </button>
                                        <button onClick={() => navigate(`/organizer/update-event/${event.event_id}`)} className="p-2 cursor-pointer text-yellow-400 hover:text-yellow-500 transition-colors duration-200">
                                            <Pencil className="size-5"/>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event.event_id)}
                                            disabled={['pending_delete', 'completed'].includes(event.status)}
                                            className={`p-2 rounded-lg cursor-pointer ${
                                                ['pending_delete', 'completed'].includes(event.status)
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                                            }`}
                                        >
                                            <Trash2 className="size-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                message="Are you sure you want to delete this event?"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setConfirmOpen(false);
                    setSelectedEventId(null);
                }}
            />
        </div>
    );
};

const Overview = () => {
    const [dashboard, setDashboard] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        axios
            .get(`${apiUrl}/organizer/dashboard`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            })
            .then((res) => setDashboard(res.data))
            .catch(console.error);
    }, [token]);

    if (!dashboard) return <p>Loading...</p>;

    const { stats, recent_events } = dashboard;

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Overview
                </h1>
                <p className="text-gray-600">
                    Welcome back! Here’s an overview of your activities.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                    title="Total Events"
                    value={stats?.total_events ?? 0}
                    subtitle="+3.1% compared to last month"
                    icon="📅"
                    color="bg-gradient-to-r from-blue-500 to-cyan-500"
                />
                <StatsCard
                    title="Total Registrations"
                    value={stats?.total_registrations ?? 0}
                    subtitle="+15.3% compared to last month"
                    icon="👥"
                    color="bg-gradient-to-r from-purple-500 to-pink-500"
                />
                <StatsCard
                    title="Approved Events"
                    value={stats?.status_counts?.approved ?? 0}
                    subtitle="+5.2% approved"
                    icon="✅"
                    color="bg-gradient-to-r from-green-500 to-emerald-500"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartCard title="User Registrations Over Time">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userRegistrationData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 12,
                                        fill: "#6b7280",
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 12,
                                        fill: "#6b7280",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="desktop"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{
                                        fill: "#8b5cf6",
                                        strokeWidth: 2,
                                        r: 4,
                                    }}
                                    name="Desktop"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="mobile"
                                    stroke="#ec4899"
                                    strokeWidth={3}
                                    dot={{
                                        fill: "#ec4899",
                                        strokeWidth: 2,
                                        r: 4,
                                    }}
                                    name="Mobile"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                <ChartCard title="Event Type Comparison">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={eventComparisonData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 12,
                                        fill: "#6b7280",
                                    }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 12,
                                        fill: "#6b7280",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="online"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{
                                        fill: "#10b981",
                                        strokeWidth: 2,
                                        r: 4,
                                    }}
                                    name="Online"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="offline"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{
                                        fill: "#3b82f6",
                                        strokeWidth: 2,
                                        r: 4,
                                    }}
                                    name="Offline"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="hybrid"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{
                                        fill: "#8b5cf6",
                                        strokeWidth: 2,
                                        r: 4,
                                    }}
                                    name="Hybrid"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            {/* Recent Events Table */}
            <EventList events={recent_events} />
        </div>
    );
};

export default Overview;
