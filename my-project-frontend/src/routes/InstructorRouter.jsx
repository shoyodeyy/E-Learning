import {Route} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../pages/Instructor/Dashboard.jsx";
import Courses from '../pages/Instructor/Course/Courses.jsx';
import CreateCourse from "../pages/Instructor/Course/CreateCourse.jsx";
import Curriculum from "../pages/Instructor/Course/Curriculum.jsx";

export default function InstructorRouter() {
    return (
        <>
            <Route
                element={
                    <ProtectedRoute allowedRoles={["instructor", "admin"]} />
                }
            >
                <Route path="/instructor/dashboard" element={<Dashboard />} />

                <Route path="/instructor/courses" element={<Courses />} />
                <Route path="/instructor/course/create/*" element={<CreateCourse />} />
                <Route path='/instructor/course/:courseID/manage/curriculum' element={<Curriculum />} />
            </Route>
        </>
    )
}