import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const EventApprovals = () => {
    const [events] = useState([
        {
            id: 1,
            title: "Annual Tech Innovators Summit",
            organizer: "by Tech Leaders Council",
            submitted: "2024-07-01",
            eventDate: "2024-09-15",
            location: "San Francisco Convention Center",
            description:
                "Leading minds in technology to discuss AI, blockchain, and innovative tech solutions. Join industry experts for inspiring presentations.",
            image:
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop",
            status: "pending",
        },
        {
            id: 2,
            title: "Green City Marathon",
            organizer: "by City Sports Council",
            submitted: "2024-07-22",
            eventDate: "2024-10-05",
            location: "Central Park Course",
            description:
                "Marathon promoting health and environmental awareness. Register now for this eco-friendly race through scenic landscapes. All proceeds go to local environmental causes.",
            image:
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop",
            status: "pending",
        },
        {
            id: 3,
            title: "Local Artisans Craft Fair",
            organizer: "by Community Arts Alliance",
            submitted: "2024-07-28",
            eventDate: "2024-08-31",
            location: "Downtown Market Square",
            description:
                "Showcase local talent and find unique handmade items. Pottery, jewelry, textiles, and more. Support local talent and find one-of-a-kind treasures at this vibrant artisan event.",
            image:
                "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=300&h=200&fit=crop",
            status: "pending",
        },
        {
            id: 4,
            title: "Future of Finance Conference",
            organizer: "by Global Financial Insights",
            submitted: "2024-07-30",
            eventDate: "2024-11-10",
            location: "Business District Convention Hall",
            description:
                "An exploration of fintech and investing trends. Featuring blockchain technology, AI in finance, sustainable investments, and economic forecasting. Must-have for professionals.",
            image:
                "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop",
            status: "pending",
        },
        {
            id: 5,
            title: "Virtual Reality Gaming Expo",
            organizer: "by NextGen Gaming",
            submitted: "2024-07-25",
            eventDate: "2024-10-20",
            location: "Tech Innovation Center",
            description:
                "Immerse into the latest in VR gaming technology. Try cutting-edge VR experiences, talks, and expert tournaments. A digital festival for all gaming enthusiasts.",
            image:
                "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=300&h=200&fit=crop",
            status: "pending",
        },
        {
            id: 6,
            title: "Culinary Arts Festival",
            organizer: "by Gourmet Guild",
            submitted: "2024-08-01",
            eventDate: "2024-09-28",
            location: "Riverside Park Pavilion",
            description:
                "A celebration of local and international cuisine. Live cooking demonstrations by celebrity chefs and tasting workshops. A feast for the senses and the soul.",
            image:
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
            status: "pending",
        },
    ]);

    const [adminNotes, setAdminNotes] = useState({});
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        sortBy: "id",
        direction: "asc",
    });
    const [showFilters, setShowFilters] = useState(false);

    const handleAction = (eventId, action) => {
        console.log(`${action} event ${eventId}`);
    };

    const toggleAdminNotes = (eventId) => {
        setAdminNotes((prev) => ({
            ...prev,
            [eventId]: !prev[eventId],
        }));
    };

    // 🔎 Filter & Sort
    const filteredEvents = events
        .filter(
            (event) =>
                event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                event.organizer.toLowerCase().includes(filters.search.toLowerCase())
        )
        .filter((event) =>
            filters.status ? event.status === filters.status : true
        )
        .sort((a, b) => {
            let valA, valB;
            if (filters.sortBy === "submitted") {
                valA = new Date(a.submitted);
                valB = new Date(b.submitted);
            } else if (filters.sortBy === "eventDate") {
                valA = new Date(a.eventDate);
                valB = new Date(b.eventDate);
            } else {
                valA = a.id;
                valB = b.id;
            }
            return filters.direction === "asc" ? valA - valB : valB - valA;
        });


    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* 🔹 Search + Filter */}
            <div className="p-4 border-b border-gray-200">
                <input
                    type="text"
                    placeholder="Search by name or organizer..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full border px-4 py-2 rounded-lg text-sm"
                />
            </div>

            {/* 🔹 Filters & Sorting */}
            <div className="p-4 border-b border-gray-200">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                    <span className="mr-2">⚙</span>
                    Filters & Sorting
                    <ChevronDown
                        className={`ml-2 w-4 h-4 transition-transform ${
                            showFilters ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {showFilters && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        {/* Status */}
                        <div>
                            <label className="block text-gray-600 mb-1">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) =>
                                    setFilters({ ...filters, status: e.target.value })
                                }
                                className="w-full border px-3 py-2 rounded-lg"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-gray-600 mb-1">Sort By</label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) =>
                                    setFilters({ ...filters, sortBy: e.target.value })
                                }
                                className="w-full border px-3 py-2 rounded-lg"
                            >
                                <option value="id">ID</option>
                                <option value="submitted">Submitted Date</option>
                                <option value="eventDate">Event Date</option>
                            </select>
                        </div>

                        {/* Direction */}
                        <div>
                            <label className="block text-gray-600 mb-1">Direction</label>
                            <select
                                value={filters.direction}
                                onChange={(e) =>
                                    setFilters({ ...filters, direction: e.target.value })
                                }
                                className="w-full border px-3 py-2 rounded-lg"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <button
                                onClick={() =>
                                    setFilters({
                                        search: "",
                                        status: "",
                                        sortBy: "id",
                                        direction: "asc",
                                    })
                                }
                                className="text-purple-600 hover:underline text-sm"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto flex">
                <div className="flex-1 p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Event Approvals
                        </h1>
                        <p className="text-gray-600">
                            Review and manage submitted events awaiting your approval
                        </p>
                    </div>

                    {filteredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                                >
                                    <div
                                        className="h-48 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${event.image})` }}
                                    ></div>

                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {event.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {event.organizer}
                                        </p>

                                        <div className="space-y-2 mb-4 text-xs text-gray-600">
                                            <div className="flex items-center">
                                                <span className="font-medium w-20">Submitted:</span>
                                                <span>{event.submitted}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-20">Event Date:</span>
                                                <span>{event.eventDate}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium w-20">Location:</span>
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-600 mb-4 line-clamp-3">
                                            {event.description}
                                        </p>

                                        <div className="flex space-x-2 mb-3">
                                            <button
                                                onClick={() => handleAction(event.id, "approve")}
                                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-3 rounded-lg font-medium transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(event.id, "reject")}
                                                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-sm py-2 px-3 rounded-lg font-medium transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => toggleAdminNotes(event.id)}
                                            className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-800 py-2 border-t border-gray-100"
                                        >
                                            <span>Admin Notes</span>
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform ${
                                                    adminNotes[event.id] ? "rotate-180" : ""
                                                }`}
                                            />
                                        </button>

                                        {adminNotes[event.id] && (
                                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <textarea
                            className="w-full text-xs border border-gray-200 rounded p-2 resize-none"
                            rows="3"
                            placeholder="Add admin notes..."
                        ></textarea>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">
                            No events found with current filters.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventApprovals;
