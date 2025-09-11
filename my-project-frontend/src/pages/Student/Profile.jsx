import { Edit, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock user data
const mockUserData = {
    name: "Alice Johnson",
    gender: "Female",
    email: "alice.johnson@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Anytown, CA 90210",
    department: "Community Health",
    enrollmentNumber: "ENR-789012",
    avatar: "https://images.pexels.com/photos/9072375/pexels-photo-9072375.jpeg",
    aboutMe:
        "Alice is a dedicated member of the community health program, with a deep interest in sustainable and healthy lifestyles. She actively contributes to various community initiatives and is passionate about making a positive impact in her field.",
};

export default function Profile() {
    const navigate = useNavigate();

    const handleEditProfile = () => {
        console.log("Edit profile clicked");
    };

    const handleChangePassword = () => {
        navigate("/user/change-password")
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Participant Profile</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>

                        <div className="flex items-start space-x-4 mb-6">
                            <img
                                src={mockUserData.avatar || "/placeholder.svg"}
                                alt={mockUserData.name}
                                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div className="flex-1">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                                    <p className="text-gray-900 font-medium">{mockUserData.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                                    <p className="text-gray-900">{mockUserData.gender}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">About Me</label>
                            <p className="text-gray-700 text-sm leading-relaxed">{mockUserData.aboutMe}</p>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                <p className="text-gray-900">{mockUserData.email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                                <p className="text-gray-900">{mockUserData.phone}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                                <p className="text-gray-900">{mockUserData.address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Organizational Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Organizational Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                                <p className="text-gray-900">{mockUserData.department}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Enrollment Number</label>
                                <p className="text-blue-600 font-medium">{mockUserData.enrollmentNumber}</p>
                            </div>
                        </div>
                    </div>

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
