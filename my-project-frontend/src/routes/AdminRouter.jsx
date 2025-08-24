import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../pages/Admin/Dashboard.jsx";

export default function AdminRouter() {
    const isAuthenticated = !!localStorage.getItem("auth_token");
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    return (
        <>
            <Route
                element={
                    <ProtectedRoute
                        isAuthenticated={isAuthenticated}
                        role={role}
                        allowedRoles={["admin"]}
                    />
                }
            >
                <Route path="/admin/dashboard" element={<Dashboard />} />
            </Route>
        </>
    )
}
