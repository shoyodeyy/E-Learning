import { useState, useEffect } from "react"

export default function VerificationResult() {
    const [status, setStatus] = useState('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const error = urlParams.get('error')
        const messageParam = urlParams.get('message')

        if (error) {
            setStatus('error')
            switch (error) {
                case 'invalid_link':
                    setMessage('Invalid verification link. Please request a new one.')
                    break
                case 'expired_link':
                    setMessage('Verification link has expired. Please request a new one.')
                    break
                default:
                    setMessage('Verification failed. Please try again.')
            }
        } else if (messageParam) {
            switch (messageParam) {
                case 'email_verified':
                    setStatus('success')
                    setMessage('Email verified successfully! Welcome to Udemy Business.')
                    // Redirect to dashboard after 3 seconds
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 3000)
                    break
                case 'already_verified':
                    setStatus('info')
                    setMessage('Your email is already verified.')
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 2000)
                    break
                default:
                    setStatus('loading')
            }
        }
    }, [])

    const handleResendEmail = async () => {
        try {
            const token = localStorage.getItem("auth_token")
            const apiUrl = "http://localhost:8000/api"

            const response = await fetch(`${apiUrl}/email/resend`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            })

            const result = await response.json()

            if (response.ok) {
                alert("Verification email sent successfully!")
                setMessage("A new verification email has been sent to your inbox.")
            } else {
                alert(result.message || "Failed to send verification email")
            }
        } catch (error) {
            console.error("Resend email error:", error)
            alert("Network error. Please check your connection.")
        }
    }

    const getStatusIcon = () => {
        switch (status) {
            case 'success':
                return (
                    <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )
            case 'error':
                return (
                    <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                )
            case 'info':
                return (
                    <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )
            default:
                return (
                    <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center animate-spin">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </div>
                )
        }
    }

    const getStatusColor = () => {
        switch (status) {
            case 'success': return 'text-green-600'
            case 'error': return 'text-red-600'
            case 'info': return 'text-blue-600'
            default: return 'text-gray-600'
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img src="/images/udemy-background.jpg" alt="Learning background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Result Card */}
            <div className="w-full max-w-md relative z-10 bg-white shadow-2xl rounded-lg">
                <div className="text-center p-8">
                    <img src="/images/logo.webp" alt="Udemy Logo" className="mx-auto h-10 mb-6" />

                    {getStatusIcon()}

                    <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
                        {status === 'success' && 'Email Verified!'}
                        {status === 'error' && 'Verification Failed'}
                        {status === 'info' && 'Already Verified'}
                        {status === 'loading' && 'Verifying...'}
                    </h1>

                    <p className="text-gray-600 text-sm mb-6">
                        {message || 'Processing your email verification...'}
                    </p>

                    <div className="space-y-4">
                        {status === 'success' && (
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-700">
                                    You will be redirected to the dashboard in a few seconds...
                                </p>
                            </div>
                        )}

                        {status === 'error' && (
                            <>
                                <button
                                    onClick={handleResendEmail}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
                                >
                                    Send New Verification Email
                                </button>

                                <div className="text-center">
                                    <a
                                        href="/verify-email"
                                        className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                                    >
                                        Back to Email Verification
                                    </a>
                                </div>
                            </>
                        )}

                        {(status === 'info' || status === 'success') && (
                            <div className="text-center">
                                <a
                                    href="/dashboard"
                                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                                >
                                    Go to Dashboard
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}