import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api", // đổi sang env nếu cần
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Interceptor để tự động gắn token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token"); // lưu token ở localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
