import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Search, Download, Calendar, Users, CheckCircle, Clock, XCircle, Filter, MoreHorizontal, Mail, Phone } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axios";
import RegistrationStats from "./components/RegistrationStats";
import RegistrationFilters from "./components/RegistrationFilters";
import RegistrationListTable from "./components/RegistrationListTable";

const ManageEventRegistrations = () => {
    const { eventId } = useParams();
    const { token, user } = useAuth();

    const [event, setEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [filteredRegistrations, setFilteredRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter states
    const [filters, setFilters] = useState({
        status: "all", // all, confirmed, waitlist, cancelled
        attendance: "all", // all, attended, not_attended
    });

    const [stats, setStats] = useState({
        total: 0,
        confirmed: 0,
        waitlist: 0,
        cancelled: 0,
        attended: 0,
        attendanceRate: 0,
    });

    useEffect(() => {
        fetchEventDetails();
        fetchRegistrations();
    }, [eventId]);

    useEffect(() => {
        applyFilters();
    }, [registrations, searchTerm, filters]);

    const fetchEventDetails = async () => {
        try {
            const response = await api.get(`/events/${eventId}`);

            // Handle different possible response structures
            let eventData = response.data;
            if (response.data.data) {
                eventData = response.data.data;
            } else if (response.data.organizer_events && response.data.organizer_events.length > 0) {
                eventData = response.data.organizer_events[0];
            }

            setEvent(eventData);
        } catch (error) {
            console.error("Failed to fetch event details:", error);
            toast.error("Failed to load event details");
        }
    };

    const fetchRegistrations = async () => {
        try {
            setLoading(true);

            // Try multiple possible API endpoints
            let registrationData = [];
            let response;

            try {
                // First try the expected endpoint
                response = await api.get(`/events/${eventId}/registrations`);

                // Handle different response structures
                if (Array.isArray(response.data)) {
                    registrationData = response.data;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    registrationData = response.data.data;
                } else if (response.data.registrations && Array.isArray(response.data.registrations)) {
                    registrationData = response.data.registrations;
                }
            } catch (firstError) {
                try {
                    // Try alternative endpoint structure
                    response = await api.get(`/organizer/events/${eventId}/registrations`);

                    if (Array.isArray(response.data)) {
                        registrationData = response.data;
                    } else if (response.data.data && Array.isArray(response.data.data)) {
                        registrationData = response.data.data;
                    } else if (response.data.registrations && Array.isArray(response.data.registrations)) {
                        registrationData = response.data.registrations;
                    }
                } catch (secondError) {
                    try {
                        // Try getting all registrations and filter by event
                        response = await api.get(`/registrations?event_id=${eventId}`);

                        if (Array.isArray(response.data)) {
                            registrationData = response.data;
                        } else if (response.data.data && Array.isArray(response.data.data)) {
                            registrationData = response.data.data;
                        }
                    } catch (thirdError) {
                        throw firstError; // Throw the original error
                    }
                }
            }

            // Ensure registrationData is an array
            if (!Array.isArray(registrationData)) {
                registrationData = [];
            }

            // Process registrations data
            const registrationsWithSeats = registrationData.map((reg) => {
                return {
                    registration_id: reg.registration_id || reg.id,
                    user: reg.user || {
                        name: reg.user_name || "Unknown",
                        email: reg.user_email || "unknown@email.com",
                    },
                    status: reg.status || "pending",
                    attendance_status: reg.attendance_status || false,
                    registered_on: reg.registered_on || reg.created_at,
                    seats: reg.seats || [],
                };
            });

            setRegistrations(registrationsWithSeats);
            calculateStats(registrationsWithSeats);
        } catch (error) {
            console.error("Failed to fetch registrations:", error);

            // Provide more specific error messages
            if (error.response?.status === 401) {
                toast.error("Authentication failed. Please login again.");
            } else if (error.response?.status === 403) {
                toast.error("You don't have permission to view this event's registrations.");
            } else if (error.response?.status === 404) {
                toast.error("Event registrations not found. This might be because no one has registered yet.");
            } else {
                toast.error(`Failed to load registrations: ${error.response?.data?.message || error.message || "Unknown error"}`);
            }

            // Set empty array to show the "no registrations" state properly
            setRegistrations([]);
            calculateStats([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const total = data.length;
        const confirmed = data.filter((r) => r.status === "confirmed").length;
        const waitlist = data.filter((r) => r.status === "waitlist").length;
        const cancelled = data.filter((r) => r.status === "cancelled").length;
        const attended = data.filter((r) => r.attendance_status === true).length;
        const attendanceRate = confirmed > 0 ? (attended / confirmed) * 100 : 0;

        setStats({
            total,
            confirmed,
            waitlist,
            cancelled,
            attended,
            attendanceRate: Math.round(attendanceRate),
        });
    };

    const applyFilters = () => {
        let filtered = [...registrations];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter((registration) => {
                const userName = registration.user?.name?.toLowerCase() || "";
                const userEmail = registration.user?.email?.toLowerCase() || "";
                const search = searchTerm.toLowerCase();
                return userName.includes(search) || userEmail.includes(search);
            });
        }

        // Status filter
        if (filters.status !== "all") {
            filtered = filtered.filter((registration) => registration.status === filters.status);
        }

        // Attendance filter
        if (filters.attendance !== "all") {
            if (filters.attendance === "attended") {
                filtered = filtered.filter((registration) => registration.attendance_status === true);
            } else if (filters.attendance === "not_attended") {
                filtered = filtered.filter((registration) => registration.attendance_status === false);
            }
        }

        setFilteredRegistrations(filtered);
    };

    const handleAttendanceToggle = async (registrationId, currentStatus) => {
        try {
            // Changed from PATCH to POST method as required by the backend
            await api.post(`/registrations/${registrationId}/attendance`, {
                attendance_status: !currentStatus,
            });

            // Update local state
            const updatedRegistrations = registrations.map((reg) =>
                reg.registration_id === registrationId ? { ...reg, attendance_status: !currentStatus } : reg
            );

            setRegistrations(updatedRegistrations);
            calculateStats(updatedRegistrations);
            toast.success("Attendance status updated");
        } catch (error) {
            console.error("Failed to update attendance:", error);
            toast.error("Failed to update attendance status");
        }
    };

    const exportToCSV = () => {
        if (filteredRegistrations.length === 0) {
            toast.warning("No registrations to export");
            return;
        }

        const headers = ["Name", "Email", "Registration Date", "Status", "Attendance"];
        const csvData = filteredRegistrations.map((reg) => [
            reg.user?.name || "Unknown",
            reg.user?.email || "Unknown",
            reg.registered_on ? new Date(reg.registered_on).toLocaleDateString() : "Unknown",
            reg.status || "Unknown",
            reg.attendance_status ? "Attended" : "Not Attended",
        ]);

        const csvContent = [headers, ...csvData].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${event?.title || "event"}_registrations.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading registrations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center space-x-4">
                            <Link
                                to={`/organizer/event-detail/${eventId}`}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Event Registrations</h1>
                                <p className="text-gray-600">{event?.title}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={exportToCSV}
                                disabled={filteredRegistrations.length === 0}
                                className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <Download className="w-4 h-4" />
                                <span>Export CSV</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Event Info Card */}
                {event && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="flex items-start space-x-4">
                            <img
                                src={event.bannerImage ? `http://localhost:8000${event.bannerImage}` : "/placeholder.svg"}
                                alt={event.title}
                                className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(event.start_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Users className="w-4 h-4" />
                                        <span>Max: {event.maxParticipants || "Unlimited"} participants</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                event.status === "approved"
                                                    ? "bg-green-100 text-green-800"
                                                    : event.status === "completed"
                                                    ? "bg-gray-100 text-gray-800"
                                                    : event.status === "pending_create"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {event.status?.replace("_", " ")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Statistics */}
                <RegistrationStats stats={stats} />

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filters */}
                        <RegistrationFilters filters={filters} onFilterChange={setFilters} />
                    </div>
                </div>

                {/* Registration List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Registration List ({filteredRegistrations.length})</h2>
                            {registrations.length === 0 && !loading && (
                                <div className="text-sm text-gray-500">No registrations found for this event</div>
                            )}
                        </div>
                    </div>

                    {registrations.length === 0 && !loading ? (
                        <div className="px-6 py-12 text-center">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Registrations Yet</h3>
                            <p className="text-gray-600 mb-4">No one has registered for this event yet.</p>
                        </div>
                    ) : (
                        <RegistrationListTable registrations={filteredRegistrations} onAttendanceToggle={handleAttendanceToggle} loading={loading} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageEventRegistrations;
