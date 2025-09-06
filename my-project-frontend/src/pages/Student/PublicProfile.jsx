
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import Header from "../../components/Header.jsx";
import ProfileSidebar from "../../components/ProfileSidebar.jsx";
import { apiUrl } from "../../services/http.jsx";

export default function PublicProfile() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [processing, setProcessing] = useState(false);

    // Load user profile
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${apiUrl}/profile`, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                    },
                });


                const result = await response.json();

                if (response.ok) {
                    setUser(result.user);
                    setFormData({
                        name: result.user?.name || "",
                        email: result.user?.email || "",
                        gender: result.user?.gender || "",
                        profile: result.user?.profile || "",
                        address: result.user?.address || "",
                        phone: result.user?.phone || "",
                        avatar: null,
                    });
                } else {
                    toast.error(result.message || "Failed to load profile.");
                }
            } catch (error) {
                console.error("Profile load error:", error);
                toast.error("Network error. Please check your connection.");

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

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        const fieldValue = files ? files[0] : value;

        setFormData((prev) => ({
            ...prev,
            [name]: fieldValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== null && formData[key] !== "") {
                    data.append(key, formData[key]);
                }
            });

            const response = await fetch(`${apiUrl}/profile/update`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                },
                body: data,
            });


            const result = await response.json();

            if (response.ok) {
                setUser(result.user);
                toast.success(result.message || "Profile updated successfully ✅");
            } else {
                toast.error(result.message || "Update failed ❌");

            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Sidebar */}
                    <div className="col-span-1 md:col-span-3 order-1 md:order-1">
                        <ProfileSidebar user={user} />
                    </div>

                    {/* Form */}
                    <section className="col-span-1 md:col-span-9 order-2 md:order-2 bg-white shadow rounded p-6">
                        <h1 className="text-2xl font-semibold mb-4">
                            Public Profile
                        </h1>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                            encType="multipart/form-data"
                        >
                            <div>
                                <label className="block font-medium mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}

                                    readOnly
                                    className="w-full border rounded px-3 py-2 bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"

                                />
                            </div>

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

                            <div>
                                <label className="block font-medium mb-2">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-2">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 border-gray-300 focus:ring-purple-500"
                                />
                            </div>

                            <button
                                type="submit"

                                disabled={processing}
                                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50"

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
