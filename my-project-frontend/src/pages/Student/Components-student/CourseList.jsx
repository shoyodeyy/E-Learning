// CourseList.jsx
import React from "react";
import CourseCard from "./CourseCard.jsx";

export default function CourseList() {
    const mockCourses = [
        {
            id: 1,
            thumbnail: "https://img-c.udemycdn.com/course/240x135/567828_67d0.jpg",
            title: "The Complete JavaScript Course 2025: From Zero to Expert!",
            instructor: "Jonas Schmedtmann",
            rating: 4.7,
            reviews: 152345,
            price: 19.99,
            isBestseller: true,
            isNew: false,
        },
        {
            id: 2,
            thumbnail: "https://img-c.udemycdn.com/course/240x135/1565838_e54e_18.jpg",
            title: "React - The Complete Guide (incl. Hooks, React Router, Redux)",
            instructor: "Maximilian Schwarzmüller",
            rating: 4.8,
            reviews: 98212,
            price: 17.99,
            isBestseller: true,
            isNew: true,
        },
        {
            id: 3,
            thumbnail: "https://img-c.udemycdn.com/course/240x135/851712_fc61_6.jpg",
            title: "Python for Data Science and Machine Learning Bootcamp",
            instructor: "Jose Portilla",
            rating: 4.6,
            reviews: 76543,
            price: 0, // Free
            isBestseller: false,
            isNew: true,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {mockCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
}
