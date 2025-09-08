import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChatbotBox from "../components/ChatbotBox.jsx";

export default function Dashboard() {
    const [showMessage, setShowMessage] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [messageType, setMessageType] = useState('success');

    const navigate = useNavigate();
    const { user, logout, refreshUser } = useAuth();

    useEffect(() => {
        // Check for messages in URL
        const urlParams = new URLSearchParams(window.location.search);
        const message = urlParams.get('message');

        if (message) {
            handleUrlMessage(message);
            // Clean URL without refreshing page
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        if (!user.email_verified_at) {
            refreshUser();
        }
    }, [user, refreshUser]);

    const handleUrlMessage = (message) => {
        switch (message) {
            case 'email_verified':
                setMessageContent('🎉 Email verified successfully! Welcome to Udemy Business.');
                setMessageType('success');
                setShowMessage(true);
                break;
            case 'already_verified':
                setMessageContent('ℹ️ Your email is already verified.');
                setMessageType('info');
                setShowMessage(true);
                break;
            default:
                break;
        }

        // Auto hide message after 5 seconds
        setTimeout(() => {
            setShowMessage(false);
        }, 5000);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Success/Info Message Banner */}
            {showMessage && (
                <div className={`fixed top-0 left-0 right-0 z-50 p-4 text-center text-white ${
                    messageType === 'success' ? 'bg-green-600' : 'bg-blue-600'
                }`}>
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <span className="flex-1">{messageContent}</span>
                        <button
                            onClick={() => setShowMessage(false)}
                            className="ml-4 text-white hover:text-gray-200"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Main Dashboard Content */}
            <div className={`${showMessage ? 'pt-16' : ''}`}>
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center">
                                <img src="/images/logo.webp" alt="Udemy Logo" className="h-8" />
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700">Welcome, {user.name}</span>
                                <div className="flex items-center space-x-2">
                                    {user.email_verified_at ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            ✓ Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            ⚠ Unverified
                                        </span>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                    Dashboard
                                </h1>

                                {/* Email Verification Alert - Only show for non-Google users */}
                                {!user.email_verified_at && !user.is_google_user && (
                                    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-yellow-800">
                                                    Email Verification Required
                                                </h3>
                                                <div className="mt-2 text-sm text-yellow-700">
                                                    <p>Please verify your email address to access all features.</p>
                                                </div>
                                                <div className="mt-4">
                                                    <a
                                                        href="/verify-email"
                                                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        Verify Email
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900">Profile</h3>
                                        <p className="mt-1 text-sm text-gray-500">Manage your account settings</p>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900">Courses</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {user.role === 'instructor' ? 'Manage your courses' : 'Browse available courses'}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-900">Settings</h3>
                                        <p className="mt-1 text-sm text-gray-500">Configure your preferences</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <ChatbotBox />
            </div>
        </div>
    )
}


