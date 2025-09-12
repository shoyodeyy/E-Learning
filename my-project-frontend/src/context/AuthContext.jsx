import { createContext, useContext, useState, useEffect } from "react";
import { apiUrl } from "../services/http.jsx";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize auth state from localStorage
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem("auth_token", authToken);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        localStorage.removeItem("chat_session_id");
        // Optionally clear other user-specific data from localStorage
    };

    const updateUser = (userData) => {
        // Ensure we preserve important fields
        const updatedUser = {
            ...user,
            ...userData,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const refreshUser = async () => {
        if (!token) return;

        try {
            const res = await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            if (res.ok) {
                const data = await res.json();
                updateUser(data);
            }
        } catch (err) {
            console.error("Failed to refresh user:", err);
        }
    };

    const isAuthenticated = !!token && !!user;

    // Check if user needs email verification (only for non-Google users)
    const needsEmailVerification = user && !user.email_verified_at && !user.is_google_user;

    // Check if user is pending approval (for organizers)
    const isPendingApproval = user && user.role === "organizer" && user.status === "pending";

    // Check if user account is banned
    const isBanned = user && user.status === "banned";

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        needsEmailVerification,
        isPendingApproval,
        isBanned,
        login,
        logout,
        updateUser,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
