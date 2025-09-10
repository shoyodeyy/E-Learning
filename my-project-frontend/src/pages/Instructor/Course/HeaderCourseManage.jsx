import {useNavigate} from "react-router-dom";
import { MoveLeft, Trash } from "lucide-react";
import axios from'axios';
import { apiUrl } from "../../../services/http.jsx";
import {toast} from "react-toastify";

export default function HeaderCourseManage({ title, status, course }) {
    const navigate = useNavigate();

    function formatDuration(totalSeconds) {
        if (!totalSeconds || totalSeconds <= 0) return "0s";

        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        if (hrs > 0) {
            return `${hrs}h ${mins}m`;
        } else if (mins > 0) {
            return `${mins}m`;
        } else {
            return `${secs}s`;
        }
    }

    async function handleDeleteCourse(courseId) {
        const confirmed = window.confirm("Are you sure you want to delete this course?");
        if (!confirmed) return;

        try {
            await axios.delete(`${apiUrl}/courses/${courseId}`);
            toast.success("Course deleted successfully!");
            navigate("/instructor/courses");
        } catch (error) {
            console.error("Error deleting course:", error);
            toast.error("Failed to delete course. Please try again.");
        }
    }

    return (
        <header className="fixed w-full bg-gray-900 shadow-sm shadow-gray-400 z-10">
            <div className="flex flex-wrap items-center space-x-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-5">
                {/* Back to courses */}
                <div
                    onClick={() => navigate("/instructor/courses")}
                    className="flex items-center justify-center space-x-4 h-14 cursor-pointer hover:opacity-90 transition-opacity">
                    <MoveLeft color="#ffffff" className="w-5"/>
                    <p className="text-white font-semibold">
                        Back to courses
                    </p>
                </div>

                {/* Name Course */}
                <div className="flex items-center justify-center space-x-2 h-14">
                    <p className="text-white text-xl font-bold">
                        {title}
                    </p>
                </div>

                {/* DRAFT Box */}
                <div className="flex items-center justify-center space-x-2 h-14">
                    <div className="bg-gray-400 rounded-md">
                        <p className="text-white text-[13px] font-bold py-0.5 px-2">
                            { status.toUpperCase() }
                        </p>
                    </div>
                </div>

                {/* Minutes */}
                <div className="flex items-center justify-center space-x-2 h-14">
                    <p className="text-white font-semibold">
                        {formatDuration(course?.totalDuration)} of video content uploaded
                    </p>
                </div>

                {/* Preview button */}
                <div className="flex items-center justify-end flex-1 space-x-2 h-14">
                    <button
                        className="px-5 py-1.5 cursor-pointer border bg-transparent text-white text-sm font-bold rounded-md hover:bg-gray-800">
                        Preview
                    </button>
                </div>

                {/* Trash Icon */}
                <div className="flex items-center justify-center space-x-2 h-14">
                    <Trash
                        color="#f56565"
                        className="cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleDeleteCourse(course.id)}
                    />
                </div>
            </div>
        </header>
    )
}
