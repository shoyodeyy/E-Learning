import {useNavigate} from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {useEffect, useState} from "react";
import axios from "axios";

import ArrowDownIcon from "../../assets/images/icon/angle-small-down.png";
import CourseItem from "./CourseItem.jsx";

export default function Courses() {
    const navigate = useNavigate();
    const { user, logout, refreshUser } = useAuth();

    const [ course, setCourse ] = useState([]);

    useEffect(() => {
        async function fetchCourses() {
            const res = await axios.get("http://localhost:8000/api/courses");
            const json = await res.data;

            setCourse(json.data || []);
        }

        fetchCourses();
    }, []);


    useEffect(() => {
        if (!user) return;

        if (!user.email_verified_at) {
            refreshUser();
        }
    }, [user, refreshUser]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    function handleCreateCourse() {
        navigate("/instructor/course/create/1");
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <img src="/images/logo.webp" alt="Udemy Logo" className="h-8" />
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Welcome, {user.name}</span>
                            <div className="flex items-center space-x-2">
                                {user.email_verified_at ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            ✓ Verified
                                        </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            ⚠ Unverified
                                        </span>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow p-6 space-y-10">
                    {/* Title Page */}
                    <h2 className="text-3xl font-extrabold">Courses</h2>

                    <div className="space-y-7">
                        {/* Search + Filter + New Course + Courses */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center space-x-2 gap-4 flex-1">
                                {/* Search */}
                                <input
                                    type="text"
                                    placeholder="Search your courses"
                                    className="px-4 py-3 w-80 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-800 focus:border-purple-800"
                                />

                                {/* Search button with icon */}
                                <button className="px-3 py-3 bg-purple-800 text-white rounded-md hover:bg-purple-800 flex items-center justify-center cursor-pointer">
                                    🔍
                                </button>

                                {/* Sort dropdown */}
                                <div className="relative">
                                    <select className="appearance-none w-50 px-4 pr-10 py-3 border border-gray-300 rounded-md text-purple-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-800 cursor-pointer">
                                        <option>Newest</option>
                                        <option>Oldest</option>
                                        <option>A–Z</option>
                                        <option>Z–A</option>
                                        <option>Published first</option>
                                        <option>Unpublished first</option>
                                    </select>

                                    {/* Custom arrow */}
                                    <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-purple-800">
                                        <img className="w-5" src={ArrowDownIcon} alt="turn-down"/>
                                    </span>
                                </div>
                            </div>

                            {/* New Course Button */}
                            <button onClick={handleCreateCourse} className="px-5 py-3 cursor-pointer bg-purple-800 text-white font-bold rounded-md shadow hover:bg-purple-800">
                                New course
                            </button>
                        </div>

                        {/* Course List */}
                        {course.slice().reverse().map(course => (
                            <CourseItem
                                key={course.courseID}
                                course={course}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}