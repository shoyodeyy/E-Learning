import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
    {
        id: 1,
        src: "/images/qc1.jpg",
        title: "Learning that gets you",
        subtitle: "Skills for your present (and your future). Get started with us.",
        button: "Explore Now",
    },
    {
        id: 2,
        src: "/images/qc2.jpg",
        title: "Unlock the power of AI",
        subtitle: "Master AI and Data Science to future-proof your career.",
        button: "Start Learning",
    },
    {
        id: 3,
        src: "/images/qc3.jpg",
        title: "Grow your career",
        subtitle: "Get certified and stand out in today’s job market.",
        button: "Browse Courses",
    },
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const timeoutRef = useRef(null);

    // Auto play every 5s
    useEffect(() => {
        if (!isHovered) {
            timeoutRef.current = setTimeout(() => {
                setCurrent((prev) => (prev + 1) % slides.length);
            }, 5000);
        }
        return () => clearTimeout(timeoutRef.current);
    }, [current, isHovered]);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    return (
        <div
            className="relative w-full h-[400px] overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                        index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                >
                    {/* Background image */}
                    <img
                        src={slide.src}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                    />

                    {/* Content overlay like Udemy */}
                    <div className="absolute inset-0 flex items-center px-8 md:px-16">
                        <div className="bg-white/95 max-w-lg p-6 md:p-8 rounded-lg shadow-lg">
                            <h1 className="text-3xl md:text-4xl font-bold mb-3">
                                {slide.title}
                            </h1>
                            <p className="text-gray-700 text-lg mb-5">{slide.subtitle}</p>
                            <button className="px-5 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition">
                                {slide.button}
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Prev & Next buttons */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 -translate-y-1/2 z-20 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
            >
                <ChevronLeft size={28} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 -translate-y-1/2 z-20 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
            >
                <ChevronRight size={28} />
            </button>

        </div>
    );
}
