export default function SidebarCourseManage() {
    return (
        <div className="min-w-55 h-full pt-10 flex flex-col space-y-8">
            <div className="flex flex-col space-y-15 w-full">
                {/* Create your content */}
                <div className="flex flex-col">
                    <p className="py-2 text-[18px] font-bold">
                        Create your content
                    </p>
                    <button
                        className="py-1.5 px-9 text-left text-[16px] cursor-pointer border-l-4 hover:bg-gray-200"
                    >
                        Curriculum
                    </button>
                </div>

                {/* Publish your course */}
                <div className="flex flex-col">
                    <p className="py-2 text-[18px] font-bold">
                        Publish your course
                    </p>
                    <button
                        className="py-1.5 px-9 text-left text-[16px] cursor-pointer hover:bg-gray-200"
                    >
                        Course landing page
                    </button>
                    <button
                        className="py-1.5 px-9 text-left text-[16px] cursor-pointer hover:bg-gray-200"
                    >
                        Pricing
                    </button>
                    <button
                        className="py-1.5 px-9 text-left text-[16px] cursor-pointer hover:bg-gray-200"
                    >
                        Promotions
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <button
                className="bg-purple-700 text-white font-semibold w-full py-2 px-5 rounded-sm cursor-pointer hover:bg-purple-600 transition"
            >
                Submit for Review
            </button>
        </div>
    )
}