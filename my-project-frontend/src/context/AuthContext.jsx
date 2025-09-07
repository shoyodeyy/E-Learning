import {createContext, useContext, useState, useEffect} from 'react';
import {apiUrl} from "../services/http.jsx";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get CSRF cookie for Sanctum - SỬA ĐỔI: Gọi đúng endpoint
    const getCsrfCookie = async () => {
        try {
            // Gọi endpoint sanctum/csrf-cookie trực tiếp (không qua /api)
            await fetch(`http://localhost:8000/sanctum/csrf-cookie`, {
                credentials: 'include',
            });
        } catch (error) {
            console.error('Failed to get CSRF cookie:', error);
        }
    };

    useEffect(() => {
        // Check if user is authenticated by calling /user endpoint
        const checkAuthStatus = async () => {
            try {
                // Lấy CSRF cookie trước khi check auth
                await getCsrfCookie();

                const res = await fetch(`${apiUrl}/user`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                });

                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    // Login method - SỬA ĐỔI: Thêm logic cập nhật user sau khi login thành công
    const login = async (email, password) => {
        try {
            // Get CSRF cookie first
            await getCsrfCookie();

            const csrfToken = getCsrfToken();
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };

            if (csrfToken) {
                headers['X-XSRF-TOKEN'] = csrfToken;
            }

            const res = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                credentials: 'include',
                headers,
                body: JSON.stringify({email, password}),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await res.json();

            // SỬA ĐỔI: Cập nhật user state sau khi login thành công
            if (data.user) {
                setUser(data.user);
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // Login method for when we already have user data (like from Google login)
    const loginWithUser = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            const csrfToken = getCsrfToken();
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };

            if (csrfToken) {
                headers['X-XSRF-TOKEN'] = csrfToken;
            }
            await fetch(`${apiUrl}/logout`, {
                method: 'POST',
                credentials: 'include',
                headers,
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
        }
    };

    const updateUser = (userData) => {
        // Ensure we preserve important fields
        const updatedUser = {
            ...user,
            ...userData,
        };
        setUser(updatedUser);
    };

    const refreshUser = async () => {
        try {
            const res = await fetch(`${apiUrl}/user`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
                return userData;
            } else {
                // If refresh fails, user might be logged out
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
            setUser(null);
        }
    };

    const getCsrfToken = () => {
        const match = document.cookie.match(new RegExp('(^|; )XSRF-TOKEN=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    };

    const isAuthenticated = !!user;

    const value = {
        user,
        loading,
        isAuthenticated,
        login,           // New login method (email, password)
        loginWithUser,   // For external login (Google, etc.)
        logout,
        updateUser,
        refreshUser,
        getCsrfCookie,   // Expose for manual CSRF cookie refresh if needed
        getCsrfToken,    // SỬA ĐỔI: Expose CSRF token getter
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};