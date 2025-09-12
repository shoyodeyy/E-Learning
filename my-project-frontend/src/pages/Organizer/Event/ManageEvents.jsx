import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2, Eye, Settings, Calendar, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../../../services/http.jsx";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext.jsx";

// Event Card Component
function EventCard({ event, onDelete }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Event Image */}
            <div className="relative">
                <img src={`http://localhost:8000${event.bannerImage}`} alt={event.title} className="w-full h-48 object-cover" />
                <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-xs font-medium text-white rounded ${event.statusColor}`}>{event.status}</span>
                </div>
                <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs font-medium text-white rounded ${event.slotsColor}`}>{event.slots}</span>
                </div>
            </div>

            {/* Event Details */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{event.date}</p>
                <p className="text-sm text-gray-600 mb-4">{event.location}</p>

                {/* Action Buttons */}
                {event.status !== "pending_delete" ? (
                    <div className="flex items-center space-x-2">
                        <Link
                            to={`/organizer/update-event/${event.eventId}`}
                            className="cursor-pointer p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <Edit size={16} />
                        </Link>
                        <button onClick={onDelete} className="cursor-pointer p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Trash2 size={16} />
                        </button>
                        <Link
                            to={`/organizer/event-detail/${event.eventId}`}
                            className="cursor-pointer flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors text-center"
                        >
                            View Details
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <Link
                            to={`/organizer/update-event/${event.eventId}`}
                            className={`p-2 text-gray-400 transition-colors ${
                                event.status === "pending_delete"
                                    ? "cursor-not-allowed opacity-50 pointer-events-none"
                                    : "cursor-pointer hover:text-gray-600"
                            }`}
                        >
                            <Edit size={16} />
                        </Link>
                        <button
                            disabled={event.status === "pending_delete"}
                            onClick={onDelete}
                            className={`p-2 transition-colors ${
                                event.status === "pending_delete"
                                    ? "cursor-not-allowed opacity-50 text-gray-400"
                                    : "cursor-pointer text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            <Trash2 size={16} />
                        </button>
                        <Link
                            to={`/organizer/event-detail/${event.eventId}`}
                            className="cursor-pointer flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors text-center"
                        >
                            View Details
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

// Pagination Component
function Pagination({ pagination, setCurrentPage }) {
    if (!pagination || !pagination.links || pagination.last_page <= 1) {
        return null;
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="flex items-center justify-center space-x-2 mt-8">
            {/* Preview button */}
            <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                className="cursor-pointer px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                disabled={pagination.current_page === 1}
            >
                ← Previous
            </button>

            {/* Display page number */}
            {pagination.links.map((link, index) => {
                if (link.label === "&laquo; Previous" || link.label === "Next &raquo;") {
                    return null;
                }

                return (
                    <button
                        key={index}
                        onClick={() => handlePageChange(link.label)}
                        className={`cursor-pointer w-8 h-8 rounded text-sm font-medium ${
                            link.active ? "bg-purple-600 text-white" : "text-gray-600 hover:text-gray-900"
                        }`}
                        disabled={link.active}
                    >
                        {link.label}
                    </button>
                );
            })}

            {/* Next button */}
            <button
                onClick={() => setCurrentPage(pagination.current_page + 1)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                disabled={pagination.current_page === pagination.last_page}
            >
                Next →
            </button>
        </div>
    );
}

// Main Layout Component
export default function ManageEventsLayout() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const { token } = useAuth();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});

    async function fetchEvents(pageNum = 1) {
        setLoading(true);

        try {
            const res = await axios.get(`${apiUrl}/events?page=${pageNum}`);
            setEvents(res.data.data || []);
            setPagination(res.data.meta);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEvents(currentPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    async function handleDelete(eventId) {
        const confirmed = window.confirm("Are you sure you want to delete this event?");
        if (!confirmed) return;

        try {
            await axios.delete(`${apiUrl}/events/${eventId}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            alert("Event deleted successfully!");

            // Refresh lại list sau khi xóa
            fetchEvents(currentPage);
        } catch (error) {
            console.error("Failed to delete event:", error);

            if (error.response) {
                alert(error.response.data.message || "Failed to delete event.");
            } else {
                alert("Something went wrong.");
            }
        }
    }

    console.log(events);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Main Content */}
            <div className="flex-1">
                <main className="p-4">
                    {/* Header Actions */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                        <h2 className="text-xl font-semibold text-gray-800">Manage Events</h2>

                        <div className="flex items-center gap-3">
                            {/* Search box */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 size-4" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            {/* Create Event Button */}
                            <button
                                onClick={() => navigate("/organizer/create-event")}
                                className="cursor-pointer btn-gradient flex items-center !py-2 px-4 gap-2"
                            >
                                <Plus size={16} />
                                <span>Create Event</span>
                            </button>
                        </div>
                    </div>

                    {/* Event List */}
                    {loading && <p>Loading events...</p>}
                    {!loading && events.length === 0 && <p>No events found.</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events
                            .filter(
                                (event) =>
                                    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    event.venue.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((event) => (
                                <EventCard key={event.eventId} event={event} onDelete={() => handleDelete(event.eventId)} />
                            ))}
                    </div>

                    <Pagination pagination={pagination} setCurrentPage={setCurrentPage} />
                </main>
            </div>
        </div>
    );
}
