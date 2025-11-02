import axios from "axios";

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

// Helper function to get full image URL
export const getImageUrl = (path) => {
    if (!path) return '/placeholder.svg';
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path}`;
};

export default api;