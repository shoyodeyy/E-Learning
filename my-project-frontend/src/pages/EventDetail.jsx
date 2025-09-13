import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Calendar, Clock, MapPin, Users, Share2, Heart, User} from "lucide-react";
// import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

import Header from "../components/Header";
import CalendarInegration from "../components/CalendarIntegration";
import ShareEvent from "../components/ShareButton";
import api from "../api/axios.js";
import {toast} from "react-toastify";
import {useAuth} from "../context/AuthContext.jsx";
import {apiUrl} from "../services/http.jsx";


const EventDetailPage = () => {
    const {id} = useParams();
    const eventId = Number(id);
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const {user} = useAuth();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`${apiUrl}/events/${eventId}`);
                console.log(res.data)
                setEventData(res.data.data);

                const favRes = await api.get("/favorites");
                const isFav = favRes.data.some(fav => fav.event?.event_id === eventId);
                setIsFavorited(isFav);

            } catch (error) {
                console.error("Failed to fetch event:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    const handleToggleFavorite = async () => {
        if (!user) {
            toast.warning("Please login to add favorites");
            return;
        }

        try {
            if (isFavorited) {
                await api.delete(`/favorites/${eventId}`);
                setIsFavorited(false);
                toast.info("Removed from favorites!");
            } else {
                await api.post("/favorites", {events: [eventId]});
                setIsFavorited(true);
                toast.success("Added to favorites!");
            }
        } catch (error) {
            console.error("Favorite toggle failed:", error);
            toast.error("Failed to update favorites");
        }
    };

    const getAvailabilityColor = (available, total) => {
        const ratio = available / total;
        if (ratio <= 0.1) return "bg-red-500";
        if (ratio <= 0.3) return "bg-yellow-500";
        return "bg-green-500";
    };

    const tabs = [{id: "overview", label: "Overview"}, {id: "media", label: "Media Gallery"}, {
        id: "feedback", label: "Feedback"
    },];

    if (loading) {
        return (<>
            <Header/>
            <div className="min-h-screen flex items-center justify-center">
                <div
                    className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        </>);
    }

    if (!eventData) {
        return (<>
            <Header/>
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Event not found
            </div>
        </>);
    }

    return (<>
        <Header/>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
            {/* Hero Section */}
            <div className="relative">
                <div className="h-96 overflow-hidden">
                    <img
                        src={
                            eventData.bannerImage
                                ? `http://localhost:8000${eventData.bannerImage}`
                                : "/default-thumbnail.jpg"
                        }
                        alt={eventData.title}
                        className="w-full h-full object-cover"
                    />


                    <div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>

                {/* Event Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                            {eventData.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Event Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Date */}
                            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-purple-600"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-semibold text-gray-900">
                                            {new Date(eventData.start_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Time */}
                            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-pink-600"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Time</p>
                                        <p className="font-semibold text-gray-900">
                                            {new Date(eventData.start_at).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-indigo-600"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-semibold text-gray-900">{eventData.venue}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Organizer */}
                        {eventData.organizer && (
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={eventData.organizer.avatar}
                                        alt={eventData.organizer.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-900">{eventData.organizer.name}</h3>
                                        <p className="text-gray-600">{eventData.organizer.tagline}</p>
                                    </div>
                                </div>
                            </div>)}

                        {/* Categories */}
                        {eventData.categories?.length > 0 && (<div className="flex flex-wrap gap-3">
                            {eventData.categories.map((category, index) => (<span
                                key={index}
                                className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                            >
                          {category}
                        </span>))}
                        </div>)}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4">
                            <ShareEvent event={eventData}>
                                <button
                                    className="cursor-pointer flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-lg border border-gray-200 transition-all duration-200">
                                    <Share2 className="w-5 h-5"/>
                                    <span>Share Event</span>
                                </button>
                            </ShareEvent>

                            <button
                                onClick={handleToggleFavorite}
                                className={`cursor-pointer flex items-center space-x-2 px-6 py-3 rounded-xl shadow-lg transition-all duration-200 ${isFavorited ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"}`}
                            >
                                <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`}/>
                                <span>{isFavorited ? "Favorited" : "Add to Favorites"}</span>
                            </button>

                            <CalendarInegration eventId={eventId} variant="inline"/>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8 px-6">
                                    {tabs.map((tab) => (<button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id ? "border-purple-500 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                                    >
                                        {tab.label}
                                    </button>))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === "overview" && (<div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">About This
                                            Event</h3>
                                        <p className="text-gray-700 leading-relaxed">{eventData.description}</p>
                                    </div>
                                    {/* Agenda */}
                                    {eventData.agenda?.length > 0 && (<div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Event
                                            Agenda</h3>
                                        <div className="space-y-3">
                                            {eventData.agenda.map((item, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <div
                                                        className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                                    <p className="text-gray-700">{item}</p>
                                                </div>))}
                                        </div>
                                    </div>)}
                                </div>)}

                                {activeTab === "media" && (<div className="text-center py-12">
                                    <div
                                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">📸</span>
                                    </div>
                                    <p className="text-gray-500">Media gallery will be available soon</p>
                                </div>)}

                                {/*{activeTab === "feedback" && (*/}
                                {/*    <FeedbackSection eventId={eventId} />*/}
                                {/*)}*/}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-18">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                                    <h2 className="text-2xl font-bold mb-2">Event Registration</h2>
                                    <div className="flex items-baseline space-x-2">
                                          <span className="text-4xl font-bold">
                                            {eventData.currency}
                                              {eventData.price}
                                          </span>
                                        <span className="text-purple-100">/person</span>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Availability */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className={`w-3 h-3 rounded-full ${getAvailabilityColor(eventData.maxParticipants, eventData.maxParticipants)}`}
                                            />
                                            <span
                                                className="text-sm font-medium text-gray-700">{eventData.status}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-gray-600">
                                            <Users className="w-4 h-4"/>
                                            <span className="text-sm">
                                              {eventData.maxParticipants} slots
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/event/${eventData.id}/seat`}
                                        className="w-full inline-flex justify-center btn-gradient-l"
                                    >
                                        Register Now
                                    </Link>

                                    <p className="text-xs text-gray-500 text-center">Taxes and fees may apply.</p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-center space-x-2 text-gray-500">
                                <User className="w-4 h-4"/>
                                <span className="text-sm">You are a public viewer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>);
};

export default EventDetailPage;
