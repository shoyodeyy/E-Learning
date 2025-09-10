import { useState, useRef } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import {GoogleLogin} from "@react-oauth/google";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

import { apiUrl } from "../services/http"
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [processing, setProcessing] = useState(false)
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "participant",
    })

    const nameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const passwordConfirmRef = useRef(null)

    const navigate = useNavigate()
    const { login } = useAuth();

    const navigateByRole = (userRole) => {
        switch (userRole) {
            case "admin":
                navigate("/admin/dashboard");
                break;
            case "organizer":
                navigate("/organizer/dashboard");
                break;
            case "participant":
            default:
                navigate("/");
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (data.password !== data.password_confirmation) {
            toast.error("Passwords do not match")
            passwordConfirmRef.current?.focus()
            return
        }

        setProcessing(true)

        try {
            const response = await fetch(`${apiUrl}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                    role: data.role,
                }),
            })

            const result = await response.json()

            if (response.ok) {
                // Use AuthContext login method
                login(result.user, result.token);

                toast.success("Registration successful! Please check your email to verify your account.");

                // Regular email/password users need to verify email
                navigate("/verify-email");
            } else {
                // Handle validation errors
                if (result.errors) {
                    const firstField = Object.keys(result.errors)[0]
                    const firstError = result.errors[firstField][0]
                    toast.error(firstError)

                    if (firstField === "name") nameRef.current?.focus()
                    if (firstField === "email") emailRef.current?.focus()
                    if (firstField === "password") passwordRef.current?.focus()
                    if (firstField === "password_confirmation") passwordConfirmRef.current?.focus()
                } else if (result.message) {
                    toast.error(result.message)
                } else {
                    toast.error("Registration failed. Please try again.")
                }
            }
        } catch (error) {
            console.error("Registration error:", error)
            toast.error("Network error. Please check your connection.")
        } finally {
            setProcessing(false)
        }
    }

    const handleInputChange = (field, value) => {
        setData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch(`${apiUrl}/auth/google/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    credential: credentialResponse.credential,
                }),
            });

            const result = await response.json();

            if (result.status === 200) {
                // Use AuthContext login method
                login(result.user, result.token);

                toast.success('Registration successful!');

                // Google users are auto-verified, navigate based on role
                const userRole = result.user?.role || 'participant';
                navigateByRole(userRole);
            } else {
                toast.error(result.message || 'Google registration failed');
            }
        } catch (error) {
            console.error('Error during Google registration:', error);
            toast.error('An error occurred during Google registration');
        }
    };

    const handleGoogleError = () => {
        toast.error('Google registration failed');
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img src="/images/udemy-background.jpg" alt="Learning background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Register Card */}
            <div className="w-full max-w-md relative z-10 bg-white shadow-2xl">
                <div className="text-center pb-6 pt-6 px-6">
                    <img src="/images/logo.webp" alt="Udemy Logo" className="mx-auto h-10 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Join Udemy Business</h1>
                    <p className="text-gray-600 text-sm">(fpl.udemy.com)</p>
                </div>

                <div className="space-y-4 px-6 pb-6">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError}/>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">or</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                ref={nameRef}
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                ref={emailRef}
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    ref={passwordRef}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    placeholder="Enter your password"
                                    required
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

                        {/* Password Confirmation Field */}
                        <div className="space-y-2">
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    ref={passwordConfirmRef}
                                    id="password_confirmation"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={data.password_confirmation}
                                    onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    placeholder="Confirm your password"
                                    required
                                />
                                {data.password_confirmation && (
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                                    >
                                        {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleInputChange("role", "participant")}
                                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors cursor-pointer ${
                                        data.role === "participant"
                                            ? "border-purple-600 bg-purple-50 text-purple-700"
                                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                    }`}
                                >
                                    Participant
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleInputChange("role", "organizer")}
                                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors cursor-pointer ${
                                        data.role === "organizer"
                                            ? "border-purple-600 bg-purple-50 text-purple-700"
                                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                    }`}
                                >
                                    Organizer
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full btn-gradient"
                        >
                            {processing ? "Creating account..." : "Create Account"}
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                            >
                                Sign in
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
