"use client"

import { useNavigate } from "react-router-dom"

export default function Forbidden() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-pink-500 to-orange-500">
                {/* Animated background elements */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>

                {/* Floating particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-bounce delay-300"></div>
                <div className="absolute top-3/4 left-3/4 w-3 h-3 bg-white/20 rounded-full animate-bounce delay-700"></div>
                <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white/40 rounded-full animate-bounce delay-1000"></div>
            </div>

            <div className="w-full max-w-md relative z-10 backdrop-blur-xl bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                    <img src="/images/logo.webp" alt="Logo" className="mx-auto h-12 relative z-10 drop-shadow-lg" />
                </div>

                <div className="mb-6">
                    <h1 className="text-8xl font-black bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent animate-bounce mb-2 drop-shadow-2xl">
                        403
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto rounded-full"></div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Access Forbidden</h2>
                <p className="text-white/90 mb-8 text-lg leading-relaxed drop-shadow-md">
                    You don't have permission to access this page. Please contact your administrator if you believe this is an
                    error.
                </p>

                <div className="space-y-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-xl transition-all duration-300 font-semibold hover:scale-105 hover:shadow-xl active:scale-95 cursor-"
                    >
                        ← Go Back
                    </button>
                </div>

                <div className="absolute -top-2 -right-2 w-4 h-4 bg-white/30 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-white/20 rounded-full animate-ping delay-500"></div>
            </div>

            <div className="absolute top-10 left-10 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-2 h-2 bg-white/30 rounded-full animate-pulse delay-300"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/50 rounded-full animate-pulse delay-700"></div>
        </div>
    )
}
