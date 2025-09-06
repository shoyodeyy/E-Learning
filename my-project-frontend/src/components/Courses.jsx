import { useEffect, useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ReactDOM from "react-dom"

export default function Courses() {
    const [courses, setCourses] = useState([])
    const [hoveredCourse, setHoveredCourse] = useState(null)
    const [popupPos, setPopupPos] = useState({ top: 0, left: 0 })
    const cardRefs = useRef({})
    const scrollRef = useRef(null)
    const hideTimeoutRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        setCourses([
            {
                id: 1,
                title: "React for Beginners",
                instructor: "John Doe",
                rating: 4.7,
                reviews: 15230,
                price: 199000,
                image: "https://img-c.udemycdn.com/course/240x135/2195280_49b2_2.jpg",
                description: "Learn React from scratch. Build modern UI with components and hooks.",
                highlights: ["Understand JSX and Components", "Use Hooks effectively", "Build dynamic React apps"],
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
                price: 149000,
                image: "https://img-c.udemycdn.com/course/240x135/922484_52a1_8.jpg",
                description: "Master backend development with Node.js and build scalable apps.",
                highlights: ["Event-driven architecture", "Build REST APIs", "Integrate with databases"],
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
                price: 219000,
                image: "https://img-c.udemycdn.com/course/240x135/364426_2991_6.jpg",
                description: "Build fullstack applications combining Django REST and React.",
                highlights: ["Django REST Framework", "React frontend integration", "Authentication and deployment"],
                updated: "May 2023",
                level: "Advanced",
                duration: "15 hours",
            },
            {
                id: 4,
                title: "Advanced React Patterns",
                instructor: "Sarah Lee",
                rating: 4.9,
                reviews: 7520,
                price: 249000,
                image: "https://img-c.udemycdn.com/course/240x135/1565838_e54e_16.jpg",
                description: "Learn advanced React patterns and state management techniques.",
                highlights: [
                    "Render props & Higher-order components",
                    "Context API & Redux Toolkit",
                    "Performance optimization",
                ],
                updated: "July 2023",
                level: "Advanced",
                duration: "12 hours",
            },
            {
                id: 5,
                title: "JavaScript Essentials",
                instructor: "Emily Davis",
                rating: 4.6,
                reviews: 18300,
                price: 99000,
                image: "https://img-c.udemycdn.com/course/240x135/851712_fc61_6.jpg",
                description: "Master the fundamentals of JavaScript for web development.",
                highlights: ["Variables, functions, and loops", "ES6+ features", "DOM manipulation"],
                updated: "March 2023",
                level: "Beginner",
                duration: "6 hours",
            },
            {
                id: 6,
                title: "Python for Data Science",
                instructor: "Michael Brown",
                rating: 4.7,
                reviews: 22000,
                price: 189000,
                image: "https://img-c.udemycdn.com/course/240x135/903744_8eb2.jpg",
                description: "Analyze data with Python, NumPy, Pandas, and Matplotlib.",
                highlights: ["Data wrangling with Pandas", "Visualization with Matplotlib", "Intro to Machine Learning"],
                updated: "April 2023",
                level: "Intermediate",
                duration: "14 hours",
            },
            {
                id: 7,
                title: "Machine Learning A-Z",
                instructor: "Andrew Ng",
                rating: 4.8,
                reviews: 30120,
                price: 299000,
                image: "https://img-c.udemycdn.com/course/240x135/950390_270f_3.jpg",
                description: "Hands-on machine learning with Scikit-Learn, TensorFlow, and Keras.",
                highlights: ["Supervised & Unsupervised learning", "Neural networks", "Real projects"],
                updated: "Feb 2023",
                level: "Advanced",
                duration: "40 hours",
            },
            {
                id: 8,
                title: "SQL Bootcamp",
                instructor: "Mark Wilson",
                rating: 4.6,
                reviews: 12800,
                price: 129000,
                image: "https://img-c.udemycdn.com/course/240x135/762616_7693_3.jpg",
                description: "Learn SQL for data analysis and database management.",
                highlights: ["Queries & Joins", "Database design", "Practical exercises"],
                updated: "Jan 2023",
                level: "Beginner",
                duration: "9 hours",
            },
            {
                id: 9,
                title: "DevOps with Docker & Kubernetes",
                instructor: "Laura Green",
                rating: 4.7,
                reviews: 9100,
                price: 259000,
                image: "https://img-c.udemycdn.com/course/240x135/1793828_7999.jpg",
                description: "Learn containerization and orchestration with Docker & Kubernetes.",
                highlights: ["Docker essentials", "Kubernetes deployment", "CI/CD pipelines"],
                updated: "Dec 2023",
                level: "Intermediate",
                duration: "20 hours",
            },
            {
                id: 10,
                title: "UI/UX Design Masterclass",
                instructor: "Sophia White",
                rating: 4.5,
                reviews: 7800,
                price: 199000,
                image: "https://img-c.udemycdn.com/course/240x135/1565838_e54e_16.jpg",
                description: "Learn UI/UX principles, wireframing, and prototyping.",
                highlights: ["Figma design", "User research", "Design systems"],
                updated: "Nov 2023",
                level: "Beginner",
                duration: "18 hours",
            },
        ])
    }, [])

    const handleClick = (id) => {
        navigate(`/courses/${id}`)
    }

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`${i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"}`}>
        ★
      </span>
        ))
    }

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft } = scrollRef.current
            const cardWidth = window.innerWidth < 640 ? 180 : 216 // Responsive card width
            const visibleCards = window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 5
            scrollRef.current.scrollTo({
                left: direction === "left" ? scrollLeft - cardWidth * visibleCards : scrollLeft + cardWidth * visibleCards,
                behavior: "smooth",
            })
        }
    }

    const handleMouseEnter = (courseId) => {
        if (window.innerWidth < 768) return

        // Clear any pending hide timeout
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
            hideTimeoutRef.current = null
        }

        const card = cardRefs.current[courseId]
        if (card) {
            const rect = card.getBoundingClientRect()
            const popupWidth = 288 // w-72 = 288px
            const viewportWidth = window.innerWidth
            const spaceOnRight = viewportWidth - rect.right
            const spaceOnLeft = rect.left

            // If there's not enough space on the right, show on the left
            const showOnLeft = spaceOnRight < popupWidth + 12 && spaceOnLeft > popupWidth + 12

            setPopupPos({
                top: rect.top - 12,
                left: showOnLeft ? rect.left - popupWidth - 12 : rect.right + 12,
            })
        }
        setHoveredCourse(courseId)
    }

    const handleMouseLeave = () => {
        // Add a small delay before hiding to allow mouse to move to popup
        hideTimeoutRef.current = setTimeout(() => {
            setHoveredCourse(null)
        }, 100)
    }

    const handlePopupMouseEnter = () => {
        // Clear hide timeout when mouse enters popup
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
            hideTimeoutRef.current = null
        }
    }

    const handlePopupMouseLeave = () => {
        // Hide popup immediately when mouse leaves popup area
        setHoveredCourse(null)
    }

    useEffect(() => {
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current)
            }
        }
    }, [])

    return (
        <div className="px-4 sm:px-6 py-8 relative">
            <h1 className="text-xl sm:text-2xl font-bold mb-6">Top Courses</h1>

            <div className="relative">
                <button
                    onClick={() => scroll("left")}
                    className="cursor-pointer hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
                >
                    <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>

                <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 sm:gap-4 pb-4">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                ref={(el) => (cardRefs.current[course.id] = el)}
                                className="min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] bg-white hover:shadow-md transition cursor-pointer rounded-lg overflow-hidden"
                                onMouseEnter={() => handleMouseEnter(course.id)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handleClick(course.id)}
                            >
                                <img
                                    src={course.image || "/placeholder.svg"}
                                    alt={course.title}
                                    className="w-full h-[90px] sm:h-[120px] object-cover"
                                />

                                <div className="p-2 sm:p-3">
                                    <h2 className="font-semibold text-xs sm:text-[13px] leading-snug line-clamp-2 text-balance">
                                        {course.title}
                                    </h2>
                                    <p className="text-gray-600 text-[10px] sm:text-[12px] mt-1">{course.instructor}</p>

                                    <div className="flex items-center text-[10px] sm:text-[12px] mt-1">
                                        <span className="font-semibold mr-1">{course.rating}</span>
                                        <div className="flex text-xs sm:text-sm">{renderStars(course.rating)}</div>
                                        <span className="text-gray-500 ml-1 sm:ml-2 text-[9px] sm:text-[11px] hidden sm:inline">
                      ({course.reviews.toLocaleString()})
                    </span>
                                    </div>

                                    <p className="text-gray-500 text-[9px] sm:text-[11px] mt-1 hidden sm:block">
                                        {course.duration} • {course.level}
                                    </p>

                                    <div className="mt-2">
                                        <span className="font-bold text-xs sm:text-[14px]">₫{course.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => scroll("right")}
                    className="cursor-pointer hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
                >
                    <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>
            </div>

            {hoveredCourse &&
                window.innerWidth >= 768 &&
                ReactDOM.createPortal(
                    <div
                        className="fixed w-72 bg-white border rounded-lg shadow-lg p-4 z-[9999]"
                        style={{ top: popupPos.top, left: popupPos.left }}
                        onMouseEnter={handlePopupMouseEnter}
                        onMouseLeave={handlePopupMouseLeave}
                    >
                        <h3 className="font-bold text-base">{courses.find((c) => c.id === hoveredCourse).title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            Updated {courses.find((c) => c.id === hoveredCourse).updated} •{" "}
                            {courses.find((c) => c.id === hoveredCourse).level} •{" "}
                            {courses.find((c) => c.id === hoveredCourse).duration}
                        </p>
                        <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                            {courses.find((c) => c.id === hoveredCourse).description}
                        </p>
                        <ul className="text-sm text-gray-600 mt-2 space-y-1">
                            {courses
                                .find((c) => c.id === hoveredCourse)
                                .highlights.map((h, i) => (
                                    <li key={i} className="flex items-start gap-1">
                                        ✅ {h}
                                    </li>
                                ))}
                        </ul>
                        <button className="cursor-pointer w-full mt-4 bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700">
                            Add to cart
                        </button>
                    </div>,
                    document.body,
                )}
        </div>
    )
}
