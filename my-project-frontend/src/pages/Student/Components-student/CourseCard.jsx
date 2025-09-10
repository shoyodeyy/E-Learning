// CourseCard.jsx
import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import CourseList from "../Components-student/CourseList.jsx";

export default function CourseCard({ course }) {
    // course = {
    //   id, thumbnail, title, instructor, rating, reviews, price, isBestseller, isNew
    // }

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
            else if (rating + 0.5 >= i) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 inline" />);
            else stars.push(<FaRegStar key={i} className="text-yellow-400 inline" />);
        }
        return stars;
    };

    return (
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 duration-200 cursor-pointer">
        <div className="relative">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                />
                {course.isBestseller && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded font-bold">
            Bestseller
          </span>
                )}
                {course.isNew && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">
            New
          </span>
                )}
            </div>

            <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {course.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{course.instructor}</p>

                <div className="flex items-center mt-2 text-xs text-gray-700">
                    <div className="flex items-center">{renderStars(course.rating)}</div>
                    <span className="ml-2">({course.reviews})</span>
                </div>

                <div className="mt-2 text-sm font-semibold text-gray-900">
                    {course.price > 0 ? `$${course.price}` : "Free"}
                </div>
            </div>
        </div>
    );
}
