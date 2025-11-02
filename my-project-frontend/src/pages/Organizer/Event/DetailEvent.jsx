import { useState, useEffect } from "react";
import { ChevronDown, Users } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../../services/http.jsx";
import { getImageUrl } from "../../../api/axios.js";
import { useAuth } from "../../../context/AuthContext.jsx";

export default function DetailEvent() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`${apiUrl}/events/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                setEvent(res.data.data);
            } catch (error) {
                console.error("Failed to fetch event: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id, token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (!event) {
        return <p className="p-6 text-red-500">Event not found.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 px-4">
                    <h2 className="text-xl font-semibold text-gray-800">Event Details</h2>
                </div>

                <div className="p-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                        {/* Banner Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                <img
                                    src={getImageUrl(event.bannerImage)}
                                    alt="Event banner"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <p className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-100">{event.title}</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <p className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 whitespace-pre-line">{event.description}</p>
                        </div>

                        {/* Category + Start Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <p className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 flex items-center justify-between">
                                    {event.category}
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date and Time</label>
                                <p className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-100">{event.start_at}</p>
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                            <p className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-100">{event.duration_minutes}</p>
                        </div>

                        {/* Venue */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                            <p className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-100">{event.venue}</p>
                        </div>

                        {/* Max Participants + Registration Deadline */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                                <p className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-100">{event.maxParticipants}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline</label>
                                <p className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-100">{event.registrationDeadline}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                            <Link
                                to={`/organizer/event-registrations/${event.eventId}`}
                                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                            >
                                <Users className="w-4 h-4" />
                                <span>Manage Registrations</span>
                            </Link>

                            <button
                                onClick={() => navigate("/organizer/manage-events")}
                                type="button"
                                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
