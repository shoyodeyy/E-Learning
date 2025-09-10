import CourseThumbnail from "../../assets/images/icon/video-tutorial-bro.png";
import {useNavigate} from "react-router-dom";

export default function CourseItem({ course }) {
    const navigate = useNavigate();

    function handleNavigateToCourse() {
        console.log("Navigated to course.");

        navigate(`/instructor/course/${course.courseID}/manage/curriculum`);
    }

    return (
        <div className="border border-gray-200 flex">
            {/* Thumbnail */}
            <div className="bg-gray-50 w-35 h-35 p-1 flex items-center justify-center">
                <img src={ CourseThumbnail } alt="course-thumbnail"/>
            </div>

            {/* Info */}
            <div
                onClick={handleNavigateToCourse}
                className="w-full px-5 py-4 relative flex flex-col justify-start group cursor-pointer">
                {/* Course title */}
                <div className="flex-1">
                    <p className="text-lg font-bold">
                        {course.courseTitle}
                    </p>
                </div>

                {/* Course Progress */}
                <div className="flex-1 flex justify-end items-center space-x-5">
                    <p className="text-lg font-bold">Finished your course</p>
                    <div className="w-100 h-2 bg-gray-300">
                        <div className="w-20 h-2 bg-purple-800"/>
                    </div>
                </div>

                <div className="flex space-x-2">
                    {/* Course Status */}
                    <p className="text-sm font-semibold">
                        {course.status ? course.status.statusName.toUpperCase() : ""}
                    </p>

                    {/* Course Badge */}
                    <p className="text-sm">
                        {course.badge}
                    </p>
                </div>

                {/* Edit text (hide default, display s hover group */}
                <p className="text-xl text-purple-800 font-bold flex items-center justify-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90">
                    Edit / Manage course
                </p>
            </div>
        </div>
    )
}