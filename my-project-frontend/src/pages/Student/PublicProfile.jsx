import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ProfileSidebar from "./Components-student/ProfileSidebar.jsx";
import { getProfile, updateProfile } from "../../api/profileApi.js";
import Header from "../../components/Header.jsx";

export default function PublicProfile() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    // Load user profile
    useEffect(() => {
        getProfile()
            .then((u) => {
                setUser(u);
                setFormData({
                    name: u?.name || "",
                    email: u?.email || "",
                    gender: u?.gender || "",
                    profile: u?.profile || "",
                    address: u?.address || "",
                    phone: u?.phone || "",
                    avatar: null,
                });
            })
            .catch(() => toast.error("Failed to load profile ❌"));
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        const fieldValue = files ? files[0] : value;

        // Cập nhật formData
        setFormData((prev) => ({ ...prev, [name]: fieldValue }));

        // Nếu có lỗi của field này, xóa nó
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };


    // Validate form
    const validate = () => {
        const newErrors = {};

        if (!formData.name || formData.name.trim() === "") {
            newErrors.name = "Full Name is required";
        }

        if (!formData.address || formData.address.trim() === "") {
            newErrors.address = "Address is required";
        }

        if (!formData.phone || formData.phone.trim() === "") {
            newErrors.phone = "Phone is required";
        } else if (!/^\d{10,15}$/.test(formData.phone)) {
            newErrors.phone = "Phone must be 10-15 digits";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate trước
        if (!validate()) return;

        // Hiển thị confirm dialog
        const confirmUpdate = window.confirm("Do you want to update your profile?");
        if (!confirmUpdate) return; // nếu người dùng chọn "No" thì dừng

        setProcessing(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== null && formData[key] !== "") {
                    data.append(key, formData[key]);
                }
            });
            const result = await updateProfile(data);
            setUser(result.user);
            toast.success(result.message || "Profile updated successfully ✅", {
                onClose: () => window.location.reload(),
            });


            setErrors({});
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Update failed ❌");
        } finally {
            setProcessing(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50">
                <Header/>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Sidebar */}
                    <div className="col-span-1 md:col-span-3 order-1 md:order-1">
                        <ProfileSidebar user={user} />
                    </div>

                    {/* Form */}
                    <section className="col-span-1 md:col-span-9 order-2 md:order-2 bg-white shadow rounded p-6">
                        <h1 className="text-2xl font-semibold mb-4">Public Profile</h1>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                            encType="multipart/form-data"
                        >
                            {/* Name */}
                            <div>
                                <label className="block font-medium mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-purple-500 ${
                                        errors.name ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    readOnly
                                    className="w-full border rounded px-3 py-2 bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed focus:outline-none focus:ring-0"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block font-medium mb-2">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-purple-500 cursor-pointer"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Avatar */}
                            <div>
                                <label className="block font-medium mb-2">Avatar</label>
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-purple-500 cursor-pointer"
                                />
                            </div>

                            {/* Biography */}
                            <div>
                                <label className="block font-medium mb-2">Biography</label>
                                <textarea
                                    name="profile"
                                    value={formData.profile}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-purple-500"
                                ></textarea>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block font-medium mb-2">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-purple-500 ${
                                        errors.address ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block font-medium mb-2">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-purple-500 ${
                                        errors.phone ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
                            >
                                {processing ? "Saving..." : "Save"}
                            </button>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}
