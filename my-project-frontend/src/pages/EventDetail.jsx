import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { Calendar, Clock, MapPin, Users, Share2, Heart, CalendarPlus, User, Star, Send } from "lucide-react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

import Header from "../components/Header";
import CalendarInegration from "../components/CalendarIntegration";
import ShareEvent from "../components/ShareButton";

// Mock data for the event detail
const eventData = {
    id: 1,
    title: "Global Tech Summit 2024: Innovate & Connect",
    date: "October 26-28, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "San Francisco Convention Center, CA",
    price: 299,
    currency: "$",
    status: "Available",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    description:
        "Join us for the most anticipated technology event of the year! The Global Tech Summit 2024 brings together industry leaders, innovators, and enthusiasts to explore the latest advancements in AI, cybersecurity, blockchain, and sustainable tech. Engage in thought-provoking keynotes, hands-on workshops, and unparalleled networking opportunities. Discover the future of technology and how it will shape our world.",
    organizer: {
        name: "EventSphere Organizers",
        tagline: "Leading Event Management Solutions",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
    },
    categories: ["Technology", "All Levels"],
    totalSlots: 500,
    availableSlots: 150,
    agenda: [
        "Day 1: Opening Keynote on AI's Future & Interactive Workshops",
        "Day 2: Cybersecurity Challenges & Blockchain Innovations",
        "Day 3: Sustainable Tech Solutions & Closing Remarks",
        "Daily: Networking Lounges & Exhibition Hall Access",
    ],
};

// Mock feedbacks
const mockFeedbacks = [
    {
        id: 1,
        user: {
            name: "Alice Johnson",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        rating: 5,
        comment: "Amazing event! The workshops were highly informative and engaging.",
        date: "2024-10-28",
        helpful: 12,
    },
    {
        id: 2,
        user: {
            name: "Mark Thompson",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        rating: 4,
        comment: "Great networking opportunities, but the schedule felt a bit tight.",
        date: "2024-10-27",
        helpful: 8,
    },
    {
        id: 3,
        user: {
            name: "Sophie Lee",
            avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        },
        rating: 5,
        comment: "Loved the keynote on AI trends! Learned a lot about emerging tech.",
        date: "2024-10-26",
        helpful: 15,
    },
    {
        id: 4,
        user: {
            name: "Daniel Kim",
            avatar: "https://randomuser.me/api/portraits/men/47.jpg",
        },
        rating: 3,
        comment: "Good content, but the venue was a bit crowded.",
        date: "2024-10-28",
        helpful: 4,
    },
    {
        id: 5,
        user: {
            name: "Emma Wilson",
            avatar: "https://randomuser.me/api/portraits/women/12.jpg",
        },
        rating: 4,
        comment: "Workshops were excellent. Would love more hands-on sessions next time.",
        date: "2024-10-27",
        helpful: 7,
    },
];

const FeedbackSection = () => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showSubmitForm, setShowSubmitForm] = useState(false);

    const handleRatingClick = (value) => {
        setRating(value);
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            alert("Please select a rating before submitting");
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setSubmitted(true);
        setIsSubmitting(false);

        // Reset form after 2 seconds and hide form
        setTimeout(() => {
            setSubmitted(false);
            setRating(0);
            setComment("");
            setShowSubmitForm(false);
        }, 2000);
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

    if (submitted) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✅</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                <p className="text-gray-600">Your feedback has been submitted successfully.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header with Submit Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Event Feedback</h1>
                    <p className="text-gray-600">See what others think about this event</p>
                </div>
                {!showSubmitForm && (
                    <button
                        onClick={() => setShowSubmitForm(true)}
                        className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
                    >
                        <Send className="w-4 h-4" />
                        <span>Write Review</span>
                    </button>
                )}
            </div>

            {/* Submit Form (when toggled) */}
            {showSubmitForm && (
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Submit Your Feedback</h2>

                    {/* Rating Section */}
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

                    {/* Comments Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Comments</h3>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts on the event..."
                            rows={4}
                            maxLength={500}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
                        />
                        <p className="text-sm text-gray-500 mt-2">{comment.length}/500 characters</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={handleSubmit}
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
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Submit Feedback</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => {
                                setShowSubmitForm(false);
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

            {/* Feedback Statistics */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">4.5</div>
                        <div className="flex justify-center mb-2">{renderStars(4.5)}</div>
                        <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">{mockFeedbacks.length}</div>
                        <div className="text-sm text-gray-600">Total Reviews</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">94%</div>
                        <div className="text-sm text-gray-600">Recommended</div>
                    </div>
                </div>
            </div>

            {/* Feedback List */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Reviews ({mockFeedbacks.length})</h2>

                {mockFeedbacks.map((feedback) => (
                    <div key={feedback.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        {/* User Info */}
                        <div className="flex items-start space-x-4">
                            <img src={feedback.user.avatar} alt={feedback.user.name} className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{feedback.user.name}</h4>
                                        <div className="flex items-center space-x-2 mt-1">
                                            {renderStars(feedback.rating)}
                                            <span className="text-sm text-gray-500">• {formatDate(feedback.date)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Comment */}
                                <p className="text-gray-700 leading-relaxed mb-3">{feedback.comment}</p>

                                {/* Helpful Button */}
                                <div className="flex items-center space-x-4">
                                    <button className="cursor-pointer flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                        <span>👍</span>
                                        <span>Helpful ({feedback.helpful})</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            <div className="text-center">
                <button className="cursor-pointer px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Load More Reviews
                </button>
            </div>
        </div>
    );
};

const EventDetailPage = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [isFavorited, setIsFavorited] = useState(false);
    const { id } = useParams();
    const eventId = Number(id) || eventData.id;
    const [reg, setReg] = useState({ registered: false, status: null });

    const handleCancelRegistration = async () => {
        try {
            const res = await api.post(`/events/${eventId}/cancel`);
            toast.success(res.data?.message || "Đã hủy đăng ký sự kiện");
            setReg({ registered: false, status: 'cancelled' });
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || "Hủy đăng ký thất bại";
            toast.error(msg);
        }
    };

    // Lấy trạng thái đăng ký của user cho event để hiện nút phù hợp
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get(`/events/${eventId}/registration/status`);
                setReg(res.data);
            } catch (e) {
                // nếu chưa đăng nhập hoặc lỗi khác, ẩn nút hủy
                setReg({ registered: false, status: null });
            }
        })();
    }, [eventId]);

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
                        <img src={eventData.image} alt={eventData.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </div>

                    {/* Event Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="max-w-7xl mx-auto">
                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">{eventData.title}</h1>
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
                                            <p className="font-semibold text-gray-900">{eventData.date}</p>
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
                                            <p className="font-semibold text-gray-900">{eventData.time}</p>
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
                                            <p className="font-semibold text-gray-900">{eventData.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Organizer Info */}
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
                            </div>

                            {/* Category Tags */}
                            <div className="flex flex-wrap gap-3">
                                {eventData.categories.map((category, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <ShareEvent event={eventData.title}>
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
                                {/* <CalendarInegration eventId={}> */}
                                    <button className="cursor-pointer flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-lg border border-gray-200 transition-all duration-200">
                                        <CalendarPlus className="w-5 h-5" />
                                        <span>Add to Calendar</span>
                                    </button>
                                {/* </CalendarInegration> */}
                            </div>

                            {/* Navigation Tabs */}
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                                <div className="border-b border-gray-200">
                                    <nav className="flex space-x-8 px-6">
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
                                                <p className="text-gray-700 leading-relaxed">{eventData.description}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-4">Event Agenda</h3>
                                                <div className="space-y-3">
                                                    {eventData.agenda.map((item, index) => (
                                                        <div key={index} className="flex items-start space-x-3">
                                                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                                            <p className="text-gray-700">{item}</p>
                                                        </div>
                                                    ))}
                                                </div>
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

                                    {activeTab === "feedback" && <FeedbackSection />}
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
                                            <span className="text-4xl font-bold">
                                                {eventData.currency}
                                                {eventData.price}
                                            </span>
                                            <span className="text-purple-100">/person</span>
                                        </div>
                                    </div>

                                    {/* Registration Content */}
                                    <div className="p-6 space-y-6">
                                        {/* Availability Status */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className={`w-3 h-3 rounded-full ${getAvailabilityColor(
                                                        eventData.availableSlots,
                                                        eventData.totalSlots
                                                    )}`}
                                                ></div>
                                                <span className="text-sm font-medium text-gray-700">{eventData.status}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-gray-600">
                                                <Users className="w-4 h-4" />
                                                <span className="text-sm">
                                                    {eventData.availableSlots} / {eventData.totalSlots} slots
                                                </span>
                                            </div>
                                        </div>

                                        {/* Register Button */}
                                        {(!reg.registered || reg.status === 'cancelled') && (
                                            <Link to={`/event/${eventId}/seat`} className="w-full inline-flex justify-center btn-gradient-l">
                                                Register Now
                                            </Link>
                                        )}
                                        {reg.registered && reg.status !== 'cancelled' && (
                                            <button onClick={handleCancelRegistration} className="mt-3 w-full inline-flex justify-center items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer">
                                                Cancel Registration
                                            </button>
                                        )}

                                        <p className="text-xs text-gray-500 text-center">Taxes and fees may apply.</p>

                                        {/* Additional Info */}
                                        <div className="border-t pt-6 space-y-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Duration:</span>
                                                <span className="font-medium">3 Days</span>
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
            </div>
        </>
    );
};

export default EventDetailPage;
