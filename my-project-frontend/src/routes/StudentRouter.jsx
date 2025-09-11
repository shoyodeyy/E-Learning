import { Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../pages/Student/Dashboard.jsx";
import MyRegistrations from "../pages/Student/MyRegistrations.jsx";
import Profile from "../pages/Student/Profile.jsx";
import UserLayout from "../pages/Student/UserLayout.jsx";
import EditProfile from "../pages/Student/EditProfile.jsx";
import SeatLayout from "../pages/Organizer/Event/SeatLayout.jsx";
import ChangePassword from "../pages/ChangePassword.jsx";
import Gallery from "../pages/Gallery.jsx";

export default function StudentRouter() {
    return (
        <>
            <Route element={<ProtectedRoute />}>
                <Route path="/user" element={<UserLayout />}>
                    <Route path="profile" element={<Profile />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="registration" element={<MyRegistrations />} />

                    <Route path="edit-profile" element={<EditProfile />} />
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>
                <Route path="/media-gallery" element={<Gallery />} />
                <Route path="/event/:id/seat" element={<SeatLayout />} />
            </Route>
        </>
    );
}
