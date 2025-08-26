import {Route} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../pages/Instructor/Dashboard.jsx";

export default function InstructorRouter() {
    return (
        <>
            <Route
                element={
                    <ProtectedRoute allowedRoles={["instructor", "admin"]} />
                }
            >
                <Route path="/instructor/dashboard" element={<Dashboard />} />
            </Route>
        </>
    )
}