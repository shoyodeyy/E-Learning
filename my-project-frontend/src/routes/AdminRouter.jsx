import {Route} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../pages/Admin/Dashboard.jsx";
import UserList from "../pages/Admin/User/UserList.jsx";
import ChangePassword from "../pages/ChangePassword.jsx";
import Overview from "../pages/Admin/Overview.jsx";
import EventList from "../pages/Admin/Events/EventList.jsx"
import ApprovalEvent from "../pages/Admin/components/ApprovalEvent.jsx";


export default function AdminRouter() {
    return (
        <>
            <Route
                element={
                    <ProtectedRoute allowedRoles={["admin"]} />
                }
            >
                <Route path="/admin" element={<Dashboard />}>
                    <Route path="dashboard" element={<Overview />} />

                    {/*Event List*/}
                    <Route path="events" element={<EventList />}/>

                    <Route path="approval" element={<ApprovalEvent />} />

                    {/* User */}
                    <Route path="user" element={<UserList />} />

                    {/* Change password */}
                    <Route path="change-password" element={<ChangePassword />} />

                </Route>
            </Route>
        </>
    )
}
