import { Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../pages/Admin/Dashboard.jsx";
import UserList from "../pages/Admin/User/UserList.jsx";
import ChangePassword from "../pages/ChangePassword.jsx";
import Overview from "../pages/Admin/Overview.jsx";
import EventList from "../pages/Admin/Events/EventList.jsx";
import ApprovalEvent from "../pages/Admin/components/ApprovalEvent.jsx";
import Approvals from "../pages/Admin/Approvals.jsx";

export default function AdminRouter() {
    return (
        <>
            <Route
                element={<ProtectedRoute allowedRoles={["admin"]} />}
            >
                <Route path="/admin" element={<Dashboard />}>
                    {/* Dashboard */}
                    <Route path="dashboard" element={<Overview />} />

                    {/* Event List */}
                    <Route path="events" element={<EventList />} />

                    {/* Approval Events (list + detail) */}
                    <Route path="approval/event" element={<ApprovalEvent />} />
                    <Route path="approvals/events/:eventId" element={<ApprovalEvent />} />


                    {/* User */}
                    <Route path="user" element={<UserList />} />
                    <Route path="approval/organizer" element={<Approvals />} />

                    {/* Change password */}
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>
            </Route>
        </>
    );
}
