// SearchResultsPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CourseCard from "../../components/CourseCard.jsx";
import { searchCourses } from "../../api/courseApi.js"; // gọi API backend search

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function SearchResultsPage() {
    const query = useQuery().get("query");
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!query) return;
        searchCourses(query).then(setResults).catch(console.error);
    }, [query]);

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Search results for: "{query}"</h2>
            {results.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
}
