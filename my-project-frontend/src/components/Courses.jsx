import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [hoveredCourse, setHoveredCourse] = useState(null);
    const [setHoverPosition] = useState("top-0");
    const cardRefs = useRef({});
    const scrollRef = useRef(null);
    const navigate = useNavigate();


    useEffect(() => {
        setCourses([
            {
                id: 1,
                title: "React for Beginners",
                instructor: "John Doe",
                rating: 4.7,
                reviews: 15230,
                price: 19.99,
                image:
                    "https://img-c.udemycdn.com/course/240x135/2195280_49b2_2.jpg",
                description:
                    "Learn React from scratch. Build modern UI with components and hooks.",
                highlights: [
                    "Understand JSX and Components",
                    "Use Hooks effectively",
                    "Build dynamic React apps",
                ],
                updated: "October 2023",
                level: "Beginner",
                duration: "7.5 hours",
            },
            {
                id: 2,
                title: "Mastering Node.js",
                instructor: "Jane Smith",
                rating: 4.5,
                reviews: 9830,
                price: 14.99,
                image:
                    "https://img-c.udemycdn.com/course/240x135/922484_52a1_8.jpg",
                description:
                    "Master backend development with Node.js and build scalable apps.",
                highlights: [
                    "Event-driven architecture",
                    "Build REST APIs",
                    "Integrate with databases",
                ],
                updated: "June 2023",
                level: "Intermediate",
                duration: "10 hours",
            },
            {
                id: 3,
                title: "Fullstack with Django & React",
                instructor: "Alex Johnson",
                rating: 4.8,
                reviews: 20540,
                price: 21.99,
                image:
                    "https://img-c.udemycdn.com/course/240x135/364426_2991_6.jpg",
                description:
                    "Build fullstack applications combining Django REST and React.",
                highlights: [
                    "Django REST Framework",
                    "React frontend integration",
                    "Authentication and deployment",
                ],
                updated: "May 2023",
                level: "Advanced",
                duration: "15 hours",
            },{
                id: 4,
                title: "React for Beginners",
                instructor: "John Doe",
                rating: 4.7,
                reviews: 15230,
                price: 19.99,
                image:
                    "https://img-c.udemycdn.com/course/240x135/2195280_49b2_2.jpg",
                description:
                    "Learn React from scratch. Build modern UI with components and hooks.",
                highlights: [
                    "Understand JSX and Components",
                    "Use Hooks effectively",
                    "Build dynamic React apps",
                ],
                updated: "October 2023",
                level: "Beginner",
                duration: "7.5 hours",
            },
            {
                id: 2,
                title: "Mastering Node.js",
                instructor: "Jane Smith",
                rating: 4.5,
                reviews: 9830,
                price: 14.99,
                image:
                    "https://img-c.udemycdn.com/course/240x135/922484_52a1_8.jpg",
                description:
                    "Master backend development with Node.js and build scalable apps.",
                highlights: [
                    "Event-driven architecture",
                    "Build REST APIs",
                    "Integrate with databases",
                ],
                updated: "June 2023",
                level: "Intermediate",
                duration: "10 hours",
            },
            {
                id: 6,
                title: "Fullstack with Django & React",
                instructor: "Alex Johnson",
                rating: 4.8,
                reviews: 20540,
                price: 21.99,
                image:
                    "https://img-c.udemycdn.com/course/240x135/364426_2991_6.jpg",
                description:
                    "Build fullstack applications combining Django REST and React.",
                highlights: [
                    "Django REST Framework",
                    "React frontend integration",
                    "Authentication and deployment",
                ],
                updated: "May 2023",
                level: "Advanced",
                duration: "15 hours",
            },
            // 👉 thêm các course khác như bạn đã có
        ]);
    }, []);
    const handleClick = (id) => {
        navigate(`/courses/${id}`);
    };

    const handleMouseEnter = (id) => {
        setHoveredCourse(id);
        const card = cardRefs.current[id];
        if (card) {
            const rect = card.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            if (spaceBelow < 250) {
                setHoverPosition("bottom-0");
            } else {
                setHoverPosition("top-0");
            }
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`${
                        i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"
                    }`}
                >
          ★
        </span>
            );
        }
        return stars;
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft } = scrollRef.current;
            const cardWidth = 216; // card 200px + gap 16px
            scrollRef.current.scrollTo({
                left:
                    direction === "left" ? scrollLeft - cardWidth : scrollLeft + cardWidth,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="px-6 py-8 relative">
            <h1 className="text-2xl font-bold mb-6">Top Courses</h1>

            <div className="relative">
                {/* Nút trái */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Thanh cuộn ngang */}
                <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-4">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                ref={(el) => (cardRefs.current[course.id] = el)}
                                className="relative min-w-[200px] max-w-[200px] bg-white hover:shadow-md transition cursor-pointer"
                                onMouseEnter={() => handleMouseEnter(course.id)}
                                onMouseLeave={() => setHoveredCourse(null)}
                                onClick={() => handleClick(course.id)}
                            >
                                {/* Ảnh khóa học */}
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-[120px] object-cover"
                                />

                                {/* Thông tin cơ bản */}
                                <div className="mt-2 mb-2">
                                    <h2 className="font-semibold text-[13px] leading-snug line-clamp-2">
                                        {course.title}
                                    </h2>

                                    <p className="text-gray-600 text-[12px] mt-1">
                                        {course.instructor}
                                    </p>

                                    <div className="flex items-center text-[12px] mt-1">
                    <span className="font-semibold mr-1">
                      {course.rating}
                    </span>
                                        <div className="flex">{renderStars(course.rating)}</div>
                                        <span className="text-gray-500 ml-2 text-[11px]">
                      ({course.reviews.toLocaleString()})
                    </span>
                                    </div>

                                    <p className="text-gray-500 text-[11px] mt-1">
                                        {course.duration} • {course.lectures} lectures •{" "}
                                        {course.level}
                                    </p>

                                    <div className="mt-2">
                    <span className="font-bold text-[14px] mr-2">
                      ₫{course.price.toLocaleString()}
                    </span>
                                        {course.originalPrice && (
                                            <span className="text-gray-500 line-through text-[12px]">
                        ₫{course.originalPrice.toLocaleString()}
                      </span>
                                        )}
                                    </div>
                                    <div>
                                            <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded mt-3">
                                             Bestseller
                                            </span>
                                    </div>

                                </div>

                                {/* Popup chi tiết khi hover */}
                                {hoveredCourse === course.id && (
                                    <div
                                        className="fixed w-72 bg-white border rounded-lg shadow-lg p-4 z-50"
                                        style={{
                                            top:
                                                cardRefs.current[course.id]?.getBoundingClientRect().top +
                                                window.scrollY -
                                                20, // 🔥 đẩy lên 20px
                                            left:
                                                cardRefs.current[course.id]?.getBoundingClientRect().right + 12,
                                        }}
                                    >
                                        <h3 className="font-bold text-base">{course.title}</h3>

                                        <p className="text-xs text-gray-500 mt-1">
                                            Updated {course.updated} • {course.level} • {course.duration}
                                        </p>
                                        <p className="text-sm text-gray-700 mt-2 line-clamp-3">{course.description}</p>

                                        <ul className="text-sm text-gray-600 mt-2 space-y-1">
                                            {course.highlights.map((h, i) => (
                                                <li key={i} className="flex items-start gap-1">
                                                    ✅ {h}
                                                </li>
                                            ))}
                                        </ul>

                                        <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700">
                                            Add to cart
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nút phải */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}