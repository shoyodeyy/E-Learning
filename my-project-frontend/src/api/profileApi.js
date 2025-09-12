import axios from "axios";

// Tạo instance axios
const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Interceptor để tự động gắn token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// =====================
// API methods
// =====================

// Lấy profile
export async function getProfile() {
    try {
        const res = await api.get("/profile");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        throw error;
    }
}

// Update profile
export async function updateProfile(formData) {
    try {
        const res = await api.post("/profile/update", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error) {
        console.error("Failed to update profile:", error);
        throw error;
    }
}

export default api;