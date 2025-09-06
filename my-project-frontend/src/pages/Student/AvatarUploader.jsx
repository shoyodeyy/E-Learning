import React, { useEffect, useState } from "react";
import Header from "../../components/Header.jsx";
import ProfileSidebar from "../../components/ProfileSidebar.jsx";
import api from "../../api/axios.js";

export default function AvatarUploader() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Load user profile từ backend
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/user"); // GET /api/user
                setUser(res.data);
                setFormData({
                    avatar: null,
                });
                setPreview(res.data.avatarUrl || null);
            } catch (err) {
                alert("Failed to load user profile. Please login.");
            }
        };
        fetchUser();
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    // Khi chọn file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, avatar: file });

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(user.avatarUrl || null);
        }
    };

    // Khi nhấn save
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const data = new FormData();
            if (formData.avatar) data.append("avatar", formData.avatar);

            const res = await api.post("/profile/update-avatar", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setUser(res.data.user); // cập nhật state user
            setPreview(res.data.user.avatarUrl); // cập nhật preview
            alert("Avatar updated successfully!");
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
                        <h1 className="text-2xl font-semibold mb-4">Update Avatar</h1>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <div className="w-32 h-32 rounded-full border border-gray-300 overflow-hidden mx-auto">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Avatar Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400">
                                            <span>TT</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="border rounded px-2 py-1 flex-1"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                            {errors.avatar && (
                                <p className="text-red-500 text-sm mt-1">{errors.avatar[0]}</p>
                            )}
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}
