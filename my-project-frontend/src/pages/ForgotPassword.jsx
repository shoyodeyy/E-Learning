import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { apiUrl } from '../services/http';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/user/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                toast.success('Password reset link has been sent to your email!');
            } else {
                // Handle validation errors
                if (result.errors) {
                    Object.keys(result.errors).forEach(key => {
                        result.errors[key].forEach(error => {
                            toast.error(error);
                        });
                    });
                } else if (result.message) {
                    toast.error(result.message);
                } else {
                    toast.error('Failed to send reset link. Please try again.');
                }
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error('Network error. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = () => {
        setIsSubmitted(false);
        setEmail('');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center p-6">
                <Link to="/">
                    <img
                        src="/images/logo.webp"
                        alt="Udemy Logo"
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
            <main className="flex-1 flex items-center justify-center px-4 relative">
                {/* Decorative Icons */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Code Icon */}
                    <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-black rounded-full flex items-center justify-center transform -rotate-12">
                        <span className="text-white font-mono text-lg">{"</>"}</span>
                    </div>

                    {/* Shapes Icon */}
                    <div className="absolute top-1/3 left-1/3 w-20 h-12 bg-white border-2 border-black rounded transform rotate-12 flex items-center justify-center">
                        <div className="flex gap-1">
                            <div className="w-3 h-3 bg-black rounded-full"></div>
                            <div className="w-3 h-3 bg-black"></div>
                            <div className="w-3 h-3 bg-black transform rotate-45"></div>
                        </div>
                    </div>

                    {/* Camera Icon */}
                    <div className="absolute top-2/3 left-1/4 w-16 h-12 bg-white border-2 border-black rounded transform -rotate-6">
                        <div className="w-full h-full relative">
                            <div className="absolute top-1 left-1 w-3 h-3 bg-black rounded-full"></div>
                            <div className="absolute bottom-1 right-1 w-6 h-6 bg-black rounded-full"></div>
                        </div>
                    </div>

                    {/* Email Icon */}
                    <div className="absolute top-1/4 right-1/3 w-16 h-12 bg-white border-2 border-black rounded transform rotate-6">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-8 h-6 border-2 border-black rounded-sm relative">
                                <div className="absolute inset-1 border-t border-black transform rotate-45 origin-top"></div>
                            </div>
                        </div>
                    </div>

                    {/* Globe Icon */}
                    <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white border-2 border-black rounded-full flex items-center justify-center transform rotate-12">
                        <div className="relative w-10 h-10">
                            <div className="absolute inset-0 border-2 border-black rounded-full"></div>
                            <div className="absolute top-1/2 left-0 right-0 h-0 border-t-2 border-black"></div>
                            <div className="absolute top-0 bottom-0 left-1/2 w-0 border-l-2 border-black"></div>
                            <div className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></div>
                            <div className="absolute bottom-2 left-2 text-xs font-bold">A</div>
                        </div>
                    </div>
                </div>

                {/* Forgot Password Form */}
                <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 z-10">
                    {!isSubmitted ? (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h1>
                                <p className="text-gray-600">{"We'll email you a link so you can reset your password."}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                                        placeholder="Enter your email address"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isLoading ? 'Sending...' : 'Reset Password'}
                                </button>
                            </form>

                            <div className="text-center mt-6">
                                <span className="text-gray-600">or </span>
                                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                                    Log in
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                {/* Success Icon */}
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h1>
                                <p className="text-gray-600">
                                    We've sent a password reset link to <strong>{email}</strong>
                                </p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleResend}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
                                >
                                    Send Another Email
                                </button>

                                <div className="text-center">
                                    <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                                        ← Back to Login
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Didn't receive the email?</strong>
                                </p>
                                <ul className="text-xs text-blue-700 mt-2 space-y-1">
                                    <li>• Check your spam folder</li>
                                    <li>• Make sure you entered the correct email</li>
                                    <li>• It may take a few minutes to arrive</li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}