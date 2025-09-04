import React, { useState } from "react";
import Header from "../../components/Header.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import Avatar from "../../components/Avatar.jsx";

export default function PublicProfile() {
    const { user, updateUser } = useAuth();
    const [errors, setErrors] = useState({});

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "student",
        status: user.status || "active",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Full name is required.";
        } else if (formData.name.length < 3) {
            newErrors.name = "Full name must be at least 3 characters.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email format is invalid.";
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors); // ❌ show lỗi đỏ
        } else {
            setErrors({});
            updateUser(formData); // lưu context
            alert("Profile updated (frontend only)!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar */}
                    <aside className="col-span-3 bg-white shadow rounded p-6">
                        <div className="flex flex-col items-center">
                            <Avatar name={user.name} avatarUrl={user.avatarUrl} size={96} />
                            <h2 className="mt-4 font-semibold text-lg">{user.name}</h2>
                            <p className="text-gray-500 text-sm">{user.role}</p>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <section className="col-span-9 bg-white shadow rounded p-6">
                        <h1 className="text-2xl font-semibold mb-4">Public profile</h1>

                        <form className="space-y-6" onSubmit={handleSubmit}>
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
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
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
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Save Button */}
                            <button
                                type="submit"
                                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
                            >
                                Save
                            </button>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}
