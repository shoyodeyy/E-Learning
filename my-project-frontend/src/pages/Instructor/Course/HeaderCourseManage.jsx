import {useNavigate} from "react-router-dom";

import ArrowLeftIcon from "../../../assets/images/icon/angle-small-left.png";
import SettingIcon from "../../../assets/images/icon/settings.png";

export default function HeaderCourseManage({ title, status }) {
    const navigate = useNavigate();

    return (
        <header className="fixed w-full bg-gray-900 shadow-sm shadow-gray-400 z-10">
            <div className="flex flex-wrap items-center space-x-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-5">
                {/* Back to courses */}
                <div
                    onClick={() => navigate("/instructor/courses")}
                    className="flex items-center justify-center space-x-2 h-14 cursor-pointer hover:opacity-90 transition-opacity">
                    <img
                        src={ ArrowLeftIcon }
                        alt="arrow-left"
                        className="w-5"
                    />
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
                        0min of video content uploaded
                    </p>
                </div>

                {/* Preview button */}
                <div className="flex items-center justify-end flex-1 space-x-2 h-14">
                    <button
                        className="px-5 py-1.5 cursor-pointer border bg-transparent text-white text-sm font-bold rounded-md hover:bg-gray-800">
                        Preview
                    </button>
                </div>

                {/* Setting Icon */}
                <div className="flex items-center justify-center space-x-2 h-14">
                    <img
                        className="w-5 cursor-pointer hover:opacity-90 transition-opacity"
                        src={ SettingIcon }
                        alt="setting-icon"
                    />
                </div>
            </div>
        </header>

    )
}