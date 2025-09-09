import { useState } from "react";

export default function Feedback() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ rating, comment });
        alert("Thanks for your feedback!");
        setRating(0);
        setComment("");
    };

    const renderStars = () => {
        return Array.from({ length: 5 }).map((_, i) => (
            <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHover(i + 1)}
                onMouseLeave={() => setHover(null)}
                className="text-3xl focus:outline-none"
            >
                <span className={`${i < (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
            </button>
        ));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Leave a rating</h1>
            <p className="text-gray-600 mb-6">
                Share your experience. Your feedback helps us improve the course and helps other learners.
            </p>

            {/* Rating stars */}
            <div className="flex items-center space-x-2 mb-4">{renderStars()}</div>

            {/* Feedback form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="5"
                    placeholder="What did you like or dislike? Would you recommend this course?"
                    className="w-full border rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <button
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-700"
                >
                    Submit Feedback
                </button>
            </form>
        </div>
    );
}
