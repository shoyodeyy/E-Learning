export default function MyLearning() {
    const savedLectures = [
        {
            id: 1,
            course: "How to speak to anyone & be fearless",
            lecture: "1. Intro",
            thumbnail: "https://mp4-c.udemycdn.com/2016-03-03_01-42-31-cb61a0c3d34b1033b5ad941941ffafd1/thumb-1.jpg",
            duration: "3m",
        },
        {
            id: 2,
            course: "Useful Excel for Beginners",
            lecture: "1. Introduction to the Course",
            thumbnail: "https://img-c.udemycdn.com/lecture/480_H/304308_2d6f.jpg",
            duration: "7m",
        },
    ];

    return (
        <div className="px-6 py-8 relative">
            <h2 className="text-2xl font-semibold mb-4">Let's start learning</h2>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {savedLectures.map((item) => (
                    <div
                        key={item.id}
                        className="flex min-w-[320px] border border-gray-200 bg-gray-50 shadow-sm transition"
                    >
                        <div className="relative w-36 h-24 flex-shrink-0">
                            <img
                                src={item.thumbnail}
                                alt={item.lecture}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
                                <span className="text-white text-3xl">▶</span>
                            </div>
                        </div>
                        <div className="p-3 flex flex-col justify-between">
                            <p className="text-xs text-gray-500 line-clamp-1">{item.course}</p>
                            <h3 className="font-semibold line-clamp-1">{item.lecture}</h3>
                            <p className="text-sm text-gray-500">Lecture • {item.duration}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
