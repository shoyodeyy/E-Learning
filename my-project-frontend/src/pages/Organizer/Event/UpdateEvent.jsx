import { useState } from "react";
import { Search, Calendar, Upload, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpdateEventForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "Annual Tech Innovation Summit",
        description:
            "Join us for a day of groundbreaking discussions, workshops, and networking opportunities with leaders in technology. Explore the future of AI, blockchain, and sustainable tech.",
        category: "Technology",
        status: "Published",
        eventDate: "November 15th, 2024",
        eventTime: "",
        venue: "Innovation Hub Convention Center, Hall 3",
        organizer: "Tech Innovators Inc.",
        approvedBy: "Sarah Chen",
        maxParticipants: "500",
        registrationDeadline: "October 31st, 2024",
        bannerImage: null,
    });

    const [dragActive, setDragActive] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
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
            setFormData((prev) => ({ ...prev, bannerImage: files[0] }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Main Content */}
            <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 px-4">
                    <h2 className="text-xl font-semibold text-gray-800">Update Events</h2>
                </div>
                {/* Form Content */}
                <div className="p-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Event Information</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Update the details for your existing event. All fields are pre-filled with current data.
                                </p>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                />
                            </div>

                            {/* Category and Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <div className="relative">
                                        <select
                                            value={formData.category}
                                            onChange={(e) => handleInputChange("category", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 appearance-none cursor-pointer"
                                        >
                                            <option value="Technology">Technology</option>
                                            <option value="Business">Business</option>
                                            <option value="Arts">Arts</option>
                                            <option value="Sports">Sports</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <div className="relative">
                                        <select
                                            value={formData.status}
                                            onChange={(e) => handleInputChange("status", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 appearance-none cursor-pointer"
                                        >
                                            <option value="Published">Published</option>
                                            <option value="Draft">Draft</option>
                                            <option value="Pending">Pending</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Event Date and Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.eventDate}
                                            onChange={(e) => handleInputChange("eventDate", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Time</label>
                                    <div className="relative">
                                        <select
                                            value={formData.eventTime}
                                            onChange={(e) => handleInputChange("eventTime", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 appearance-none cursor-pointer"
                                        >
                                            <option value="">Select time</option>
                                            <option value="9:00 AM">9:00 AM</option>
                                            <option value="10:00 AM">10:00 AM</option>
                                            <option value="2:00 PM">2:00 PM</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
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
                            </div>

                            {/* Organizer and Approved By */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Organizer</label>
                                    <div className="relative">
                                        <select
                                            value={formData.organizer}
                                            onChange={(e) => handleInputChange("organizer", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 appearance-none cursor-pointer"
                                        >
                                            <option value="Tech Innovators Inc.">Tech Innovators Inc.</option>
                                            <option value="Event Solutions">Event Solutions</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Approved By Admin</label>
                                    <div className="relative">
                                        <select
                                            value={formData.approvedBy}
                                            onChange={(e) => handleInputChange("approvedBy", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 appearance-none cursor-pointer"
                                        >
                                            <option value="Sarah Chen">Sarah Chen</option>
                                            <option value="John Doe">John Doe</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
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
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Deadline</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.registrationDeadline}
                                            onChange={(e) => handleInputChange("registrationDeadline", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Banner Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                        dragActive ? "border-purple-400 bg-purple-50" : "border-gray-300 bg-gray-50"
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {formData.bannerImage ? (
                                        <div className="space-y-2">
                                            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <img
                                                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop"
                                                    alt="Event banner"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600">Banner image uploaded</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <img
                                                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop"
                                                    alt="Current event banner"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-2">Drag 'n' drop a file here, or click to select</p>
                                                <p className="text-xs text-gray-500">Max file size: 5MB</p>
                                                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="file-upload" />
                                                <label
                                                    htmlFor="file-upload"
                                                    className="inline-block mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                                                >
                                                    Choose File
                                                </label>
                                            </div>
                                        </div>
                                    )}
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
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
