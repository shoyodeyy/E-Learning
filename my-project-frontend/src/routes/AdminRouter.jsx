import {Route} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../pages/Admin/Dashboard.jsx";
import UserList from "../pages/Admin/User/UserList.jsx";
import ChangePassword from "../pages/ChangePassword.jsx";
import Overview from "../pages/Admin/Overview.jsx";
<<<<<<< HEAD
import ApprovalEvent from "../pages/Admin/components/ApprovalEvent.jsx";

=======

import EventList from "../pages/Admin/Events/EventList.jsx"
import ApprovalEvent from "../pages/Admin/components/ApprovalEvent.jsx";
>>>>>>> 540f91773170d77831f784dc6993f5c138a80c58

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

<<<<<<< HEAD
=======

                    {/*Event List*/}
                    <Route path="events" element={<EventList />}/>

>>>>>>> 540f91773170d77831f784dc6993f5c138a80c58
                    <Route path="approval" element={<ApprovalEvent />} />

                    {/* User */}
                    <Route path="user" element={<UserList />} />

                    {/* Change password */}
                    <Route path="change-password" element={<ChangePassword />} />
<<<<<<< HEAD

=======
>>>>>>> 540f91773170d77831f784dc6993f5c138a80c58
                </Route>
            </Route>
        </>
    )
}
