import { useNavigate } from "react-router-dom";
import { Edit, Key } from "lucide-react";

import Avatar from "../../components/Avatar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleEditProfile = () => {
        navigate("/user/edit-profile");
    };

    const handleChangePassword = () => {
        navigate("/user/change-password")
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-6xl mx-auto py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        Participant Profile
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Personal Information
                        </h2>

                        <div className="flex items-start space-x-4 mb-6">
                            <Avatar size={80} />

                            <div className="flex-1">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Name
                                    </label>
                                    <p className="text-gray-900 font-medium">{user.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Gender
                                    </label>
                                    <p className="text-gray-900">{user.gender}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                About Me
                            </label>
                            <p className="text-gray-700 text-sm leading-relaxed">{user.profile}</p>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Email
                                </label>
                                <p className="text-gray-900">{user.email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Phone
                                </label>
                                <p className="text-gray-900">{user.phone}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Address
                                </label>
                                <p className="text-gray-900">{user.address}</p>
                            </div>
                        </div>
                    </div>

                    {["organizer", "admin"].includes(user?.role) && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Organizational Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Department
                                    </label>
                                    <p className="text-gray-900">{user.department || "-"}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Enrollment Number
                                    </label>
                                    <p className="text-blue-600 font-medium">{user.enrollment_no || "-"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Actions</h2>

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
