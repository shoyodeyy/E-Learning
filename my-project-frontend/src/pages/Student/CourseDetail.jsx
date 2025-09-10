import { useParams, useNavigate } from "react-router-dom";
import Reports from "./Components-student/Reports.jsx";

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const course = {
        id,
        title: "AWS Certified Developer Associate (DVA-C01)",
        subtitle:
            "Pass the AWS Certified Developer Associate exam with hands-on practice and detailed explanations.",
        instructor: "Stephane Maarek | AWS Expert",
        rating: 4.7,
        reviews: 62345,
        students: 210300,
        lastUpdated: "August 2023",
        language: "English",
        price: 84.99,
        image: "https://img-c.udemycdn.com/course/750x422/123456_abcd.jpg",
        description:
            "This course is designed to help you pass the AWS Certified Developer Associate exam. It includes practice tests, real-world projects, and hands-on labs.",
        highlights: [
            "Deploy applications on AWS",
            "Master AWS Lambda, DynamoDB, API Gateway",
            "Understand IAM, VPC, and core AWS services",
            "Hands-on labs and quizzes",
        ],
        curriculum: [
            { section: "Introduction", lectures: 4, duration: "20m" },
            { section: "AWS Fundamentals", lectures: 10, duration: "1h 15m" },
            { section: "Developing with AWS", lectures: 18, duration: "3h 45m" },
            { section: "Serverless Applications", lectures: 12, duration: "2h 30m" },
        ],
        isFree: false,
        isPurchased: true, // 👈 test flag
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-400"}>
        ★
      </span>
        ));
    };

    const handleGoToCourse = () => navigate(`/lecture/${id}`);

    return (
        <div className="flex flex-col bg-white">


            {/* Hero Section */}
            <div className="bg-gray-900 text-white px-6 lg:px-20 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Hero */}
                <div className="col-span-2">
                    <h1 className="text-3xl font-bold">{course.title}</h1>
                    <p className="text-lg mt-3 text-gray-200">{course.subtitle}</p>

                    <div className="flex items-center mt-3 text-sm">
                        <span className="font-semibold text-yellow-400">{course.rating}</span>
                        <div className="flex ml-1 text-yellow-400">{renderStars(course.rating)}</div>
                        <span className="ml-2 underline">({course.reviews.toLocaleString()} ratings)</span>
                        <span className="ml-2">{course.students.toLocaleString()} students</span>
                    </div>

                    <p className="text-xs mt-2">
                        Created by <span className="underline">{course.instructor}</span>
                    </p>
                    <p className="text-xs mt-1 flex items-center gap-2">
                        🌐 {course.language} • Last updated {course.lastUpdated}
                    </p>
                </div>

                {/* Right Hero / Sidebar */}
                <div className="relative bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden">
                    <div className="relative">
                        <img src={course.image} alt={course.title} className="w-full h-52 object-cover" />
                        <button
                            className="absolute inset-0 flex items-center justify-center text-white bg-black/40 hover:bg-black/60"
                            onClick={handleGoToCourse}
                        >
                            ▶
                        </button>
                    </div>

                    <div className="p-4">
                        {course.isPurchased || course.isFree ? (
                            <button
                                onClick={handleGoToCourse}
                                className="w-full bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700"
                            >
                                Go to course
                            </button>
                        ) : (
                            <>
                                <p className="text-2xl font-bold mb-2">${course.price}</p>
                                <button className="w-full bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700">
                                    Add to cart
                                </button>
                                <button className="w-full mt-2 border border-gray-700 text-gray-800 py-2 rounded-md font-semibold hover:bg-gray-100">
                                    Buy now
                                </button>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    30-Day Money-Back Guarantee
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 lg:px-20 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="col-span-2 space-y-8">
                    {/* Description */}
                    <div>
                        <h2 className="text-2xl font-bold mb-3">Description</h2>
                        <p className="text-gray-700">{course.description}</p>
                    </div>

                    {/* What You'll Learn */}
                    <div>
                        <h2 className="text-2xl font-bold mb-3">What you'll learn</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {course.highlights.map((h, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    ✅ {h}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Curriculum */}
                    <div>
                        <h2 className="text-2xl font-bold mb-3">Course content</h2>
                        <div className="border rounded-md divide-y">
                            {course.curriculum.map((c, i) => (
                                <div key={i} className="p-3 flex justify-between hover:bg-gray-50">
                                    <span>{c.section}</span>
                                    <span className="text-sm text-gray-500">
                    {c.lectures} lectures • {c.duration}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reports */}
                    <Reports />
                </div>

                {/* Right Sidebar placeholder */}
                <div className="hidden lg:block"></div>
            </div>
        </div>
    );
}
