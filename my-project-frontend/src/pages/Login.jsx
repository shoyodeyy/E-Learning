import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import { apiUrl } from "../services/http";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (data.email) {
            setStep(2);
        }
    };

    const navigateByRole = (userRole, userStatus) => {
        if (userStatus === "banned") {
            return; // Don't navigate if banned
        }

        if (userStatus === "pending" && userRole === "organizer") {
            navigate("/organizer/pending-approval");
            return;
        }

        switch (userRole) {
            case "admin":
                navigate("/admin/dashboard");
                break;
            case "organizer":
            case "participant":
            default:
                navigate("/");
                break;
        }
    };

    const handleBannedUser = (banDetails) => {
        toast.error(`Your account has been banned. Reason: ${banDetails.reason}. Banned until: ${banDetails.banned_until}`);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Use AuthContext login method
                login(result.user, result.token);

                toast.success("Login successful!");

                const userStatus = result.user?.status || "active";
                const userRole = result.user?.role || "participant";

                // Handle banned users
                if (userStatus === "banned") {
                    handleBannedUser(result.ban_details);
                    return;
                }

                // Check email verification status - only for non-Google users
                const needsVerification = !result.user.email_verified_at && !result.user.is_google_user;

                if (needsVerification) {
                    navigate("/verify-email");
                    return;
                }

                // Navigate based on role and status
                navigateByRole(userRole, userStatus);
            } else {
                // Handle account banned
                if (result.error === "account_banned") {
                    handleBannedUser(result.ban_details);
                    return;
                }

                // Handle validation errors
                if (result.errors) {
                    Object.keys(result.errors).forEach((key) => {
                        result.errors[key].forEach((error) => {
                            toast.error(error);
                        });
                    });
                } else if (result.message) {
                    toast.error(result.message);
                } else {
                    toast.error("Login failed. Please try again.");
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Network error. Please check your connection.");
        } finally {
            setProcessing(false);
        }
    };

    const goBackToEmail = () => {
        setStep(1);
        setData((prev) => ({ ...prev, password: "" }));
    };

    const handleInputChange = (field, value) => {
        setData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch(`${apiUrl}/auth/google/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    credential: credentialResponse.credential,
                }),
            });

            const result = await response.json();

            if (result.status === 200) {
                // Use AuthContext login method
                login(result.user, result.token);

                toast.success("Login successful!");

                const userRole = result.user?.role || "participant";
                const userStatus = result.user?.status || "active";

                navigateByRole(userRole, userStatus);
            } else if (result.status === 403 && result.error === "account_banned") {
                // Handle banned account for Google login
                handleBannedUser(result.ban_details);
            } else {
                toast.error("Google login failed");
            }
        } catch (error) {
            console.error("Error during Google login:", error);
            toast.error("An error occurred during Google login");
        }
    };

    const handleGoogleError = () => {
        toast.error("Google login failed");
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img src="/images/udemy-background.jpg" alt="Learning background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md relative z-10 bg-white shadow-2xl">
                <div className="text-center pb-6 pt-6 px-6">
                    <img src="/images/logo.webp" alt="Udemy Logo" className="mx-auto h-10 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome to FPT Aptech</h1>
                    <p className="text-gray-600 text-sm">(fpl.udemy.com)</p>
                </div>

                <div className="space-y-4 px-6 pb-6">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">or</span>
                        </div>
                    </div>

                    {/* Step 1 - Email Input */}
                    {step === 1 && (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full btn-gradient">
                                Continue
                            </button>
                            <p className="text-right text-sm text-gray-600">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate("/register")}
                                    className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                                >
                                    Sign up
                                </button>
                            </p>
                        </form>
                    )}

                    {/* Step 2 - Password Input */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-700">{data.email}</span>
                                <button type="button" onClick={goBackToEmail} className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                                    Edit
                                </button>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            onChange={(e) => handleInputChange("password", e.target.value)}
                                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                            placeholder="Enter your password"
                                            required
                                            autoFocus
                                        />
                                        {data.password && (
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                                            >
                                                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <button type="submit" disabled={processing} className="w-full btn-gradient">
                                    {processing ? "Signing in..." : "Log In"}
                                </button>
                            </form>

                            <div className="flex justify-between text-sm">
                                <Link to="/user/forgot-password" className="text-purple-600 hover:text-purple-700 underline cursor-pointer">
                                    Forgot your password?
                                </Link>
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => navigate("/register")}
                                        className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
