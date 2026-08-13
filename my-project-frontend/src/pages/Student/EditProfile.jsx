import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext.jsx";
import { updateProfile } from "../../api/profileApi.js";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import {useNavigate} from "react-router-dom";

export default function EditProfile() {
    const { user, updateUser } = useAuth();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            let enrollmentNo = user.enrollment_no || "";
            // Chỉ lấy 6 chữ số cuối, bỏ prefix
            if (["admin", "organizer"].includes(user.role) && enrollmentNo.length > 3) {
                enrollmentNo = enrollmentNo.slice(-6);
            }

            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                gender: user.gender || "",
                profile: user.profile || "",
                department: user.department || "",
                enrollment_no: enrollmentNo,
            });
        }
    }, [user]);


    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        const fieldValue = files && files.length > 0 ? files[0] : value;

        setFormData((prev) => ({
            ...prev,
            [name]: fieldValue,
        }));

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name?.trim()) newErrors.name = "Full Name is required";
        if (!formData.address?.trim()) newErrors.address = "Address is required";
        if (!formData.phone?.trim()) {
            newErrors.phone = "Phone is required";
        } else if (!/^(0|\+84)[0-9]{9,10}$/.test(formData.phone)) {
            newErrors.phone = "Phone must start with 0 or +84 and be 10–11 digits total";
        }
        if (!formData.gender?.trim()) newErrors.gender = "Gender is required";
        if (["organizer", "admin"].includes(user?.role)) {
            if (!formData.department?.trim()) {
                newErrors.department = "Department is required";
            }
            if (!formData.enrollment_no?.trim()) {
                newErrors.enrollment_no = "Enrollment Number is required";
            } else if (!/^[0-9]{6}$/.test(formData.enrollment_no)) {
                newErrors.enrollment_no = "Enrollment Number must be exactly 6 digits";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        setConfirmOpen(true); // chỉ mở confirm dialog, không gọi API
    };

    const handleConfirm = async () => {
        setConfirmOpen(false);
        setProcessing(true);
        try {
            const data = new FormData();

            Object.keys(formData).forEach((key) => {
                if (formData[key] !== null && formData[key] !== "") {
                        data.append(key, formData[key]);
                }
            });

            const result = await updateProfile(data);
            updateUser(result.user);
            toast.success(result.message || "Profile updated successfully ✅");
            setErrors({});

            // navigate
            navigate('/user/profile');
        } catch (error) {
            console.error(error);

            if (error.response) {
                const { status, data } = error.response;
                if (status === 422 && data.errors) {
                    setErrors(data.errors);
                    Object.values(data.errors).forEach((msgs) => toast.error(msgs[0]));
                } else if (data.message) {
                    toast.error(data.message);
                } else if (data.error) {
                    toast.error(data.error);
                } else {
                    toast.error("Update failed ❌");
                }
            } else {
                toast.error("Network error ❌");
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleCancel = () => {
        setConfirmOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <main className="max-w-6xl mx-auto px-4">
                <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

                        {/* Avatar */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Avatar</label>
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300 cursor-pointer"
                            />
                        </div>

                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                    errors.name ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        {/* Gender */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                    errors.gender ? "border-red-500" : "border-gray-300"
                                }`}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                        </div>

                        {/* About Me */}
                        <div>
                            <label className="block text-sm font-medium mb-1">About Me</label>
                            <textarea
                                name="profile"
                                value={formData.profile}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300 bg-white"
                            />
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-4">Contact Details</h2>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="w-full border rounded px-3 py-2 bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                            />
                        </div>

                        {/* Phone */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input
                                type="number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                    errors.phone ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                    errors.address ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                        </div>

                        {["participant"].includes(user?.role) && (
                            <div className="hidden sm:block">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`w-full btn-gradient mt-6 cursor-pointer ${
                                        processing ? "bg-purple-300 text-white cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700"
                                    }`}
                                >
                                    {processing ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    className="w-full mt-4 px-5 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Organizational Details */}
                    {["organizer", "admin"].includes(user?.role) && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold mb-4">Organizational Details</h2>

                            {/* Department */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Department</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                        errors.department ? "border-red-500" : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Select a department</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Electrical Engineering">Electrical Engineering</option>
                                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                                    <option value="Business Administration">Business Administration</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Finance and Accounting">Finance and Accounting</option>
                                    <option value="Human Resources">Human Resources</option>
                                    <option value="Event Management Office">Event Management Office</option>
                                    <option value="Library and Information Center">Library and Information Center</option>

                                </select>
                                {errors.department && (
                                    <p className="text-red-500 text-sm">{errors.department}</p>
                                )}
                            </div>

                            {/* Enrollment Number */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Enrollment Number  <span className="text-gray-400 text-xs ml-1">(Enter 6 digits)</span> </label>
                                <input
                                    type="number"
                                    name="enrollment_no"
                                    value={formData.enrollment_no}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 6) {
                                            handleInputChange(e);
                                        }
                                    }}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                        errors.enrollment_no ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.enrollment_no && (
                                    <p className="text-red-500 text-sm">{errors.enrollment_no}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div
                        className={`${
                            ["participant"].includes(user?.role) ? "block sm:hidden" : ""
                        } bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-start space-y-4`}
                    >
                        <h2 className="text-lg font-semibold">Actions</h2>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full btn-gradient cursor-pointer ${
                                processing ? "bg-purple-300 text-white cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700"
                            }`}
                        >
                            {processing ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            className="w-full mt-1 md:mt-4 px-5 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </main>

            <ConfirmDialog open={confirmOpen} message="Do you want to update your profile?" onConfirm={handleConfirm} onCancel={handleCancel} />
        </div>
    );
}
