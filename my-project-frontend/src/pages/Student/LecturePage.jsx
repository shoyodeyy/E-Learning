import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";

export default function LecturePage() {
    return (
        <>
            {/* Header */}
            <header>
                <Header />
            </header>

            {/* Main content */}
            <main className="flex h-screen bg-gray-100">
                {/* Sidebar - Lecture list */}
                <aside className="w-80 bg-white border-r overflow-y-auto">
                    <div className="p-4 font-bold text-lg border-b">Course Content</div>
                    <ul>
                        <li className="p-3 border-b hover:bg-gray-50 cursor-pointer">
                            1. Introduction
                        </li>
                        <li className="p-3 border-b hover:bg-gray-50 cursor-pointer">
                            2. Getting Started
                        </li>
                        <li className="p-3 border-b hover:bg-gray-50 cursor-pointer">
                            3. Advanced Topics
                        </li>
                        <li className="p-3 border-b hover:bg-gray-50 cursor-pointer">
                            4. Summary
                        </li>
                    </ul>
                </aside>

                {/* Main Lecture Content */}
                <section className="flex-1 flex flex-col">
                    {/* Video player */}
                    <div className="bg-black h-[60vh] flex items-center justify-center">
                        <video
                            controls
                            className="w-full h-full object-cover"
                            src="https://www.w3schools.com/html/mov_bbb.mp4"
                        >
                            Your browser does not support video.
                        </video>
                    </div>

                    {/* Lecture details */}
                    <div className="p-6 bg-white shadow">
                        <h1 className="text-2xl font-semibold mb-2">
                            Lecture 1: Introduction
                        </h1>
                        <p className="text-gray-600 mb-4">
                            In this lecture, we’ll go over the basics of the course and what
                            you can expect.
                        </p>

                        {/* Extra actions */}
                        <div className="flex gap-4">
                            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                                Add Note
                            </button>
                            <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                                Resources
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </>
    );
}
