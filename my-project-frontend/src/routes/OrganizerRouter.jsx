import { Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";
// import Dashboard from "../pages/Organizer/ManageEvents.jsx";
import OrganizerLayout from "../pages/Organizer/OrganizerLayout.jsx";
import ManageEventsLayout from "../pages/Organizer/Event/ManageEvents.jsx";
import UpdateEventForm from "../pages/Organizer/Event/UpdateEvent.jsx";
import CreateEventForm from "../pages/Organizer/Event/CreateEvent.jsx";

export default function OrganizerRouter() {
    return (
        <>
            <Route element={<ProtectedRoute allowedRoles={["organizer", "admin"]} />}>
                <Route path="/organizer" element={<OrganizerLayout />}>
                    <Route path="dashboard" element={<ManageEventsLayout />} />
                    <Route path="manage-events" element={<ManageEventsLayout />} />
                    <Route path="create-event" element={<CreateEventForm />} />
                    <Route path="update-event/:id" element={<UpdateEventForm />} />
                </Route>
            </Route>
        </>
    );
}
