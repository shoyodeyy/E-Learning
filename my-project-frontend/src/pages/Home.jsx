import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"
import axios from "axios";
import { apiUrl } from "../services/http.jsx";

import Header from "../components/Header";
import { addMinutes, format } from "date-fns";

async function fetchFeaturedEvents() {
    try {
        const res = await axios.get(`${apiUrl}/events/quantity/6`);

        const filteredFeaturedEvents = (res.data.data || []).filter(event => [
                "approved",
                "pending_update",
                "pending_delete"
            ].includes(event.status)
        );

        return filteredFeaturedEvents || [];
    } catch (error) {
        console.error("Failed to fetch featured events:", error);
        return [];
    }
}

function RandomBlob({ className, color }) {
    const [target, setTarget] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            setTarget({
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100,
            });
        }, 4000); // mỗi 4s đổi hướng
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            animate={{ x: target.x, y: target.y }}
            transition={{ duration: 1, ease: "linear" }}
            className={`absolute w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 ${className}`}
            style={{ backgroundColor: color }}
        />
    );
}

// Hero Section Component
const HeroSection = () => {
    return (
        <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 py-20 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <RandomBlob className="-top-40 -right-40" color="#c084fc" />
                <RandomBlob className="-bottom-40 -left-40" color="#f9a8d4" />
                <RandomBlob className="top-40 left-40" color="#a5b4fc" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                                <span className="text-sm font-semibold text-purple-600">🎉 New Events Added Weekly</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Unlock Unforgettable
                                <br />
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                                    Experiences.
                                </span>
                            </h1>
                        </div>

                        <p className="text-xl text-gray-600 leading-relaxed">
                            Discover, register, and manage your events seamlessly with EventSphere. Your ultimate platform for every occasion.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="btn-gradient-l">Explore Events</button>
                            <button className="cursor-pointer bg-white/80 backdrop-blur-sm hover:bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-purple-200">
                                Watch Demo
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl transform rotate-6 opacity-20"></div>
                        <img
                            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop"
                            alt="Event networking"
                            className="relative w-full h-96 object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">✓</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">1000+ Events</p>
                                    <p className="text-sm text-gray-600">Successfully Hosted</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Event Card Component
const EventCard = ({ event }) => {
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "MMMM dd, yyyy");
        } catch (error) {
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
            return start_at;
        }
    };

    // const getStatusColor = (status, seats) => {
    //     if (seats <= 20) return "bg-gradient-to-r from-red-500 to-pink-500";
    //     if (seats <= 75) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    //     return "bg-gradient-to-r from-green-500 to-emerald-500";
    // };
    //
    // const getStatusText = (seats) => {
    //     if (seats <= 20) return `${seats} Left`;
    //     if (seats <= 75) return `${seats} Left`;
    //     return `${seats} Available`;
    // };

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
        <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-100 min-h-[450px] flex-col justify-between">
            <div className="relative overflow-hidden">
                <img
                    src={event.bannerImage || "/placeholder.svg"}
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
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
                    {event.title}
                </h3>

                <div className="space-y-3 text-sm text-gray-600">
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
                        <span className="font-medium text-gray-700">
                            {formatTimeRange(event.start_at, event.duration_minutes)}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center">
                            <span className="text-pink-600 text-xs">📍</span>
                        </div>
                        <span className="font-medium text-gray-700">{event.venue}</span>
                    </div>
                </div>

                <Link
                    to={`/event/${event.eventId}`}
                    onClick={() => window.screenTop(0, 0)}
                    className="flex justify-center w-full btn-gradient">
                    View Details
                </Link>
            </div>
        </div>
    );
};

// Featured Events Section Component
const FeaturedEvents = ({ events }) => {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full mb-4">
                        <span className="text-sm font-semibold text-purple-600">✨ Featured Events</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Discover Amazing
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Events</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Join thousands of attendees in unforgettable experiences across various industries and interests.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event, index) => (
                        <div key={event.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <EventCard
                                key={event.eventId}
                                event={event} />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link to="/event" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="btn-gradient-l">
                        View All Events
                    </Link>
                </div>
            </div>
        </section>
    );
};


// Main Dashboard Component
export default function Home() {
    const [showMessage, setShowMessage] = useState(false);
    const [messageContent, setMessageContent] = useState("");
    const [messageType, setMessageType] = useState("success");

    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [loadingFeatured, setLoadingFeatured] = useState(true);

    useEffect(() => {
        const getEvents = async () => {
            setLoadingFeatured(true);

            const events = await fetchFeaturedEvents();

            setFeaturedEvents(events);
            setLoadingFeatured(false);
        };

        getEvents();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner Message */}
            {showMessage && (
                <div
                    className={`fixed top-0 left-0 right-0 z-50 p-4 text-center text-white backdrop-blur-md ${
                        messageType === "success" ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-purple-500 to-pink-500"
                    } shadow-lg`}
                >
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <span className="flex-1 font-semibold">{messageContent}</span>
                        <button
                            onClick={() => setShowMessage(false)}
                            className="cursor-pointer ml-4 text-white hover:text-gray-200 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-colors duration-200"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className={`${showMessage ? "pt-16" : ""}`}>
                <Header />

                {/* Main Content */}
                <main>
                    <HeroSection />
                    <FeaturedEvents events={featuredEvents} />
                </main>
            </div>
        </div>
    );
}
