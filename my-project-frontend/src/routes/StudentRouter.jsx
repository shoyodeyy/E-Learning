import {Route, Routes, Navigate} from "react-router-dom";

import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";

export default function StudentRouter() {
    const isAuthenticated = !!localStorage.getItem("auth_token");
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    return (
        <>
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user/forgot-password" element={<ForgotPassword />} />
            <Route path="/user/reset-password" element={<ResetPassword />} />

            {/* Private routes */}
            <Route
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} />
                }
            >
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
        </>
    )
}