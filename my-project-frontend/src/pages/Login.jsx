import {useState} from "react";
import {toast} from "react-toastify";
import {Link, useNavigate} from "react-router-dom"
import {EyeIcon, EyeSlashIcon} from "@heroicons/react/24/outline";
import {GoogleLogin} from "@react-oauth/google";

import {apiUrl} from "../services/http";
import {useAuth} from "../context/AuthContext";

export default function Login() {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const {login, loginWithUser, getCsrfCookie, getCsrfToken} = useAuth();

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (data.email) {
            setStep(2);
        }
    };

    const navigateByRole = (userRole) => {
        switch (userRole) {
            case "admin":
                navigate("/admin/dashboard");
                break;
            case "instructor":
                navigate("/instructor/dashboard");
                break;
            case "student":
            default:
                navigate("/dashboard");
                break;
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const result = await login(data.email, data.password);
            toast.success("Login successful!");

            // SỬA ĐỔI: Sử dụng user từ result thay vì từ context
            const role = result.user?.role || "student";
            navigateByRole(role);
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.message || "Login failed");
        } finally {
            setProcessing(false);
        }
    };

    const goBackToEmail = () => {
        setStep(1);
        setData(prev => ({...prev, password: ''}));
    };

    const handleInputChange = (field, value) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // SỬA ĐỔI: Cải thiện xử lý Google login
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // Lấy CSRF cookie trước khi gọi API Google login
            await getCsrfCookie();

            // Lấy CSRF token từ cookie
            const csrfToken = getCsrfToken();

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };

            // Thêm CSRF token vào headers nếu có
            if (csrfToken) {
                headers['X-XSRF-TOKEN'] = csrfToken;
            }

            const response = await fetch(`${apiUrl}/auth/google/login`, {
                method: 'POST',
                headers,
                credentials: 'include', // Important for Sanctum
                body: JSON.stringify({ credential: credentialResponse.credential }),
            });

            const result = await response.json();

            if (response.ok && result.status === 200) {
                // Use loginWithUser for Google login since user is already authenticated on backend
                loginWithUser(result.user);
                toast.success('Login successful!');

                // Navigate based on role immediately
                const userRole = result.user?.role || 'student';
                navigateByRole(userRole);
            } else {
                console.error('Google login error response:', result);
                toast.error(result.message || 'Google login failed');
            }
        } catch (error) {
            console.error('Error during Google login:', error);
            toast.error('An error occurred during Google login');
        }
    };

    const handleGoogleError = () => {
        toast.error('Google login failed');
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/udemy-background.jpg"
                    alt="Learning background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"/>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md relative z-10 bg-white shadow-2xl">
                <div className="text-center pb-6 pt-6 px-6">
                    <img
                        src="/images/logo.webp"
                        alt="Udemy Logo"
                        className="mx-auto h-10 mb-4"
                    />
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Welcome to Udemy Business
                    </h1>
                    <p className="text-gray-600 text-sm">(fpl.udemy.com)</p>
                </div>

                <div className="space-y-4 px-6 pb-6">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError}/>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300"/>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">or</span>
                        </div>
                    </div>

                    {/* Step 1 - Email Input */}
                    {step === 1 && (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors cursor-pointer"
                            >
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
                                <button
                                    type="button"
                                    onClick={goBackToEmail}
                                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                                >
                                    Edit
                                </button>
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
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
                                                {showPassword ? (
                                                    <EyeSlashIcon className="w-5 h-5"/>
                                                ) : (
                                                    <EyeIcon className="w-5 h-5"/>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    {processing ? "Signing in..." : "Log In"}
                                </button>
                            </form>

                            <div className="flex justify-between text-sm">
                                <Link
                                    to="/user/forgot-password"
                                    className="text-purple-600 hover:text-purple-700 underline cursor-pointer"
                                >
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
    )
}