import { Route } from "react-router-dom";

import Dashboard from "../pages/Student/Dashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

// student feature pages
import Courses from "../components/Courses.jsx";
import CourseDetail from "../pages/Student/CourseDetail.jsx";
import Feedback from "../components/Feedback.jsx";
import Reports from "../components/Reports.jsx";
import MyLearning from "../components/MyLearning.jsx";
import PublicProfile from "../pages/Student/PublicProfile.jsx";
import LecturePage from "../pages/Student/LecturePage.jsx";
import AvatarUploader from "../pages/Student/AvatarUploader.jsx";

export default function StudentRouter() {
    return (
        <>
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/saved-videos" element={<MyLearning />} />
                <Route path="/profile" element={<PublicProfile />} />
                <Route path="/profile/photo" element={<AvatarUploader/>} />
                <Route path="/lecture/:lectureId" element={<LecturePage />} />
            </Route>
        </>
    );
}
