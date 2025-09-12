import { useState, useEffect } from "react";
import { Search, Calendar, Upload, ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../../services/http.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import {toast} from "react-toastify";

export default function UpdateEventForm() {
    const navigate = useNavigate();

    const { id } = useParams();
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        description: "",
        startAt: "",
        duration_minutes: "",
        venue: "",
        maxParticipants: "",
        registrationDeadline: "",
        bannerImage: null
    });

    const [currentBannerUrl, setCurrentBannerUrl] = useState(""); // Lưu URL ảnh hiện tại

    const categories = [
        'Cultural Event',
        'Technical Fests',
        'Sports Meets',
        'Annual Day Functions',
        'Workshops and Seminars',
        'Intercollegiate Competitions'
    ];

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`${apiUrl}/events/${id}`, {
                    headers: token ? {
                        Authorization: `Bearer ${token}`
                    } : {}
                });

                const event = res.data.data;

                setFormData({
                    title: event.title || "",
                    category: event.category || "",
                    description: event.description || "",
                    startAt: event.start_at
                        ? event.start_at.replace(" ", "T").slice(0, 16)
                        : "",
                    duration_minutes: event.duration_minutes || "",
                    venue: event.venue || "",
                    maxParticipants: event.maxParticipants || "",
                    registrationDeadline: event.registrationDeadline
                        ? event.registrationDeadline.replace(" ", "T").slice(0, 16)
                        : "",
                    bannerImage: null // Không set file cũ, chỉ để hiển thị
                });

                // Set URL ảnh hiện tại để hiển thị
                if (event.bannerImage) {
                    // Nếu bannerImage đã có http thì dùng luôn, không thì thêm domain
                    const imageUrl = event.bannerImage.startsWith('http') 
                        ? event.bannerImage 
                        : `http://localhost:8000/${event.bannerImage}`;
                    setCurrentBannerUrl(imageUrl);
                }
            } catch (error) {
                console.log("Failed to fetch event: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchEvent();
    }, [id, token]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            setFormData((prev) => ({ ...prev, bannerImage: files[0] }));
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                bannerImage: files[0]
            }));
        }
    };

    // Helper function để lấy URL hiển thị ảnh
    const getImageDisplayUrl = () => {
        if (formData.bannerImage instanceof File) {
            // Ảnh mới được chọn
            return URL.createObjectURL(formData.bannerImage);
        } else if (currentBannerUrl) {
            // Ảnh cũ từ database
            return currentBannerUrl;
        } else {
            // Ảnh mặc định
            return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop";
        }
    };

    // validate form
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        // Title
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required.';
            isValid = false;
        }

        // StartAt
        if (!formData.startAt) {
            newErrors.startAt = 'Event date and time is required.';
            isValid = false;
        } else {
            const startAtDate = new Date(formData.startAt);

            if (startAtDate <= new Date()) {
                newErrors.startAt = 'Event date and time must be in the future.';
                isValid = false;
            }
        }

        // Duration
        if (!formData.duration_minutes) {
            newErrors.duration_minutes = 'Duration is required.';
            isValid = false;
        } else if (formData.duration_minutes <= 0) {
            newErrors.duration_minutes = 'Duration must be greater than 0.';
            isValid = false;
        } else if (formData.duration_minutes > 1440) {
            newErrors.duration_minutes = 'Duration cannot exceed 1440 minutes (24 hours).';
            isValid = false;
        }

        // Venue
        if (!formData.venue.trim()) {
            newErrors.venue = 'Venue is required.';
            isValid = false;
        }

        // Max Participants
        if (!formData.maxParticipants) {
            newErrors.maxParticipants = 'Max participants is required.';
            isValid = false;
        } else if (formData.maxParticipants <= 0) {
            newErrors.maxParticipants = 'Max participants must be greater than 0.';
            isValid = false;
        } else if (formData.maxParticipants > 100000) {
            newErrors.maxParticipants = 'Max participants cannot exceed 100000.';
            isValid = false;
        }

        // Registration Deadline
        if (!formData.registrationDeadline) {
            newErrors.registrationDeadline = 'Registration deadline is required.';
            isValid = false;
        } else {
            const regDeadline = new Date(formData.registrationDeadline);
            const now = new Date();
            const startAtDate = formData.startAt ? new Date(formData.startAt) : null;

            if (regDeadline <= now) {
                newErrors.registrationDeadline = 'Registration deadline must be in the future.';
                isValid = false;
            }
            if (startAtDate && regDeadline >= startAtDate) {
                newErrors.registrationDeadline = 'Registration deadline must be before the event date and time.';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        const startAtFormatted = formData.startAt.replace("T", " ") + ":00";
        const registrationDeadlineFormatted =
            formData.registrationDeadline.replace("T", " ") + ":00";

        const data = new FormData();
        data.append("title", formData.title);
        data.append("category", formData.category);
        data.append("description", formData.description);
        data.append("start_at", startAtFormatted);
        data.append("duration_minutes", formData.duration_minutes);
        data.append("venue", formData.venue);
        data.append("maxParticipants", formData.maxParticipants);
        data.append("registrationDeadline", registrationDeadlineFormatted);

        // Nếu user upload ảnh mới thì gửi, còn không giữ ảnh cũ
        if (formData.bannerImage instanceof File) {
            data.append("bannerImage", formData.bannerImage);
        }

        try {
            await axios.post(`${apiUrl}/events/${id}?_method=PUT`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    ...(token ? {
                        Authorization: `Bearer ${token}`
                    } : {})
                }
            });

            toast.success("Event updated successfully!");

            navigate("/organizer/manage-events");
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const serverErrors = error.response.data.errors || {};
                setErrors(serverErrors);
            } else {
                toast.error("Failed to update event.");
            }
        } finally {
            setLoading(false);
        }
    };
    console.log("Token in UpdateEventForm:", token);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Main Content */}
            <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 px-4">
                    <h2 className="text-xl font-semibold text-gray-800">Update Events</h2>
                </div>
                {/* Form Content */}
                <div className="p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Event Information</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Update the details for your existing event. All fields are pre-filled with current data.
                                </p>
                            </div>

                            {/* Banner Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Banner Image
                                </label>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                        dragActive ? "border-purple-400 bg-purple-50" : "border-gray-300 bg-gray-50"
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="space-y-2">
                                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <img
                                                src={getImageDisplayUrl()}
                                                alt="Event banner"
                                                className="w-full h-full object-cover rounded-lg"
                                                onError={(e) => {
                                                    // Fallback nếu ảnh không load được
                                                    e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop";
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {formData.bannerImage instanceof File 
                                                    ? "New image selected" 
                                                    : "Current image (drag 'n' drop or click to change)"
                                                }
                                            </p>
                                            <p className="text-xs text-gray-500">Max file size: 2MB</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="inline-block mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                                            >
                                                {formData.bannerImage instanceof File ? "Change Image" : "Upload New Image"}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Category and Event Date and Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.category}
                                            onChange={(e) => handleInputChange("category", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 appearance-none cursor-pointer"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.category}
                                            </p>
                                        )}
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="startAt"
                                        className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Date and Time
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            id="startAt"
                                            name="startAt"
                                            value={formData.startAt}
                                            onChange={(e) =>
                                                handleInputChange("startAt", e.target.value)
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                        />
                                    </div>
                                    {errors.startAt && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.startAt}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Duration (minutes) */}
                            <div>
                                <label
                                    htmlFor="duration_minutes"
                                    className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    id="duration_minutes"
                                    name="duration_minutes"
                                    min="1"
                                    max="1440"
                                    value={formData.duration_minutes}
                                    onChange={(e) =>
                                        handleInputChange("duration_minutes", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                />
                                {errors.duration_minutes && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.duration_minutes}
                                    </p>
                                )}
                            </div>

                            {/* Venue */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                                <input
                                    type="text"
                                    value={formData.venue}
                                    onChange={(e) => handleInputChange("venue", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                />
                                {errors.venue && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.venue}
                                    </p>
                                )}
                            </div>

                            {/* Max Participants and Registration Deadline */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                                    <input
                                        type="number"
                                        value={formData.maxParticipants}
                                        onChange={(e) => handleInputChange("maxParticipants", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                    />
                                    {errors.maxParticipants && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.maxParticipants}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Deadline</label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            value={formData.registrationDeadline}
                                            onChange={(e) => handleInputChange("registrationDeadline", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                        />
                                        {errors.registrationDeadline && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.registrationDeadline}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => navigate(-1)}
                                    type="button"
                                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}