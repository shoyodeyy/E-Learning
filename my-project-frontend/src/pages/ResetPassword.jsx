import { Link, useLocation, useNavigate } from 'react-router-dom';
import {useState, useEffect, useRef} from 'react';
import { toast } from 'react-toastify';

import { apiUrl } from '../services/http';

export default function ResetPassword() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password_confirmation: '',
        token: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const location = useLocation();

    const passwordRef = useRef(null)
    const passwordConfirmRef = useRef(null)

    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
            toast.error('Invalid reset link');
            navigate('/forgot-password');
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await fetch(`${apiUrl}/user/verify-reset-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const result = await response.json();

                if (response.ok && result.valid) {
                    setFormData(prev => ({
                        ...prev,
                        token: token,
                        email: result.email
                    }));
                    setTokenValid(true);
                } else {
                    toast.error(result.message || 'Invalid or expired reset link');
                    navigate('/forgot-password');
                }
            } catch (error) {
                console.error('Token verification error:', error);
                toast.error('Failed to verify reset link');
                navigate('/forgot-password');
            } finally {
                setIsVerifying(false);
            }
        };

        verifyToken();
    }, [location.search, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.password_confirmation) {
            toast.error('Passwords do not match');
            passwordConfirmRef.current?.focus()
            return;
        }

        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            passwordRef.current?.focus()
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/user/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    token: formData.token,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Password reset successfully! You can now log in.');
                navigate('/login');
            } else {
                // Handle validation errors
                if (result.errors) {
                    const firstField = Object.keys(result.errors)[0]
                    const firstError = result.errors[firstField][0]
                    toast.error(firstError)

                    if (firstField === "password") passwordRef.current?.focus()
                    if (firstField === "password_confirmation") passwordConfirmRef.current?.focus()
                } else if (result.message) {
                    toast.error(result.message);
                } else {
                    toast.error('Failed to reset password. Please try again.');
                }
            }
        } catch (error) {
            console.error('Reset password error:', error);
            toast.error('Network error. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (isVerifying) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center p-6">
                <Link to="/">
                    <img
                        src="/images/logo.webp"
                        alt="FPT Polytechnic Logo"
                        className="h-10"
                    />
                </Link>
                <Link
                    to="/login"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                    Log in or sign up
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
                        <p className="text-gray-600">Enter your new password below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                                disabled
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                ref={passwordRef}
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="Enter your new password"
                                required
                                disabled={isLoading}
                                minLength={8}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <input
                                ref={passwordConfirmRef}
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="Confirm your new password"
                                required
                                disabled={isLoading}
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-gradient disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}