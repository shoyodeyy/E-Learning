import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import axios from "axios";
import { format, addMinutes } from "date-fns";

import { apiUrl } from "../services/http.jsx";
import Header from "../components/Header.jsx";

const categories = [
    "All categories",
    "Cultural Event",
    "Technical Fests",
    "Sports Meets",
    "Annual Day Functions",
    "Workshops and Seminars",
    "Intercollegiate Competitions",
];

const departments = ["All Departments", "IT", "Marketing", "Medical", "Culture", "Management", "Literature", "Entrepreneurship", "Security"];

const dates = ["All Dates", "This Month", "Next Month", "This Quarter", "Next Quarter"];

// Search and Filter Component
const SearchAndFilter = ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedDepartment,
    setSelectedDepartment,
    selectedDate,
    setSelectedDate,
    onResetFilters,
}) => {
    return (
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 shadow-lg border-b border-purple-100 py-8 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div
                    className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
                    style={{ animationDelay: "2s" }}
                ></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                    {/* Search Input */}
                    <div className="flex-1 w-full lg:max-w-md">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <div className="size-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Search className="text-purple-600 size-5" />
                                </div>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by event title or keyword..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-purple-200 rounded-xl 
                 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg hover:shadow-xl 
                 transition-all duration-200 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-3 bg-white/90 backdrop-blur-sm border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-gray-700"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="px-4 py-3 bg-white/90 backdrop-blur-sm border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-gray-700"
                        >
                            {departments.map((department) => (
                                <option key={department} value={department}>
                                    {department}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-3 bg-white/90 backdrop-blur-sm border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-gray-700"
                        >
                            {dates.map((date) => (
                                <option key={date} value={date}>
                                    {date}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={onResetFilters}
                            className="cursor-pointer px-6 py-3 bg-white hover:bg-gray-50 text-purple-600 hover:text-purple-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-purple-200"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

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

// Event Card Component
const EventCard = ({ event }) => {
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "MMMM dd, yyyy");
        } catch (error) {
            console.error(error)
            return dateString; // fallback nếu có lỗi
        }
    };

    // Lấy thời gian kết thúc dựa vào start_at + duration_minutes
    const formatTimeRange = (start_at, duration_minutes) => {
        try {
            const start = new Date(start_at);
            const end = addMinutes(start, duration_minutes); // cộng phút vào
            return `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;
        } catch (error) {
            console.error(error)
            return start_at;
        }
    };

    const getAvailabilityColor = (available, total) => {
        const ratio = available / total;
        if (ratio <= 0.1) return "bg-red-500";
        if (ratio <= 0.3) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getAvailabilityText = (available, total) => {
        return `${available} / ${total} Slots Available`;
    };

    return (
        <div className="group h-[500px] bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-100 min-h-[430px]">
            <div className="relative overflow-hidden">
                <img
                    src={event.bannerImage ? `http://localhost:8000${event.bannerImage}` : "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4">
                    <div
                        className={`px-3 py-1.5 rounded-full text-white text-sm font-semibold shadow-lg ${getAvailabilityColor(
                            event.availableSlots,
                            event.totalSlots
                        )}`}
                    >
                        {getAvailabilityText(event.maxParticipants, event.maxParticipants)}
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200 h-[56px]">
                    {event.title}
                </h3>

                <div className="space-y-3 text-sm text-gray-600 h-[104px]">
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 text-xs">📅</span>
                        </div>
                        <span className="font-medium text-gray-700">{formatDate(event.start_at)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 text-xs">🕒</span>
                        </div>
                        <span className="font-medium text-gray-700">{formatTimeRange(event.start_at, event.duration_minutes)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center">
                            <span className="text-pink-600 text-xs">📍</span>
                        </div>
                        <span className="font-medium text-gray-700 line-clamp-2">{event.venue}</span>
                    </div>
                </div>

                <Link to={`/event/${event.eventId}`} onClick={() => window.screenTop(0, 0)} className="flex justify-center w-full btn-gradient">
                    View Details
                </Link>
            </div>
        </div>
    );
};

// Main Events Page Component
export default function EventsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
    const [selectedDate, setSelectedDate] = useState("All Dates");

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});

    async function fetchEvents(pageNum = 1) {
        setLoading(true);

        try {
            const res = await axios.get(`${apiUrl}/events?page=${pageNum}`);

            const filteredEvents = (res.data.data || []).filter((event) => ["approved", "completed"].includes(event.status));

            setEvents(filteredEvents);
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

    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedCategory("All Categories");
        setSelectedDepartment("All Departments");
        setSelectedDate("All Dates");
    };

    // Filter events based on search and filters
    const filteredEvents = events.filter((event) => {
        const title = event?.title?.toLowerCase() || "";
        const location = event?.location?.toLowerCase() || "";
        const search = searchTerm?.toLowerCase() || "";

        const matchesSearch =
            title.includes(search) || location.includes(search);

        const matchesCategory =
            selectedCategory.toLowerCase().includes("all") ||
            event.category?.toLowerCase() === selectedCategory?.toLowerCase();

        const matchesDepartment =
            selectedDepartment.toLowerCase().includes("all") ||
            event.department?.toLowerCase() === selectedDepartment?.toLowerCase();

        return matchesSearch && matchesCategory && matchesDepartment;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
            <Header />

            <SearchAndFilter
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onResetFilters={handleResetFilters}
            />

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full mb-4">
                            <span className="text-sm font-semibold text-purple-600">✨ All Events</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Discover Amazing
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Events</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Showing <span className="font-semibold text-purple-600">{filteredEvents.length}</span> of{" "}
                            <span className="font-semibold text-purple-600">{events.length}</span> events
                        </p>
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredEvents.map((event, index) => (
                                <div
                                    key={event.eventId}
                                    className="opacity-0 animate-fade-in"
                                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
                                >
                                    <EventCard event={event} />
                                </div>
                            ))}
                        </div>

                        {filteredEvents.length === 0 && (
                            <div className="text-center py-20">
                                <div className="space-y-4">
                                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
                                        <span className="text-4xl">🔍</span>
                                    </div>
                                    <div className="text-gray-500 text-xl font-medium">No events found matching your criteria.</div>
                                    <button
                                        onClick={handleResetFilters}
                                        className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            </div>
                        )}

                        {filteredEvents.length > 5 && <Pagination pagination={pagination} setCurrentPage={setCurrentPage} />}
                    </>
                )}
            </main>

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <div
                    className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-400 rounded-full animate-spin"
                    style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
                ></div>
            </div>
        </div>
    );
};
