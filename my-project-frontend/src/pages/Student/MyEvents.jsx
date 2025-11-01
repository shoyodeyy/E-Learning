import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Calendar, Clock, X } from 'lucide-react';

// Mock data for events
const mockEvents = [
    {
        id: 1,
        photo_image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop",
        title: "Tech Innovation Summit 2024",
        start_date: "2024-10-26",
        event_time: "09:00 AM",
        status: "active"
    },
    {
        id: 2,
        photo_image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=100&h=100&fit=crop",
        title: "Global Marketing Conference",
        start_date: "2024-11-10",
        event_time: "10:30 AM",
        status: "active"
    },
    {
        id: 3,
        photo_image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=100&h=100&fit=crop",
        title: "Future of AI in Healthcare",
        start_date: "2024-12-05",
        event_time: "02:00 PM",
        status: "inactive"
    },
    {
        id: 4,
        photo_image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&h=100&fit=crop",
        title: "Creative Design Workshop",
        start_date: "2025-01-15",
        event_time: "11:00 AM",
        status: "active"
    },
    {
        id: 5,
        photo_image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=100&h=100&fit=crop",
        title: "Startup Pitch Competition",
        start_date: "2025-02-20",
        event_time: "03:30 PM",
        status: "active"
    }
];

const MyEventsLayout = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        start_date: '',
        event_time: ''
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            start_date: '',
            event_time: ''
        });
    };

    const handleCancelEvent = (eventId) => {
        console.log('Cancel event:', eventId);
        // Add your cancel logic here
    };

    const filteredEvents = mockEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !filters.status || event.status === filters.status;
        const matchesDate = !filters.start_date || event.start_date === filters.start_date;
        const matchesTime = !filters.event_time || event.event_time === filters.event_time;

        return matchesSearch && matchesStatus && matchesDate && matchesTime;
    });

    const getStatusBadge = (status) => {
        if (status === 'active') {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200">
          Active
        </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200">
          Inactive
        </span>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-purple-600 to-purple-800 shadow-xl">
                {/* Logo/Header */}
                <div className="p-6 border-b border-purple-500/30">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg">EventSphere</h1>
                            <p className="text-purple-200 text-sm">Dashboard</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-6 space-y-2">
                    <div className="space-y-1">
                        <a href="#" className="flex items-center px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                            <span className="mr-3">👤</span>
                            Profile
                        </a>
                        <a href="#" className="flex items-center px-4 py-3 text-white bg-white/20 rounded-xl">
                            <span className="mr-3">👥</span>
                            Users
                        </a>
                        <a href="#" className="flex items-center px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                            <span className="mr-3">⚙️</span>
                            Control panel
                        </a>
                        <a href="#" className="flex items-center px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                            <span className="mr-3">📊</span>
                            Projects
                        </a>
                        <a href="#" className="flex items-center px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                            <span className="mr-3">✅</span>
                            Tasks
                        </a>
                        <a href="#" className="flex items-center px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                            <span className="mr-3">📝</span>
                            Logs
                        </a>
                        <a href="#" className="flex items-center px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                            <span className="mr-3">💬</span>
                            Group chats
                        </a>
                        <a href="#" className="flex items-center px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
                            <span className="mr-3">📊</span>
                            Reports
                        </a>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="ml-64 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            My Events
                        </h2>
                        <p className="text-gray-600 mt-2">Manage and track your events</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Total events: 5</p>
                            <p className="text-sm text-gray-500">Active events: 4</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">LA</span>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-purple-100">
                    <div className="flex items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                                <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${showFilter ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Filter Dropdown */}
                            {showFilter && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-10 overflow-hidden">
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-900">Filters</h3>
                                            <button
                                                onClick={clearFilters}
                                                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                            >
                                                Clear all
                                            </button>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                            <select
                                                value={filters.status}
                                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="">All statuses</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                            <input
                                                type="date"
                                                value={filters.start_date}
                                                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Event Time</label>
                                            <input
                                                type="time"
                                                value={filters.event_time}
                                                onChange={(e) => handleFilterChange('event_time', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Events Table */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-purple-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Photo</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Start Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Event Time</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {filteredEvents.map((event, index) => (
                                <tr key={event.id} className="hover:bg-purple-50/50 transition-colors duration-200">
                                    <td className="px-6 py-4">
                                        <img
                                            src={event.photo_image}
                                            alt={event.title}
                                            className="w-12 h-12 rounded-xl object-cover shadow-sm"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900 hover:text-purple-600 transition-colors duration-200">
                                            {event.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                                            {event.start_date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-gray-600">
                                            <Clock className="w-4 h-4 mr-2 text-pink-500" />
                                            {event.event_time}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(event.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleCancelEvent(event.id)}
                                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredEvents.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-purple-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyEventsLayout;