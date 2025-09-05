import { useNavigate } from "react-router-dom";

export default function CreateStepOne({ title, setTitle }) {
    const navigate = useNavigate();

    function handleExitCreate() {
        navigate("/instructor/courses");
    }

    function handleContinue() {
        navigate("/instructor/course/create/2");
    }

    return (
        <>
            <div className="w-screen h-screen bg-gray-100 flex flex-col">
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
                                <p className="text-left text-lg font-semibold">Step 1 of 2</p>
                            </div>

                            {/* Exit */}
                            <div className="flex items-center space-x-4 px-12">
                                <span
                                    onClick={handleExitCreate}
                                    className="hover:bg-purple-100 transition rounded-md p-2 font-bold cursor-pointer">Exit
                                </span>
                            </div>
                        </div>
                        <div className="border-b-4 border-purple-800 w-1/2 transition"/>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto w-full p-20 flex-1">
                    <div className="flex flex-col items-center justify-start h-full space-y-15">
                        <div className="flex flex-col space-y-5 justify-center items-center">
                            <p className="font-extrabold text-3xl">How about a working title?</p>
                            <p className="font-semibold text-gray-800">It's ok if you can't think of a good title now. You can change it later.</p>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <input
                                type="text"
                                placeholder="e.g. Learn Photoshop CS6 from Scratch"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-150 px-5 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-800 focus:border-purple-800"
                            />
                        </div>
                    </div>
                </main>

                <footer className="bg-white shadow-sm">
                    <div>
                        <div className="flex justify-between items-center h-20">
                            <div className="flex items-center justify-end w-full space-x-4 px-6">
                                {/* Continue button */}
                                <button
                                        onClick={handleContinue}
                                        className="px-5 py-2 cursor-pointer bg-purple-800 text-white font-bold rounded-md shadow hover:bg-purple-800 disabled:opacity-30 disabled:cursor-not-allowed"
                                        disabled={title.trim().length === 0}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}