import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getProfile, updateProfile } from "../../api/profileApi.js"; // nhớ import API

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
        const fieldValue = files && files.length > 0 ? files[0] : value;

        setFormData((prev) => ({
            ...prev,
            [name]: fieldValue,
        }));

        // xóa lỗi khi người dùng thay đổi input
        setErrors((prev) => {
            if (prev[name]) {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            }
            return prev;
        });
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
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        if (!window.confirm("Do you want to update your profile?")) return;

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
            toast.success(result.message || "Profile updated successfully ✅");
            setErrors({});
        } catch (error) {

            console.error("Profile update error:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });

            toast.error("Update failed ❌");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">


            {/* Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">


                    {/* Main form */}
                    <section className="col-span-1 md:col-span-9 bg-white shadow rounded-2xl p-6">
                        <h1 className="text-2xl font-semibold mb-6">Public Profile</h1>

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
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                        errors.name ? "border-red-500" : "border-gray-300"
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
                                    readOnly
                                    className="w-full border rounded px-3 py-2 bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block font-medium mb-2">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                        errors.gender ? "border-red-500" : "border-gray-300"
                                    } cursor-pointer`}
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && (
                                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                                )}
                            </div>


                            {/* Avatar */}
                            <div>
                                <label className="block font-medium mb-2">Avatar</label>
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300 cursor-pointer"
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
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300"
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
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                        errors.address ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block font-medium mb-2">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                                        errors.phone ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                )}
                            </div>

                            {["organizer", "admin"].includes(user?.role) && (
                                <>
                                    {/* Department */}
                                    <div>
                                        <label className="block font-medium mb-2">Department</label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            readOnly={user?.role === "organizer"} // organizer chỉ đọc
                                            placeholder={user?.role === "organizer" ? "Only admin can edit" : "Enter department"}
                                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 
          ${user?.role === "organizer"
                                                ? "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed placeholder-gray-400"
                                                : "border-gray-300"}`}
                                        />
                                    </div>

                                    {/* Enrollment Number */}
                                    <div>
                                        <label className="block font-medium mb-2">Enrollment No</label>
                                        <input
                                            type="text"
                                            name="enrollment_no"
                                            value={formData.enrollment_no}
                                            onChange={handleInputChange}
                                            readOnly={user?.role === "organizer"} // organizer chỉ đọc
                                            placeholder={user?.role === "organizer" ? "Only admin can edit" : "Enter enrollment number"}
                                            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 
          ${user?.role === "organizer"
                                                ? "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed placeholder-gray-400"
                                                : "border-gray-300"}`}
                                        />
                                    </div>
                                </>
                            )}


                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className={`cursor-pointer px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 border${
                                    processing
                                        ? "bg-purple-300 text-white cursor-not-allowed border-purple-200 shadow-none"
                                        : "bg-white/80 backdrop-blur-sm text-purple-600 border-purple-200 shadow-md hover:shadow-lg hover:bg-white hover:scale-105"
                                }`}
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
