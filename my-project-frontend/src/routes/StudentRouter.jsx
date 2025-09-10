import { Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";

import Dashboard from "../pages/Student/Dashboard.jsx"
import MyRegistrations from "../pages/Student/MyRegistrations.jsx";
import PublicProfile from "../pages/Student/PublicProfile.jsx";
import Gallery from "../pages/Gallery.jsx";
// import PersonalInformation from "../pages/Student/Profile.jsx"

export default function StudentRouter() {
    return (
        <>
            <Route element={<ProtectedRoute />}>
                {/*<Route path="/profile" element={<PersonalInformation />} />*/}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/registration" element={<MyRegistrations />} />
                <Route path="/media-gallery" element={<Gallery />} />
            </Route>
        </>
    );
}