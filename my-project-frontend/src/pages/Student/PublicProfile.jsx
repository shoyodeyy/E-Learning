import React, { useEffect, useState } from "react";
import Header from "../../components/Header.jsx";
import ProfileSidebar from "../../components/ProfileSidebar.jsx";
import api from "../../api/axios.js";

export default function PublicProfile() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Load user profile từ backend
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/user"); // GET /api/user
                setUser(res.data);
                setFormData({
                    name: res.data.name || "",
                    email: res.data.email || "",
                    gender: res.data.gender || "",
                    profile: res.data.profile || "",
                    address: res.data.address || "",
                    phone: res.data.phone || "",
                    avatar: null,
                });
            } catch (err) {
                alert("Failed to load user profile. Please login.");
            }
        };
        fetchUser();
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">Loading...</div>
        );
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== null && formData[key] !== "") {
                    data.append(key, formData[key]);
                }
            });

            const res = await api.post("/profile/update", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setUser(res.data.user); // cập nhật state user
            alert("Profile updated successfully!");
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                alert(err.response?.data?.message || "Update failed!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-12 gap-6">
                    <ProfileSidebar user={user} />

                    <section className="col-span-9 bg-white shadow rounded p-6">
                        <h1 className="text-2xl font-semibold mb-4">Public profile</h1>

                        <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                            {/* Name */}
                            <div>
                                <label className="block font-medium mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                                        errors.name
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-purple-500"
                                    }`}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                                        errors.email
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-purple-500"
                                    }`}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block font-medium mb-2">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar[0]}</p>}
                            </div>

                            {/* Profile */}
                            <div>
                                <label className="block font-medium mb-2">Biography</label>
                                <textarea
                                    name="profile"
                                    value={formData.profile}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Tell us a bit about yourself..."
                                ></textarea>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block font-medium mb-2">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block font-medium mb-2">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                                        errors.phone
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-purple-500"
                                    }`}
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}
