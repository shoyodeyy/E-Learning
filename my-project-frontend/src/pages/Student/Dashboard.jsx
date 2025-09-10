import { useState, useEffect } from "react"

import Courses from "./Components-student/Courses.jsx"
import Feedback from "./Components-student/Feedback.jsx"
import MyLearning from "./Components-student/MyLearning.jsx"
import Slideshow from "./Components-student/HeroCarousel.jsx"
import Avatar from "../../components/Avatar.jsx"

import { getProfile } from "../../api/profileApi.js"
import Header from "../../components/Header.jsx"; // <-- import API

export default function Dashboard() {
    const [showMessage, setShowMessage] = useState(false)
    const [messageContent, setMessageContent] = useState("")
    const [messageType, setMessageType] = useState("success")
    const [user, setUser] = useState(null)

    // Lấy user từ API
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const profile = await getProfile()
                setUser(profile)
            } catch (error) {
                console.error("Error loading profile:", error)
            }
        }
        fetchUser()
    }, [])

    // Xử lý message từ URL (email_verified, already_verified,…)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const message = urlParams.get("message")

        if (message) {
            handleUrlMessage(message)
            window.history.replaceState({}, document.title, window.location.pathname)
        }
    }, [])

    const handleUrlMessage = (message) => {
        switch (message) {
            case "email_verified":
                setMessageContent("🎉 Email verified successfully! Welcome to Udemy Business.")
                setMessageType("success")
                setShowMessage(true)
                break
            case "already_verified":
                setMessageContent("ℹ️ Your email is already verified.")
                setMessageType("info")
                setShowMessage(true)
                break
            default:
                break
        }
        setTimeout(() => setShowMessage(false), 5000)
    }

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Banner */}
            {showMessage && (
                <div
                    className={`fixed top-0 left-0 right-0 z-50 p-4 text-center text-white ${
                        messageType === "success" ? "bg-green-600" : "bg-blue-600"
                    }`}
                >
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <span className="flex-1">{messageContent}</span>
                        <button onClick={() => setShowMessage(false)} className="ml-4 text-white hover:text-gray-200">
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className={`${showMessage ? "pt-16" : ""}`}>
                <Header/>

                {/* Main */}
                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 bg-white rounded-lg shadow-sm">
                        {/* Avatar component */}
                        <Avatar size={64} />

                        {/* Nội dung welcome */}
                        <div className="text-center sm:text-left">
                            <h3 className="text-xl sm:text-2xl font-bold text-balance">Welcome back, {user.name}</h3>
                            <div className="mt-2">
                                {user.email_verified_at ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        ✓ Verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        ⚠ Unverified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="py-6">
                        <Slideshow />
                        <MyLearning />
                        <Courses />
                        <Feedback />
                    </div>
                </main>
            </div>
        </div>
    )
}
