import {Route} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../pages/Organizer/Dashboard.jsx";

export default function OrganizerRouter() {
    return (
        <>
            <Route
                element={
                    <ProtectedRoute allowedRoles={["organizer", "admin"]} />
                }
            >
                <Route path="/organizer/dashboard" element={<Dashboard />} />
            </Route>
        </>
    )
}