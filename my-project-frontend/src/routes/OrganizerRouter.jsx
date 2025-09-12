import { Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";
// import Dashboard from "../pages/Organizer/ManageEvents.jsx";
import OrganizerLayout from "../pages/Organizer/OrganizerLayout.jsx";
import ManageEventsLayout from "../pages/Organizer/Event/ManageEvents.jsx";
import UpdateEventForm from "../pages/Organizer/Event/UpdateEvent.jsx";
import CreateEventForm from "../pages/Organizer/Event/CreateEvent.jsx";

import DetailEvent from "../pages/Organizer/Event/DetailEvent.jsx";

import ChangePassword from "../pages/ChangePassword.jsx";
import Overview from "../pages/Organizer/Overview.jsx";


export default function OrganizerRouter() {
    return (
        <>
            <Route element={<ProtectedRoute allowedRoles={["organizer", "admin"]} />}>
                <Route path="/organizer" element={<OrganizerLayout />}>
                    <Route path="dashboard" element={<Overview />} />
                    <Route path="manage-events" element={<ManageEventsLayout />} />
                    <Route path="create-event" element={<CreateEventForm />} />
                    <Route path="update-event/:id" element={<UpdateEventForm />} />

                    <Route path="event-detail/:id" element={<DetailEvent />} />

                    <Route path="change-password" element={<ChangePassword/>}/>

                </Route>
            </Route>
        </>
    );
}
