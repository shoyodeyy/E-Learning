// src/api/courseApi.js
import axios from "axios";

// Tạo instance Axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Nếu dùng token (auth)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ============================
// API calls
// ============================

// 1. Search courses
export const searchCourses = async (query = "", filters = {}) => {
    // filters = { level: [], price: [], language: [] }
    const params = { query, ...filters };
    const response = await api.get("/courses/search", { params });
    return response.data; // trả về mảng courses
};

// 2. Get all courses (dành cho homepage / catalog)
export const getCourses = async (page = 1, perPage = 12) => {
    const response = await api.get("/courses", { params: { page, perPage } });
    return response.data;
};

// 3. Get course detail
export const getCourseDetail = async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
};
