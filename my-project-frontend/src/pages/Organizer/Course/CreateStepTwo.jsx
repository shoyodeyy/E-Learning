import { useNavigate } from "react-router-dom";
import { useState } from "react";

import axios from 'axios';
import ArrowDownIcon from "../../assets/images/icon/angle-small-down.png";

export default function CreateStepTwo({ title, setTitle, category, setCategory }) {
    const navigate = useNavigate();

    const [ response, setResponse ] = useState(null);

    function handleExitCreate() {
        navigate("/instructor/courses");
    }

    function handlePreviousStep() {
        navigate("/instructor/course/create/1");
    }

    async function handleCreateCourse() {
        try {
            const res = await axios.post('http://localhost:8000/api/courses', {
                courseTitle: title,
                categoryID: category
            });

            console.log("Course created: ", res.data);
            setResponse(res.data);

            navigate(`/instructor/course/${res.data.data.courseID}/manage/curriculum`);
        } catch (err) {
            console.log(err);
            setResponse(err.response?.data);
        }
    }

    return (
        <>
            <div className="w-screen h-screen bg-gray-100 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div>
                        <div className="flex justify-between items-center h-20">
                            {/* Logo */}
                            <div className="border-r-1 border-gray-300 h-full flex items-center px-8">
                                <div className="flex items-center">
                                    <img src="/images/logo.webp" alt="Udemy Logo" className="h-8" />
                                </div>
                            </div>

                            {/* Current Step */}
                            <div className="text-left mr-auto px-8">
                                <p className="text-left text-lg font-semibold">Step 2 of 2</p>
                            </div>

                            {/* Exit */}
                            <div className="flex items-center space-x-4 px-12">
                                <span
                                    onClick={handleExitCreate}
                                    className="hover:bg-purple-100 transition rounded-md p-2 font-bold cursor-pointer">Exit
                                </span>
                            </div>
                        </div>
                        <div className="border-b-4 border-purple-800 w-full transition"/>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto w-full p-20 flex-1">
                    <div className="flex flex-col items-center justify-start h-full space-y-15">
                        <div className="flex flex-col space-y-5 justify-center items-center">
                            <p className="font-extrabold text-3xl">What category best fits the knowledge you'll share?</p>
                            <p className="font-semibold text-gray-800">If you're not sure about the right category, you can change it later.</p>
                        </div>

                        {/* Main Input */}
                        <div className="w-full flex items-center justify-center">
                            <div className="relative">
                                {/* Sort dropdown */}
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="appearance-none w-150 px-3 pr-10 py-2 border border-gray-400 rounded-md text-sm text-gray-600 font-semibold focus:outline-none focus:ring-purple-800 cursor-pointer">
                                    <option value="">Choose a category</option>
                                    <option value="CA01">Development</option>
                                    <option value="CA02">Business</option>
                                    <option value="CA03">Finance & Accounting</option>
                                    <option value="CA04">IT & Software</option>
                                    <option value="CA05">Office Productivity</option>
                                    <option value="CA06">Personal Development</option>
                                    <option value="CA07">Design</option>
                                    <option value="CA08">Marketing</option>
                                    <option value="CA09">Lifestyle</option>
                                    <option value="CA10">Photography & Video</option>
                                    <option value="CA11">Health & Fitness</option>
                                    <option value="CA12">Music</option>
                                    <option value="CA13">Teaching & Academics</option>
                                    <option value="unknown">I don't know yet</option>
                                </select>

                                {/* Custom arrow */}
                                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-purple-800">
                                        <img className="w-5" src={ ArrowDownIcon } alt="turn-down"/>
                                    </span>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white shadow-sm">
                    <div>
                        <div className="flex justify-between items-center h-20">
                            <div className="flex items-center justify-between w-full space-x-4 px-6">
                                {/* Previous button */}
                                <button
                                    onClick={handlePreviousStep}
                                    className="px-5 py-2 cursor-pointer border bg-transparent text-purple-800 font-bold rounded-md hover:bg-purple-100">
                                    Previous
                                </button>

                                {/* Create Course button */}
                                <button
                                    onClick={handleCreateCourse}
                                    className="px-5 py-2 cursor-pointer bg-purple-800 text-white font-bold rounded-md shadow hover:bg-purple-800 disabled:opacity-30 disabled:cursor-not-allowed"
                                    disabled={category === ""}
                                >
                                    Create Course
                                </button>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}