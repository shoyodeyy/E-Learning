import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Edit, Key } from "lucide-react";

import Avatar from "../../components/Avatar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../api/axios.js";

export default function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [emailVerified, setEmailVerified] = useState(user.email_verified_at !== null);
    const [loading, setLoading] = useState(false);

    // Lấy trạng thái verify email realtime
    useEffect(() => {
        api.get("/email/verify-status")
            .then((res) => {
                setEmailVerified(res.data.verified);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleEditProfile = () => {
        if (user.role === "participant") navigate("/user/edit-profile");
        else if (user.role === "organizer") navigate("/organizer/edit-profile");
    };

    const handleChangePassword = () => {
        if (user.role === "participant") navigate("/user/change-password");
        else if (user.role === "organizer") navigate("/organizer/change-password");
    };

    const handleResendEmail = async () => {
        setLoading(true);
        try {
            const res = await api.post("/email/resend");
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Participant Profile</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>

                        <div className="flex items-start space-x-4 mb-4">
                            <Avatar size={80} />

                            <div className="flex-1">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                                    <p className="text-gray-900 font-medium">{user.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                                    <p className="text-gray-900">{user.gender}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">About Me</label>
                            <p className="text-gray-700 text-sm leading-relaxed">{user.profile}</p>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                <div className="flex items-center space-x-2">
                                    <p className="text-gray-900">{user.email}</p>
                                    {emailVerified ? (
                                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">Verified</span>
                                    ) : (
                                        <span className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded-full">Not Verified</span>
                                    )}
                                </div>
                                {!emailVerified && (
                                    <button
                                        onClick={handleResendEmail}
                                        disabled={loading}
                                        className="cursor-pointer mt-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                                    >
                                        {loading ? "Sending..." : "Resend Verification Email"}
                                    </button>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                                <p className="text-gray-900">{user.phone}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                                <p className="text-gray-900">{user.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Organizational Details */}
                    {["organizer", "admin"].includes(user?.role) && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Organizational Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                                    <p className="text-gray-900">{user.department || "-"}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Enrollment Number</label>
                                    <p className="text-blue-600 font-medium">{user.enrollment_no || "-"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>

                        <div className="space-y-3">
                            <button
                                onClick={handleEditProfile}
                                className="cursor-pointer w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                            >
                                <Edit size={18} />
                                <span className="font-medium">Edit Profile</span>
                            </button>

                            <button
                                onClick={handleChangePassword}
                                className="cursor-pointer w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            >
                                <Key size={18} />
                                <span className="font-medium">Change Password</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
