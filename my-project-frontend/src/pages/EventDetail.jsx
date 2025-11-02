import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Calendar, Clock, MapPin, Users, Share2, Heart, User, Star, Send } from "lucide-react";
import axios from "axios";
import { format, addMinutes } from "date-fns";
import { toast } from "react-toastify";
import { formatInTimeZone } from "date-fns-tz";

import { apiUrl } from "../services/http.jsx";
import { getImageUrl } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Header from "../components/Header";
import CalendarIntegration from "../components/CalendarIntegration";
import ShareEvent from "../components/ShareButton";
import api from "../api/axios.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

const bannedWords = ["badword1", "badword2", "offensive", "xxx"];

const containsBannedWords = (text) => {
    const lowerText = text.toLowerCase();
    return bannedWords.some((word) => lowerText.includes(word));
};

const FeedbackSection = ({ eventId, userRole, eventStatus }) => {
    const { user, token } = useAuth();
    const [feedbacks, setFeedbacks] = useState([]);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showSubmitForm, setShowSubmitForm] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const [feedbackDeadline, setFeedbackDeadline] = useState(null);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userHasFeedback, setUserHasFeedback] = useState(false);

    useEffect(() => {
        if (eventStatus === "completed") {
            fetchFeedbacks();
        } else {
            setLoading(false);
        }
    }, [eventId, eventStatus]);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get(`${apiUrl}/events/${eventId}/feedbacks`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setFeedbacks(response.data.data);
            setCanSubmit(response.data.can_submit);
            setFeedbackDeadline(response.data.feedback_deadline);

            // Kiểm tra xem user đã feedback chưa
            const userFeedback = response.data.data.find((f) => f.user_id === user?.user_id);
            setUserHasFeedback(!!userFeedback);
        } catch (error) {
            console.error("Failed to fetch feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRatingClick = (value) => {
        setRating(value);
    };

    const handleSubmit = async () => {
        if (isDeadlinePassed) {
            toast.error("Feedback submission period has ended.");
            return;
        }

        if (rating === 0) {
            toast.warn("Please select a rating before submitting");
            return;
        }

        if (containsBannedWords(comment)) {
            toast.warn("Your comment contains inappropriate words.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                `${apiUrl}/events/${eventId}/feedbacks`,
                { rating, comments: comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSubmitted(true);
            setFeedbacks((prev) => [response.data.data, ...prev]);
            setCanSubmit(false);
            setUserHasFeedback(true);

            setTimeout(() => {
                setSubmitted(false);
                setRating(0);
                setComment("");
                setShowSubmitForm(false);
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit feedback");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async (feedbackId) => {
        if (isDeadlinePassed) {
            toast.error("Feedback submission period has ended.");
            return;
        }

        if (rating === 0) {
            toast.warn("Please select a rating before updating");
            return;
        }

        if (containsBannedWords(comment)) {
            toast.error("Your comment contains inappropriate words.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.put(
                `${apiUrl}/feedbacks/${feedbackId}`,
                { rating, comments: comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setFeedbacks((prev) => prev.map((f) => (f.feedback_id === feedbackId ? response.data.data : f)));

            setEditingFeedback(null);
            setRating(0);
            setComment("");
            setShowSubmitForm(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update feedback");
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEdit = (feedback) => {
        setEditingFeedback(feedback);
        setRating(feedback.rating);
        setComment(feedback.comments || "");
        setShowSubmitForm(true);
    };

    const renderStars = (rating) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => {
                    if (star <= Math.floor(rating)) {
                        return <FaStar key={star} className="w-4 h-4 text-yellow-400" />;
                    } else if (star === Math.ceil(rating) && !Number.isInteger(rating)) {
                        return <FaStarHalfAlt key={star} className="w-4 h-4 text-yellow-400" />;
                    } else {
                        return <FaRegStar key={star} className="w-4 h-4 text-gray-300" />;
                    }
                })}
            </div>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (eventStatus !== "completed") {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⏳</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Feedback Not Available</h2>
                <p className="text-gray-600">Feedback will be available after the event is completed.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading feedback...</p>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✅</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                <p className="text-gray-600">Your feedback has been {editingFeedback ? "updated" : "submitted"} successfully.</p>
            </div>
        );
    }

    const isDeadlinePassed = feedbackDeadline && new Date() > new Date(feedbackDeadline);
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Event Feedback</h1>
                    <p className="text-gray-600">Reviews from {userRole === "organizer" ? "organizers" : "participants"}</p>
                    {feedbackDeadline && !userHasFeedback && !editingFeedback && (
                        <p className="text-sm text-gray-500 mt-1">
                            Feedback deadline: {formatDate(feedbackDeadline)}
                            {isDeadlinePassed && <span className="text-red-500 ml-2">(Expired)</span>}
                        </p>
                    )}
                </div>
                {canSubmit && !showSubmitForm && !isDeadlinePassed && !userHasFeedback && (
                    <button
                        onClick={() => setShowSubmitForm(true)}
                        className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
                    >
                        <Send className="w-4 h-4" />
                        <span>Write Review</span>
                    </button>
                )}
                {userHasFeedback &&
                    !showSubmitForm &&
                    !isDeadlinePassed &&
                    (() => {
                        const userFeedback = feedbacks.find((f) => f.user_id === user?.user_id);
                        return userFeedback && !userFeedback.edited ? (
                            <button
                                onClick={() => startEdit(userFeedback)}
                                className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
                            >
                                <Send className="w-4 h-4" />
                                <span>Edit Review</span>
                            </button>
                        ) : null;
                    })()}
            </div>

            {showSubmitForm && (
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">{editingFeedback ? "Edit Your Feedback" : "Submit Your Feedback"}</h2>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Rating</h3>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingClick(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="cursor-pointer focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 transition-colors ${
                                            star <= (hoveredRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && <p className="text-sm text-gray-600 mt-2">You rated: {rating} out of 5 stars</p>}
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Comments</h3>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts on the event..."
                            rows={4}
                            maxLength={1000}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
                        />
                        <p className="text-sm text-gray-500 mt-2">{comment.length}/1000 characters</p>
                    </div>

                    <div className="flex space-x-3 gap-2">
                        <button
                            onClick={editingFeedback ? () => handleEdit(editingFeedback.feedback_id) : handleSubmit}
                            disabled={isSubmitting || rating === 0}
                            className={`cursor-pointer px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center space-x-2 ${
                                isSubmitting || rating === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 shadow-lg"
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>{editingFeedback ? "Updating..." : "Submitting..."}</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>{editingFeedback ? "Update Feedback" : "Submit Feedback"}</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => {
                                setShowSubmitForm(false);
                                setEditingFeedback(null);
                                setRating(0);
                                setComment("");
                            }}
                            className="cursor-pointer px-6 py-3 rounded-lg font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {feedbacks.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">
                                {(feedbacks.reduce((sum, f) => sum + parseFloat(f.rating), 0) / feedbacks.length).toFixed(1)}
                            </div>
                            <div className="flex justify-center mb-2">
                                {renderStars(feedbacks.reduce((sum, f) => sum + parseFloat(f.rating), 0) / feedbacks.length)}
                            </div>
                            <div className="text-sm text-gray-600">Average Rating</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">{feedbacks.length}</div>
                            <div className="text-sm text-gray-600">Total Reviews</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">
                                {feedbacks.length > 0 ? Math.round((feedbacks.filter((f) => f.rating >= 4).length / feedbacks.length) * 100) : 0}%
                            </div>
                            <div className="text-sm text-gray-600">Recommended</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Reviews ({feedbacks.length})</h2>

                {feedbacks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to share your experience!</div>
                ) : (
                    feedbacks.map((feedback) => (
                        <div
                            key={feedback.feedback_id}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start space-x-4">
                                <img
                                    src={`http://localhost:8000${feedback.user.avatar_url}` || "https://ui-avatars.com/api/?name=" + feedback.user.name}
                                    alt={feedback.user.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h4 className="font-semibold text-gray-900">{feedback.user.name}</h4>
                                                {feedback.edited && (
                                                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Updated</span>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-2 mt-1">
                                                {renderStars(feedback.rating)}
                                                <span className="text-sm text-gray-500">• {formatDate(feedback.submitted_on)}</span>
                                            </div>
                                        </div>
                                        {user && feedback.user_id === user.user_id && !feedback.edited && !isDeadlinePassed && (
                                            <button
                                                onClick={() => startEdit(feedback)}
                                                className="cursor-pointer text-sm text-purple-600 hover:text-purple-800 px-3 py-1 rounded hover:bg-purple-50 transition-colors"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>

                                    {feedback.comments && <p className="text-gray-700 leading-relaxed mb-3">{feedback.comments}</p>}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const EventDetailPage = () => {
    const { id } = useParams();
    const { user, token } = useAuth();
    const eventId = Number(id);

    const [availableSeats, setAvailableSeats] = useState(0);

    const [activeTab, setActiveTab] = useState("overview");
    const [isFavorited, setIsFavorited] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [reg, setReg] = useState({ registered: false, status: null });

    const handleCancelRegistration = () => {
        setConfirmOpen(true);
    };

    const confirmCancel = async () => {
        setConfirmOpen(false);

        try {
            const res = await api.post(`/events/${eventId}/cancel`);
            toast.success(res.data?.message || "Registration cancelled successfully");

            // Refresh both registration status and available seats
            await Promise.all([fetchRegistrationStatus(), fetchAvailableSeats()]);
        } catch (err) {
            console.error("Cancel registration error:", err);
            const msg = err.response?.data?.error || err.response?.data?.message || "Failed to cancel registration";
            toast.error(msg);
        }
    };

    const fetchAvailableSeats = async () => {
        try {
            const res = await api.get(`/events/${id}/available-seats`);
            setAvailableSeats(res.data.availableSeats);
        } catch (error) {
            console.error("Failed to fetch available seats:", error);
        }
    };

    // Function to fetch registration status
    const fetchRegistrationStatus = async () => {
        if (!eventId) return;

        try {
            const res = await api.get(`/events/${eventId}/registration/status`);
            setReg(res.data);
        } catch (e) {
            console.error("Failed to fetch registration status:", e);
            console.error("Error details:", e.response?.data);
            setReg({ registered: false, status: null });
        }
    };

    useEffect(() => {
        if (eventId) {
            fetchRegistrationStatus();

            let interval;
            if (token) {
                interval = setInterval(() => {
                    if (!document.hidden) {
                        fetchRegistrationStatus();
                    }
                }, 5000);
            }

            return () => {
                if (interval) clearInterval(interval);
            };
        }
    }, [eventId, token, user]); // Added user back to dependencies

    // Refresh registration status when user comes back to this page
    useEffect(() => {
        const handleFocus = () => {
            fetchRegistrationStatus();
        };

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchRegistrationStatus();
            }
        };

        const handlePageShow = () => {
            fetchRegistrationStatus();
        };

        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("pageshow", handlePageShow);

        return () => {
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, [eventId]);

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);

                setEvents(res.data.data);
            } catch (error) {
                console.error("Failed to fetch event:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id, token]);

    useEffect(() => {
        fetchAvailableSeats();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">Loading event details...</p>
                </div>
            </div>
        );
    }
    if (!events) {
        return <p className="p-6 text-red-500">Event not found.</p>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const d = new Date(dateString);
        if (isNaN(d)) return dateString;
        return format(d, "MMMM dd, yyyy");
    };


    const formatTimeRange = (start_at, duration_minutes) => {
        if (!start_at || !duration_minutes) return "N/A";
        const start = new Date(start_at);
        if (isNaN(start)) return start_at;

        const end = addMinutes(start, duration_minutes);

        // Hiển thị theo múi giờ Việt Nam (Asia/Ho_Chi_Minh)
        return `${formatInTimeZone(start, "Asia/Ho_Chi_Minh", "HH:mm")} - ${formatInTimeZone(end, "Asia/Ho_Chi_Minh", "HH:mm")}`;
    };

    const formatDurationTime = (duration_minutes) => {
        try {
            const hours = Math.floor(duration_minutes / 60);
            const minutes = duration_minutes % 60;

            if (hours && minutes) {
                return `${hours} ${hours > 1 ? "hours" : "hour"} ${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
            } else if (hours) {
                return `${hours} ${hours > 1 ? "hours" : "hour"}`;
            } else {
                return `${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
            }
        } catch (error) {
            console.error("Failed to format duration time:", error);
            return `${duration_minutes} minutes`;
        }
    };

    const getAvailabilityColor = (available, total) => {
        const ratio = available / total;
        if (ratio <= 0.1) return "bg-red-500";
        if (ratio <= 0.3) return "bg-yellow-500";
        return "bg-green-500";
    };

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "media", label: "Media Gallery" },
        { id: "feedback", label: "Feedback" },
    ];

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-purple-50">
                {/* Hero Section */}
                <div className="relative">
                    <div className="h-96 overflow-hidden">
                        <img
                            src={getImageUrl(events.bannerImage)}
                            alt={events.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </div>

                    {/* Event Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="max-w-7xl mx-auto">
                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">{events.title}</h1>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Event Details */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Event Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Date</p>
                                            <p className="font-semibold text-gray-900">{formatDate(events.start_at)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-pink-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Time</p>
                                            <p className="font-semibold text-gray-900">{formatTimeRange(events.start_at, events.duration_minutes)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <p className="font-semibold text-gray-900">{events.venue}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Organizer Info */}
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={
                                            events.organizerId?.avatar_url ||
                                            `https://ui-avatars.com/api/?name=${events.organizerId?.name || "Unknown"}&background=8b5cf6&color=ffffff`
                                        }
                                        alt={events.organizerId?.name || "Organizer"}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-900">{events.organizerId?.name || "Unknown Organizer"}</h3>
                                        <p className="text-gray-600">{events.organizerId?.profile || "Event Organizer"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Category Tags */}
                            <div className="flex flex-wrap gap-3">
                                <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                    {events.category}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <ShareEvent event={events} title={events.title}>
                                <button className="cursor-pointer flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-lg border border-gray-200 transition-all duration-200">
                                    <Share2 className="w-5 h-5" />
                                    <span>Share Event</span>
                                </button>
                                </ShareEvent>

                                <button
                                    onClick={() => setIsFavorited(!isFavorited)}
                                    className={`cursor-pointer flex items-center space-x-2 px-6 py-3 rounded-xl shadow-lg transition-all duration-200 ${
                                        isFavorited
                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                            : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                                    }`}
                                >
                                    <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                                    <span>{isFavorited ? "Favorited" : "Add to Favorites"}</span>
                                </button>
                                {/* Calendar button (inline, always visible) */}
                                <CalendarIntegration eventId={events.eventId} variant="inline" />
                            </div>

                            {/* Navigation Tabs */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                                <div className="border-b border-gray-200">
                                    <nav className="flex space-x-8 px-6 gap-4">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                                    activeTab === tab.id
                                                        ? "border-purple-500 text-purple-600"
                                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Tab Content */}
                                <div className="p-6">
                                    {activeTab === "overview" && (
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-4">About This Event</h3>
                                                <p className="text-gray-700 leading-relaxed">{events.description}</p>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "media" && (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <span className="text-2xl">📸</span>
                                            </div>
                                            <p className="text-gray-500">Media gallery will be available soon</p>
                                        </div>
                                    )}

                                    {activeTab === "feedback" && (
                                        <FeedbackSection
                                            eventId={events.eventId}
                                            userRole={user?.role || "participant"}
                                            eventStatus={events.status}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Registration Card */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-18">
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                    {/* Registration Header */}
                                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                                        <h2 className="text-2xl font-bold mb-2">Event Registration</h2>
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-3xl font-bold">Free</span>
                                            <span className="text-purple-100">/person to receive certificate</span>
                                        </div>
                                    </div>

                                    {/* Registration Content */}
                                    <div className="p-6 space-y-6">
                                        {/* Availability Status */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className={`w-3 h-3 rounded-full ${getAvailabilityColor(availableSeats, events.maxParticipants)}`}
                                                ></div>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {availableSeats > 0 ? "Available" : "Unavailable"}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-gray-600">
                                                <Users className="w-4 h-4" />
                                                <span className="text-sm">
                                                    {availableSeats} / {events.maxParticipants} slots
                                                </span>
                                            </div>
                                        </div>

                                        {/* Register Button */}
                                        {events.status === "completed" || new Date(events.end_at).getTime() < Date.now() ? (
                                            <button
                                                className="w-full inline-flex justify-center items-center px-6 py-3 rounded-lg font-semibold text-gray-500 bg-gray-200 cursor-default"
                                            >
                                                The event has ended.
                                            </button>
                                        ) : !user ? (
                                            <Link to="/login" className="w-full inline-flex justify-center btn-gradient-l">
                                                Login to Register
                                            </Link>
                                        ) : !reg.registered || reg.status === "cancelled" || reg.status === null ? (
                                            <Link to={`/event/${eventId}/seat`} className="w-full inline-flex justify-center btn-gradient-l">
                                                Register Now
                                            </Link>
                                        ) : (
                                            <div className="space-y-2 mb-2">
                                                <button
                                                    onClick={handleCancelRegistration}
                                                    className="w-full inline-flex justify-center btn-gradient-l hover:!bg-red-600 bg-gradient-to-l !from-red-400 !to-red-500 hover:!from-red-600 hover:!to-red-600"
                                                >
                                                    Cancel Registration
                                                </button>
                                            </div>
                                        )}


                                        <p className="text-xs text-gray-500 text-center">Taxes and fees may apply.</p>

                                        {/* Additional Info */}
                                        <div className="border-t pt-6 space-y-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Duration:</span>
                                                <span className="font-medium">{formatDurationTime(events.duration_minutes)}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Language:</span>
                                                <span className="font-medium">English</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Certificate:</span>
                                                <span className="font-medium">Included</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Viewer Status */}
                                <div className="mt-6 flex items-center justify-center space-x-2 text-gray-500">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm">You are a public viewer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ConfirmDialog
                    open={confirmOpen}
                    message="Are you sure you want to cancel your registration for this event??"
                    onConfirm={confirmCancel}
                    onCancel={() => setConfirmOpen(false)}
                />
            </div>
        </>
    );
};

export default EventDetailPage;
