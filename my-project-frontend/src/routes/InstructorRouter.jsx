import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../pages/Instructor/Dashboard.jsx";

export default function InstructorRouter() {
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
                        allowedRoles={["instructor"]}
                    />
                }
            >
                <Route path="/instructor/dashboard" element={<Dashboard />} />
            </Route>
        </>
    )
}
