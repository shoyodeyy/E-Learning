import { useState } from "react";
import { Search, Plus, Edit, Trash2, Eye, Settings, Calendar, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Mock data for events
const mockEvents = [
    {
        id: 1,
        title: "Annual Tech Summit 2024",
        date: "July 20, 2024 • 9:00 AM - 5:00 PM",
        location: "Convention Center, Cityville",
        status: "Live",
        statusColor: "bg-green-500",
        slots: "75/100 Slots",
        slotsColor: "bg-purple-500",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
    },
    {
        id: 2,
        title: "Summer Music Fest",
        date: "August 12-14, 2024 • 6:00 PM - 11:00 PM",
        location: "Central Park Grounds",
        status: "Live",
        statusColor: "bg-green-500",
        slots: "20/300 Slots",
        slotsColor: "bg-yellow-500",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
    },
    {
        id: 3,
        title: "Creative Arts Workshop",
        date: "September 5, 2024 • 10:00 AM - 3:00 PM",
        location: "Art Studio Downtown",
        status: "Pending Approval",
        statusColor: "bg-orange-500",
        slots: "10/10 Slots",
        slotsColor: "bg-purple-500",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=250&fit=crop",
    },
    {
        id: 4,
        title: "Annual Charity Run",
        date: "June 15, 2024 • 7:00 AM - 12:00 PM",
        location: "Riverside Park",
        status: "Completed",
        statusColor: "bg-gray-500",
        slots: "Full",
        slotsColor: "bg-red-500",
        image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=250&fit=crop",
    },
    {
        id: 5,
        title: "Gourmet Food Fair",
        date: "October 1, 2024 • 11:00 AM - 7:00 PM",
        location: "City Market Hall",
        status: "Live",
        statusColor: "bg-green-500",
        slots: "5/200 Slots",
        slotsColor: "bg-yellow-500",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop",
    },
    {
        id: 6,
        title: "Future Innovators Hackathon",
        date: "November 20-22, 2024 • 9:00 AM - 6:00 PM",
        location: "Tech Hub Auditorium",
        status: "Live",
        statusColor: "bg-green-500",
        slots: "15/50 Slots",
        slotsColor: "bg-green-500",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=250&fit=crop",
    },
];

// Event Card Component
function EventCard({ event }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Event Image */}
            <div className="relative">
                <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
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
                <div className="flex items-center space-x-2">
                    <Link to={`/organizer/update-event/${event.id}`} className="cursor-pointer p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit size={16} />
                    </Link>
                    <button className="cursor-pointer p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Trash2 size={16} />
                    </button>
                    <button className="cursor-pointer flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}

// Pagination Component
function Pagination() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="flex items-center justify-center space-x-2 mt-8">
            <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="cursor-pointer px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
                ← Previous
            </button>
            {[1, 2, 3].map((page) => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`cursor-pointer w-8 h-8 rounded text-sm font-medium ${
                        currentPage === page ? "bg-purple-600 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                    {page}
                </button>
            ))}
            <button onClick={() => setCurrentPage(Math.min(3, currentPage + 1))} className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                Next →
            </button>
        </div>
    );
}

// Main Layout Component
export default function ManageEventsLayout() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockEvents
                            .filter(
                                (event) =>
                                    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    event.location.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                    </div>

                    <Pagination />
                </main>
            </div>
        </div>
    );
}
