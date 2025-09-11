import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/http";
import { toast } from "react-toastify";

export default function VerifyEmail() {
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const { user, logout, refreshUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const interval = setInterval(async () => {
            try {
                const token = localStorage.getItem("auth_token");
                const res = await fetch(`${apiUrl}/email/verify-status`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.verified) {
                        await refreshUser();
                        toast.success("Email verified successfully!");
                    }
                }
            } catch (err) {
                console.error("Auto check verify failed:", err);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [user, refreshUser]);

    useEffect(() => {
        // If user is not authenticated, redirect to login
        if (!user) {
            navigate("/login");
            return;
        }
    }, [user]);

    useEffect(() => {
        let interval;
        if (countdown > 0) {
            interval = setInterval(() => {
                setCountdown((count) => count - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [countdown]);

    const handleResendEmail = async () => {
        if (countdown > 0) return;

        setResending(true);
        try {
            const token = localStorage.getItem("auth_token");

            const response = await fetch(`${apiUrl}/email/resend`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Verification email sent successfully!");
                setCountdown(60); // 60 seconds cooldown
            } else {
                toast.error(result.message || "Failed to send verification email");
            }
        } catch (error) {
            console.error("Resend email error:", error);
            toast.error("Network error. Please check your connection.");
        } finally {
            setResending(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img src="/images/udemy-background.jpg" alt="Learning background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Verification Card */}
            <div className="w-full max-w-md relative z-10 bg-white shadow-2xl rounded-lg">
                <div className="text-center p-8">
                    <img src="/images/logo.webp" alt="Udemy Logo" className="mx-auto h-10 mb-6" />

                    {/* Email Icon */}
                    <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Verify Your Email</h1>

                    <p className="text-gray-600 text-sm mb-6">
                        We've sent a verification email to <strong>{user.email}</strong>. Please check your inbox and click the verification link to
                        activate your account.
                    </p>

                    {/* User Info */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>
                                <strong>Name:</strong> {user.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {user.email}
                            </p>
                            <p>
                                <strong>Role:</strong> {user.role}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Resend Button */}
                        <button
                            onClick={handleResendEmail}
                            disabled={resending || countdown > 0}
                            className="cursor-pointer w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {resending ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend Verification Email"}
                        </button>

                        {/* Instructions */}
                        <div className="text-left p-4 bg-blue-50 rounded-lg">
                            <h3 className="text-sm font-medium text-blue-800 mb-2">Don't see the email?</h3>
                            <ul className="text-xs text-blue-700 space-y-1">
                                <li>• Check your spam or junk folder</li>
                                <li>• Make sure you entered the correct email</li>
                                <li>• Click "Resend" to send another email</li>
                                <li>• Contact support if you still need help</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <button
                                onClick={handleLogout}
                                className="cursor-pointer flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Sign Out
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="cursor-pointer flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                I've Verified
                            </button>
                        </div>

                        <p className="text-center text-xs text-gray-500">
                            After clicking the verification link in your email, you'll be automatically redirected to your dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
