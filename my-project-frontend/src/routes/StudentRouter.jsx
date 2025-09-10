import { Route } from "react-router-dom";

// import Dashboard from "../pages/Home.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

import PublicProfile from "../pages/Student/PublicProfile.jsx";

import Dashboard from "../pages/Student/Dashboard.jsx"
import MyRegistrations from "../pages/Student/MyRegistrations.jsx";

export default function StudentRouter() {
    return (
        <>
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/registration" element={<MyRegistrations />} />
            </Route>
        </>
    );
}