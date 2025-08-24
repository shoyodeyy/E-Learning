"use client"

import { useNavigate } from "react-router-dom"

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
            </div>

            {/* Main content */}
            <div className="w-full max-w-lg relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 text-center">
                {/* Logo */}
                <div className="mb-8">
                    <img src="/images/logo.webp" alt="Logo" className="mx-auto h-12 mb-4 filter drop-shadow-lg" />
                </div>

                {/* 404 Number with animation */}
                <div className="mb-6">
                    <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-2 animate-bounce">
                        404
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto rounded-full"></div>
                </div>

                {/* Error message */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-3">Oops! Page Not Found</h2>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        The page you're looking for seems to have wandered off into the digital void. Don't worry, it happens to the
                        best of us!
                    </p>
                </div>

                {/* Action buttons */}
                <div className="space-y-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold text-lg cursor-pointer"
                    >
                        ← Go Back
                    </button>
                </div>

                {/* Decorative elements */}
                <div className="mt-8 flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping delay-100"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping delay-200"></div>
                </div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping delay-300"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white rounded-full animate-ping delay-700"></div>
                <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-white rounded-full animate-ping delay-1000"></div>
                <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white rounded-full animate-ping delay-500"></div>
            </div>
        </div>
    )
}
