import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import CourseCard from "../Student/Components-student/CourseCard.jsx";
import { searchCourses } from "../../api/courseApi.js";
import { Filter, ChevronDown, X, Code, Users, Edit3, HelpCircle } from "lucide-react";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

// Reusable DropdownFilter (popover Udemy-style)
function DropdownFilter({ label, options, value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-1 px-3 py-2 border rounded text-sm hover:bg-gray-100"
            >
                <span>{options.find((o) => o.value === value)?.label || label}</span>
                <ChevronDown size={16} />
            </button>

            {open && (
                <div className="absolute left-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-lg z-50">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                value === opt.value ? "bg-gray-200 font-medium" : ""
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// DrawerFilter (sidebar all filters)
function DrawerFilter({ filters, setFilters, onClose }) {
    const ratingOptions = [
        { label: "4.5 & up", value: "4.5" },
        { label: "4.0 & up", value: "4.0" },
        { label: "3.5 & up", value: "3.5" },
        { label: "3.0 & up", value: "3.0" },
    ];

    const languageOptions = [
        { label: "English", value: "english" },
        { label: "Spanish", value: "spanish" },
        { label: "French", value: "french" },
    ];

    const levelOptions = [
        { label: "All Levels", value: "" },
        { label: "Beginner", value: "beginner" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Expert", value: "expert" },
    ];

    const videoDurationOptions = [
        { label: "0-1 Hour", value: "extraShort" },
        { label: "1-3 Hours", value: "short" },
        { label: "3-6 Hours", value: "medium" },
        { label: "6-17 Hours", value: "long" },
        { label: "17+ Hours", value: "extraLong" },
    ];

    const topicOptions = [
        { label: "English Language", value: "english-language" },
        { label: "Python", value: "python" },
        { label: "Statistics", value: "statistics" },
        { label: "Sales Skills", value: "sales-skills" },
        { label: "Personal Development", value: "personal-development" },
    ];

    const priceOptions = [
        { label: "Paid", value: "paid" },
        { label: "Free", value: "free" },
    ];

    const toggleArrayValue = (key, value) => {
        setFilters((prev) => {
            const arr = prev[key] || [];
            return arr.includes(value)
                ? { ...prev, [key]: arr.filter((v) => v !== value) }
                : { ...prev, [key]: [...arr, value] };
        });
    };

    const setSingleValue = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-start">
            <div className="bg-white w-80 h-full p-6 overflow-y-auto relative">
                <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                >
                    <X size={24} />
                </button>
                <h3 className="text-xl font-semibold mb-4">All Filters</h3>

                {/* Ratings */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Ratings</h4>
                    {ratingOptions.map(({ label, value }) => (
                        <label key={value} className="flex items-center gap-2 mb-1 cursor-pointer">
                            <input
                                type="radio"
                                name="rating"
                                value={value}
                                checked={filters.rating === value}
                                onChange={() => setSingleValue("rating", value)}
                            />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>

                {/* Languages */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Languages</h4>
                    {languageOptions.map(({ label, value }) => (
                        <label key={value} className="flex items-center gap-2 mb-1 cursor-pointer">
                            <input
                                type="checkbox"
                                value={value}
                                checked={filters.language.includes(value)}
                                onChange={() => toggleArrayValue("language", value)}
                            />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>

                {/* Video Duration */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Video Duration</h4>
                    {videoDurationOptions.map(({ label, value }) => (
                        <label key={value} className="flex items-center gap-2 mb-1 cursor-pointer">
                            <input
                                type="checkbox"
                                value={value}
                                checked={filters.videoDuration.includes(value)}
                                onChange={() => toggleArrayValue("videoDuration", value)}
                            />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>

                {/* Topics */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Topics</h4>
                    {topicOptions.map(({ label, value }) => (
                        <label key={value} className="flex items-center gap-2 mb-1 cursor-pointer">
                            <input
                                type="checkbox"
                                value={value}
                                checked={filters.topics.includes(value)}
                                onChange={() => toggleArrayValue("topics", value)}
                            />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>

                {/* Level */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Level</h4>
                    {levelOptions.map(({ label, value }) => (
                        <label key={value} className="flex items-center gap-2 mb-1 cursor-pointer">
                            <input
                                type="radio"
                                name="level"
                                value={value}
                                checked={filters.level === value}
                                onChange={() => setSingleValue("level", value)}
                            />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>

                {/* Price */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Price</h4>
                    {priceOptions.map(({ label, value }) => (
                        <label key={value} className="flex items-center gap-2 mb-1 cursor-pointer">
                            <input
                                type="checkbox"
                                value={value}
                                checked={filters.price.includes(value)}
                                onChange={() => toggleArrayValue("price", value)}
                            />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>

                <button
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                    onClick={onClose}
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}

export default function SearchResultsPage() {
    const query = useQuery().get("query") || "";

    const [filters, setFilters] = useState({
        sortBy: "relevance",
        language: [],
        rating: "",
        level: "",
        courseTypes: [],
        videoDuration: [],
        topics: [],
        price: [],
    });

    const [results, setResults] = useState([]);
    const [showAllFilters, setShowAllFilters] = useState(false);

    const toggleCourseType = (type) => {
        setFilters((prev) => {
            const exists = prev.courseTypes.includes(type);
            return {
                ...prev,
                courseTypes: exists
                    ? prev.courseTypes.filter((t) => t !== type)
                    : [...prev.courseTypes, type],
            };
        });
    };

    const handleChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const apiFilters = {
            sortBy: filters.sortBy,
            rating: filters.rating,
            level: filters.level,
            language: filters.language.join(","),
            courseTypes: filters.courseTypes.join(","),
            videoDuration: filters.videoDuration.join(","),
            topics: filters.topics.join(","),
            price: filters.price.join(","),
        };

        searchCourses(query, apiFilters)
            .then(setResults)
            .catch(console.error);
    }, [query, filters]);

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Search results for: "{query}"</h2>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-3 mb-6 items-center">
                <button
                    onClick={() => setShowAllFilters(true)}
                    className="flex items-center gap-1 px-3 py-2 border rounded text-sm font-medium hover:bg-gray-100"
                >
                    <Filter size={16} />
                    <span>All filters</span>
                </button>

                {/* Sort By */}


                {/* Course Types quick toggle */}
                {[
                    { label: "Quizzes", value: "quizzes", icon: HelpCircle },
                    { label: "Coding Exercises", value: "coding", icon: Code },
                    { label: "Practice Tests", value: "practice-tests", icon: Edit3 },
                    { label: "Role Plays", value: "role-plays", icon: Users },
                ].map(({ label, value, icon: Icon }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => toggleCourseType(value)}
                        aria-pressed={filters.courseTypes.includes(value)}
                        className={`flex items-center gap-1 text-sm px-3 py-2 border rounded transition ${
                            filters.courseTypes.includes(value)
                                ? "bg-purple-600 text-white border-purple-600"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        <Icon size={14} />
                        {label}
                    </button>
                ))}

                {/* Quick Dropdowns */}
                <DropdownFilter
                    label="Language"
                    value={filters.language[0] || ""}
                    onChange={(val) => setFilters((prev) => ({ ...prev, language: val ? [val] : [] }))}
                    options={[
                        { label: "All Languages", value: "" },
                        { label: "English", value: "english" },
                        { label: "Spanish", value: "spanish" },
                        { label: "French", value: "french" },
                    ]}
                />

                <DropdownFilter
                    label="Ratings"
                    value={filters.rating}
                    onChange={(val) => handleChange("rating", val)}
                    options={[
                        { label: "All ratings", value: "" },
                        { label: "4.5 & up", value: "4.5" },
                        { label: "4.0 & up", value: "4.0" },
                        { label: "3.5 & up", value: "3.5" },
                        { label: "3.0 & up", value: "3.0" },
                    ]}
                />

                <DropdownFilter
                    label="Level"
                    value={filters.level}
                    onChange={(val) => handleChange("level", val)}
                    options={[
                        { label: "All Levels", value: "" },
                        { label: "Beginner", value: "beginner" },
                        { label: "Intermediate", value: "intermediate" },
                        { label: "Expert", value: "expert" },
                    ]}
                />
                <DropdownFilter
                    label="Sort by"
                    value={filters.sortBy}
                    onChange={(val) => handleChange("sortBy", val)}
                    options={[
                        { label: "Most Relevant", value: "relevance" },
                        { label: "Highest Rated", value: "highest-rated" },
                        { label: "Most Reviewed", value: "most-reviewed" },
                        { label: "Newest", value: "newest" },
                    ]}
                />
            </div>

            {/* Results */}
            {results.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            ) : (
                <p>No results found.</p>
            )}

            {/* Drawer All Filters */}
            {showAllFilters && (
                <DrawerFilter
                    filters={filters}
                    setFilters={setFilters}
                    onClose={() => setShowAllFilters(false)}
                />
            )}
        </div>
    );
}
