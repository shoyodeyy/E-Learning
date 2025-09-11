import { Calendar, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { apiUrl } from "../../../services/http.jsx";
import { toast } from "react-toastify";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";

export default function CreateEventForm() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { token } = useAuth();

    const categories = [
        'Cultural Event',
        'Technical Fests',
        'Sports Meets',
        'Annual Day Functions',
        'Workshops and Seminars',
        'Intercollegiate Competitions'
    ];

    const [formData, setFormData] = useState({
        title: '',
        // Set a valid default to satisfy backend `in:` rule
        category: 'Cultural Event',
        description: '',
        startAt: '',
        duration_minutes: '',
        venue: '',
        maxParticipants: '',
        registrationDeadline: '',
        bannerImage: null
    });

    const handleChange = (e) => {
        const { name, value  } = e.target;
        setFormData(prev => ({
            ...prev,
            [name] : value
        }));
    }

    const handleFileChange = (e) =>  {
        setFormData(prev =>  ({
            ...prev,
            bannerImage: e.target.files[0]
        }));
    }

    // const validateForm = () => {
    //     let newErrors = {};
    //     let isValid = true;
    //
    //     if (!formData.title.trim()) {
    //         newErrors.title = 'Title is required.';
    //         isValid = false;
    //     }
    //
    //     if (!formData.description.trim()) {
    //         newErrors.description = 'Description is required.';
    //         isValid = false;
    //     }
    //
    //     if (!formData.category) {
    //         newErrors.category = 'Category is required.';
    //         isValid = false;
    //     }
    //
    //     if (!formData.startAt) {
    //         newErrors.startAt = 'Event date and time is required.';
    //         isValid = false;
    //     }
    //
    //     if (!formData.duration_minutes) {
    //         newErrors.duration_minutes = 'Duration is required.';
    //         isValid = false;
    //     }
    //
    //     if (!formData.venue.trim()) {
    //         newErrors.venue = 'Venue is required.';
    //         isValid = false;
    //     }
    //
    //     if (!formData.maxParticipants) {
    //         newErrors.maxParticipants = 'Max participants is required.';
    //         isValid = false;
    //     }
    //
    //     if (!formData.registrationDeadline) {
    //         newErrors.registrationDeadline = 'Registration deadline is required.';
    //         isValid = false;
    //     }
    //
    //     if (!formData.bannerImage) {
    //         newErrors.bannerImage = 'Banner image is required.';
    //         isValid = false;
    //     }
    //
    //     setErrors(newErrors);
    //     return isValid;
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

            // if (!validateForm()) {
        //     setLoading(false);
        //     return;
        // }

        const startAtFormatted = formData.startAt.replace('T', ' ') + ':00';
        const registrationDeadlineFormatted = formData.registrationDeadline.replace('T', ' ') + ':00';

        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('start_at', startAtFormatted);
        data.append('duration_minutes', formData.duration_minutes);
        data.append('venue', formData.venue);
        data.append('maxParticipants', formData.maxParticipants);
        data.append('registrationDeadline', registrationDeadlineFormatted);
        if (formData.bannerImage) {
            data.append('bannerImage', formData.bannerImage);
        }

        try {
            await axios.post(`${apiUrl}/events`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                }
            });

            toast.success('Event created successfully!');
            navigate('/organizer/events?page=1');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const serverErrors = error.response.data.errors || {};
                // Map backend snake_case keys to form field names when needed
                const mapped = {
                    ...serverErrors,
                    ...(serverErrors.start_at ? { startAt: serverErrors.start_at } : {}),
                };
                setErrors(mapped);
            } else {
                toast.error('Failed to create event.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Main Content */}
            <div className="flex-1">
                {/* Title Page */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 px-4">
                    <h2 className="text-xl font-semibold text-gray-800">Create Events</h2>
                </div>

                {/* Form Content */}
                <div className="p-4">
                    <div
                        className="bg-white rounded-lg border border-gray-200 p-6"
                    >
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Event Information</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Update the details for your existing event. All fields are pre-filled with current data.
                                </p>
                            </div>

                            {/* Title */}
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                />
                                {errors.title &&
                                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                                }
                            </div>

                            {/* Description */}
                            <div>
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                />
                                {errors.description &&
                                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                }
                            </div>

                            {/* Category and Event Date and Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="category"
                                        className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 appearance-none cursor-pointer"
                                        >
                                            {categories.map((cat) => (
                                                <option
                                                    key={cat}
                                                    value={cat}>{cat}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
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
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                        />
                                    </div>
                                    {errors.startAt && <p className="text-red-500 text-xs mt-1">{errors.startAt}</p>}
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
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                />
                                {errors.duration_minutes && <p className="text-red-500 text-xs mt-1">{errors.duration_minutes}</p>}
                            </div>

                            {/* Venue */}
                            <div>
                                <label
                                    htmlFor="venue"
                                    className="block text-sm font-medium text-gray-700 mb-2">
                                    Venue
                                </label>
                                <input
                                    type="text"
                                    id="venue"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                />
                                {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue}</p>}
                            </div>

                            {/* Max Participants and Registration Deadline */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="maxParticipants"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Max Participants
                                    </label>
                                    <input
                                        type="number"
                                        id="maxParticipants"
                                        name="maxParticipants"
                                        value={formData.maxParticipants}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                    />
                                    {errors.maxParticipants && <p className="text-red-500 text-xs mt-1">{errors.maxParticipants}</p>}
                                </div>

                                <div>
                                    <label
                                        htmlFor="registrationDeadline"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Registration Deadline
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            id="registrationDeadline"
                                            name="registrationDeadline"
                                            value={formData.registrationDeadline}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                        />
                                        {/*<Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />*/}
                                    </div>
                                    {errors.registrationDeadline && <p className="text-red-500 text-xs mt-1">{errors.registrationDeadline}</p>}
                                </div>
                            </div>

                            {/* Banner Image */}
                            <div>
                                <label
                                    htmlFor="bannerImage"
                                    className="block text-sm font-medium text-gray-700 mb-2">
                                    Banner Image
                                </label>
                                <input
                                    type="file"
                                    id="bannerImage"
                                    name="bannerImage"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                />
                                {errors.bannerImage && <p className="text-red-500 text-xs mt-1">{errors.bannerImage}</p>}
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
                                    onClick={handleSubmit}
                                    className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
