import {Route} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../pages/Organizer/Dashboard.jsx";
import Overview from "../pages/Organizer/Overview.jsx";
import EventList from "../pages/Organizer/component/EventList.jsx";
import ChangePassword from "../pages/ChangePassword.jsx";

export default function OrganizerRouter() {
    return (
        <Route
            element={<ProtectedRoute allowedRoles={["organizer", "admin"]}/>}
        >
            <Route path="/organizer/dashboard" element={<Dashboard/>}>
                <Route index element={<Overview/>}/>
                <Route path="events" element={<EventList/>}/>
                <Route path="change-password" element={<ChangePassword/>}/>
            </Route>
        </Route>
    )
}