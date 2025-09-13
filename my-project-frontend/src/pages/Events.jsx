import {useState} from "react";
import {Link} from "react-router-dom";
import {Search} from "lucide-react";

import Header from "../components/Header.jsx";

// Mock data for events
const mockEvents = [
    {
        id: 1,
        title: "Global Tech Summit 2024",
        date: "October 26, 2024",
        location: "Virtual, Online",
        totalSlots: 500,
        availableSlots: 150,
        category: "Technology",
        department: "IT",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
    },
    {
        id: 2,
        title: "Digital Marketing Masterclass",
        date: "November 10, 2024",
        location: "Convention Center, Cityville",
        totalSlots: 100,
        availableSlots: 30,
        category: "Marketing",
        department: "Marketing",
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop",
    },
    {
        id: 3,
        title: "Future of AI in Healthcare",
        date: "September 15, 2024",
        location: "Grand Auditorium, Metro City",
        totalSlots: 200,
        availableSlots: 5,
        category: "Healthcare",
        department: "Medical",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
    },
    {
        id: 4,
        title: "Art & Innovation Expo",
        date: "December 01, 2024",
        location: "Cultural Arts Center, Metropolis",
        totalSlots: 300,
        availableSlots: 200,
        category: "Arts",
        department: "Culture",
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop",
    },
    {
        id: 5,
        title: "Business Leadership Conference",
        date: "January 15, 2025",
        location: "Business Center, Downtown",
        totalSlots: 250,
        availableSlots: 80,
        category: "Business",
        department: "Management",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=250&fit=crop",
    },
    {
        id: 6,
        title: "Creative Writing Workshop",
        date: "February 20, 2025",
        location: "Library Hall, University",
        totalSlots: 50,
        availableSlots: 25,
        category: "Education",
        department: "Literature",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop",
    },
    {
        id: 7,
        title: "Startup Pitch Competition",
        date: "March 10, 2025",
        location: "Innovation Hub, Tech District",
        totalSlots: 150,
        availableSlots: 75,
        category: "Startup",
        department: "Entrepreneurship",
        image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=250&fit=crop",
    },
    {
        id: 8,
        title: "Cybersecurity Summit",
        date: "April 05, 2025",
        location: "Security Center, Capital City",
        totalSlots: 300,
        availableSlots: 120,
        category: "Technology",
        department: "Security",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
    },
];

const categories = ["All Categories", "Technology", "Marketing", "Healthcare", "Arts", "Business", "Education", "Startup"];
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
        <div
            className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 shadow-lg border-b border-purple-100 py-8 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute -top-20 -right-20 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div
                    className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
                    style={{animationDelay: "2s"}}
                ></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                    {/* Search Input */}
                    <div className="flex-1 w-full lg:max-w-md">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <div className="size-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Search className="text-purple-600 size-5"/>
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

// Event Card Component
const EventCard = ({event}) => {
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
        <div
            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-100 min-h-[430px]">
            <div className="relative overflow-hidden">
                <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4">
                    <div
                        className={`px-3 py-1.5 rounded-full text-white text-sm font-semibold shadow-lg ${getAvailabilityColor(
                            event.availableSlots,
                            event.totalSlots
                        )}`}
                    >
                        {getAvailabilityText(event.availableSlots, event.totalSlots)}
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
                    {event.title}
                </h3>

                <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 text-xs">📅</span>
                        </div>
                        <span className="font-medium text-gray-700">{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center">
                            <span className="text-pink-600 text-xs">📍</span>
                        </div>
                        <span className="font-medium text-gray-700">{event.location}</span>
                    </div>
                </div>

                <Link to="/event/1" className="flex justify-center w-full btn-gradient">
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

    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedCategory("All Categories");
        setSelectedDepartment("All Departments");
        setSelectedDate("All Dates");
    };

    // Filter events based on search and filters
    const filteredEvents = mockEvents.filter((event) => {
        const matchesSearch =
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || event.category === selectedCategory;
        const matchesDepartment = selectedDepartment === "All Departments" || event.department === selectedDepartment;
        // For simplicity, date filter is not implemented with actual logic

        return matchesSearch && matchesCategory && matchesDepartment;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
            <Header/>

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
                            <span
                                className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Events</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Showing <span
                            className="font-semibold text-purple-600">{filteredEvents.length}</span> of{" "}
                            <span className="font-semibold text-purple-600">{mockEvents.length}</span> events
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredEvents.map((event, index) => (
                        <div
                            key={event.id}
                            className="opacity-0 animate-fade-in"
                            style={{animationDelay: `${index * 50}ms`, animationFillMode: "forwards"}}
                        >
                            <EventCard event={event}/>
                        </div>
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-20">
                        <div className="space-y-4">
                            <div
                                className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-4xl">🔍</span>
                            </div>
                            <div className="text-gray-500 text-xl font-medium">No events found matching your criteria.
                            </div>
                            <button
                                onClick={handleResetFilters}
                                className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                Clear all filters
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <style jsx>{`
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
