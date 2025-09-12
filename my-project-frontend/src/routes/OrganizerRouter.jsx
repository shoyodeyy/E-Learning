import { Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";
import OrganizerLayout from "../pages/Organizer/OrganizerLayout.jsx";
import ManageEventsLayout from "../pages/Organizer/Event/ManageEvents.jsx";
import UpdateEventForm from "../pages/Organizer/Event/UpdateEvent.jsx";
import CreateEventForm from "../pages/Organizer/Event/CreateEvent.jsx";
import ChangePassword from "../pages/ChangePassword.jsx";
import Overview from "../pages/Organizer/Overview.jsx";
import Profile from "../pages/Student/Profile.jsx";
import EditProfile from "../pages/Student/EditProfile.jsx";

export default function OrganizerRouter() {
    return (
        <>
            <Route element={<ProtectedRoute allowedRoles={["organizer", "admin"]} />}>
                <Route path="/organizer" element={<OrganizerLayout />}>
                    <Route path="dashboard" element={<Overview />} />

                    <Route path="manage-events" element={<ManageEventsLayout />} />
                    <Route path="create-event" element={<CreateEventForm />} />
                    <Route path="update-event/:id" element={<UpdateEventForm />} />

                    <Route path="profile" element={<Profile />} />
                    <Route path="edit-profile" element={<EditProfile />} />
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>
            </Route>
        </>
    );
}
