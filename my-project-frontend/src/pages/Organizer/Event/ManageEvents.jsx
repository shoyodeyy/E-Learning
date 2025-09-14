import { useEffect, useState } from "react";
import { Search, Plus, Filter, Edit, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { apiUrl } from "../../../services/http.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import ConfirmDialog from "../../../components/ConfirmDialog.jsx";

function getStatusStyle(status) {
    switch (status) {
        case "pending_create":
            return { text: "Pending Create", color: "bg-yellow-500" };
        case "pending_update":
            return { text: "Pending Update", color: "bg-blue-500" };
        case "pending_delete":
            return { text: "Pending Delete", color: "bg-red-500" };
        case "approved":
            return { text: "Approved", color: "bg-green-500" };
        case "completed":
            return { text: "Completed", color: "bg-gray-500" };
        default:
            return { text: status, color: "bg-gray-400" };
    }
}

// Event Card Component
function EventCard({ event, onDelete }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            {/* Event Image */}
            <div className="relative">
                <img src={`http://localhost:8000${event.bannerImage}`} alt={event.title} className="w-full h-40 sm:h-48 object-cover" />
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                    {(() => {
                        const { text, color } = getStatusStyle(event.status);
                        return <span className={`px-2 sm:px-3 py-1 text-xs font-medium text-white rounded-full ${color} shadow-sm`}>{text}</span>;
                    })()}
                </div>
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    <span className={`px-2 py-1 text-xs font-medium text-white rounded shadow-sm ${event.slotsColor}`}>{event.slots}</span>
                </div>
            </div>

            {/* Event Details */}
            <div className="p-3 sm:p-5">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base sm:text-lg">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-1 font-medium">{event.date}</p>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 line-clamp-1">{event.location}</p>

                {/* Action Buttons */}
                {event.status !== "pending_delete" ? (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <Link
                            to={`/organizer/update-event/${event.eventId}`}
                            className="cursor-pointer p-1.5 sm:p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                        >
                            <Edit size={14} className="sm:w-4 sm:h-4" />
                        </Link>
                        <button
                            onClick={onDelete}
                            className="cursor-pointer p-1.5 sm:p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                            <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <Link
                            to={`/organizer/event-detail/${event.eventId}`}
                            className="cursor-pointer ml-2 sm:ml-5 flex-1 btn-gradient text-center shadow-sm text-xs sm:text-sm py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg"
                        >
                            <span className="hidden xs:inline">View Details</span>
                            <span className="xs:hidden">Details</span>
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <Link
                            to={`/organizer/update-event/${event.eventId}`}
                            className={`p-1.5 sm:p-2 transition-colors rounded-lg ${
                                event.status === "pending_delete"
                                    ? "cursor-not-allowed opacity-50 pointer-events-none text-gray-400"
                                    : "cursor-pointer hover:text-gray-600 text-gray-400"
                            }`}
                        >
                            <Edit size={14} className="sm:w-4 sm:h-4" />
                        </Link>
                        <button
                            disabled={event.status === "pending_delete"}
                            onClick={onDelete}
                            className={`p-1.5 sm:p-2 transition-colors rounded-lg ${
                                event.status === "pending_delete"
                                    ? "cursor-not-allowed opacity-50 text-gray-400"
                                    : "cursor-pointer text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <Link
                            to={`/organizer/event-detail/${event.eventId}`}
                            className="cursor-pointer flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors text-center ml-2 sm:ml-0"
                        >
                            <span className="hidden xs:inline">View Details</span>
                            <span className="xs:hidden">Details</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function Pagination({ pagination, setCurrentPage }) {
    if (!pagination || !pagination.links || pagination.last_page <= 1) {
        return null;
    }

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.last_page) {
            setCurrentPage(page);
        }
    };

    const isFirstPage = pagination.current_page === 1;
    const isLastPage = pagination.current_page === pagination.last_page;

    return (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-center mt-6 sm:mt-8">
            {/* Previous button */}
            <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={isFirstPage}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 w-full sm:w-auto justify-center ${
                    isFirstPage
                        ? "cursor-not-allowed opacity-50 text-gray-400 border-gray-200 bg-gray-50"
                        : "cursor-pointer text-gray-600 border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400"
                }`}
            >
                <ChevronLeft size={16} />
                <span className="hidden xs:inline">Previous</span>
                <span className="xs:hidden">Prev</span>
            </button>

            {/* Display page numbers */}
            <div className="flex items-center gap-1 sm:gap-2 space-x-1 overflow-x-auto max-w-full">
                {pagination.links.map((link, index) => {
                    if (link.label === "&laquo; Previous" || link.label === "Next &raquo;") {
                        return null;
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handlePageChange(link.label)}
                            className={`cursor-pointer w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                                link.active
                                    ? "bg-purple-600 text-white shadow-sm"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
                            }`}
                            disabled={link.active}
                        >
                            {link.label}
                        </button>
                    );
                })}
            </div>

            {/* Next button */}
            <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={isLastPage}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 w-full sm:w-auto justify-center ${
                    isLastPage
                        ? "cursor-not-allowed opacity-50 text-gray-400 border-gray-200 bg-gray-50"
                        : "cursor-pointer text-gray-600 border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400"
                }`}
            >
                <span className="hidden xs:inline">Next</span>
                <span className="xs:hidden">Next</span>
                <ChevronRight size={16} />
            </button>
        </div>
    );
}

export default function ManageEventsLayout() {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: "all",
        category: "all",
    });

    const hasActiveFilters = () => {
        return filters.status !== "all" || filters.category !== "all";
    };

    const clearFilters = () => {
        setFilters({
            status: "all",
            category: "all",
        });
    };

    async function fetchEvents(pageNum = 1) {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/events`, {
                params: {
                    page: pageNum,
                    search: searchQuery,
                    status: filters.status,
                    category: filters.category,
                },
            });
            console.log(res);

            setEvents(res.data.data || []);
            setPagination(res.data.meta || {});
        } catch (error) {
            toast.error("Failed to fetch events");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEvents(currentPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage, searchQuery, filters]);

    async function confirmDelete() {
        if (!selectedEventId) return;
        try {
            await axios.delete(`${apiUrl}/events/${selectedEventId}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            toast.success("Event deleted successfully!");
            fetchEvents(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete event.");
        } finally {
            setConfirmOpen(false);
            setSelectedEventId(null);
        }
    }

    const handleDelete = (eventId) => {
        setSelectedEventId(eventId);
        setConfirmOpen(true);
    };

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
            <div className="flex-1">
                <main className="p-3 sm:p-4 md:p-6">
                    {/* Header */}
                    <div className="flex flex-col space-y-3 sm:space-y-4 mb-4 sm:mb-6 md:mb-8">
                        <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">Manage Events</h2>
                            <p className="text-xs sm:text-sm md:text-base text-gray-600">Create, edit, and manage your events</p>
                        </div>

                        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:gap-3">
                            {/* Mobile: Search takes full width */}
                            <div className="relative order-2 sm:order-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 size-4" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64 transition-all duration-200"
                                />
                            </div>

                            {/* Mobile: Filter and Create buttons */}
                            <div className="flex items-center gap-2 order-1 sm:order-2">
                                {/* Toggle filter */}
                                <button
                                    onClick={() => setFiltersOpen(!filtersOpen)}
                                    className={`cursor-pointer flex items-center gap-2 border px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 sm:flex-none justify-center sm:justify-start ${
                                        filtersOpen || hasActiveFilters()
                                            ? "bg-purple-50 border-purple-200 text-purple-700"
                                            : "border-gray-300 text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <Filter size={16} />
                                    <span>Filters</span>
                                    {hasActiveFilters() && (
                                        <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {(filters.status !== "all" ? 1 : 0) + (filters.category !== "all" ? 1 : 0)}
                                        </span>
                                    )}
                                </button>

                                {/* Create Event */}
                                <button
                                    onClick={() => navigate("/organizer/create-event")}
                                    className="cursor-pointer btn-gradient text-white flex items-center py-2 px-3 sm:px-4 gap-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md flex-1 sm:flex-none justify-center sm:justify-start text-sm"
                                >
                                    <Plus size={16} />
                                    <span className="hidden xs:inline">Create Event</span>
                                    <span className="xs:hidden">New</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            filtersOpen ? "max-h-96 opacity-100 mb-4 sm:mb-6" : "max-h-0 opacity-0"
                        }`}
                    >
                        <div className="bg-white border border-gray-200 p-3 sm:p-4 md:p-5 rounded-xl shadow-sm">
                            <div className="flex flex-col gap-3 sm:gap-4">
                                {/* Filter controls */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700">Status</label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="pending_create">Pending Create</option>
                                            <option value="pending_update">Pending Update</option>
                                            <option value="pending_delete">Pending Delete</option>
                                            <option value="approved">Approved</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            value={filters.category}
                                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
                                        >
                                            <option value="all">All Categories</option>
                                            <option value="Cultural Event">Cultural Event</option>
                                            <option value="Technical Fests">Technical Fests</option>
                                            <option value="Sports Meets">Sports Meets</option>
                                            <option value="Annual Day Functions">Annual Day Functions</option>
                                            <option value="Workshops and Seminars">Workshops & Seminars</option>
                                            <option value="Intercollegiate Competitions">Intercollegiate Competitions</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Clear filters button - full width on mobile */}
                                {hasActiveFilters() && (
                                    <button
                                        onClick={clearFilters}
                                        className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300 w-full sm:w-auto sm:self-start"
                                    >
                                        <X size={14} />
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Event List */}
                    {loading && (
                        <div className="flex items-center justify-center py-8 sm:py-12">
                            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-600"></div>
                            <span className="ml-3 text-gray-600 text-sm md:text-base">Loading events...</span>
                        </div>
                    )}
                    {!loading && events.length === 0 && (
                        <div className="text-center py-8 sm:py-12">
                            <div className="text-gray-400 mb-2">
                                <Filter size={40} className="sm:w-12 sm:h-12 mx-auto" />
                            </div>
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg">No events found.</p>
                            <p className="text-gray-500 text-xs sm:text-sm">Try adjusting your search or filters.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {events.map((event) => (
                            <EventCard key={event.eventId} event={event} onDelete={() => handleDelete(event.eventId)} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.last_page > 1 && <Pagination pagination={pagination} setCurrentPage={setCurrentPage} />}
                </main>
            </div>

            {/* Confirm Delete */}
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
}
