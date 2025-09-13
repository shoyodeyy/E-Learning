import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function FavoriteEvents() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        api.get("/favorites")
            .then((res) => {
                setFavorites(res.data);
            })
            .catch((err) => {
                console.error("Error fetching favorites:", err);
                toast.error(" Failed to load favorites!");
            })
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) {
        return <div className="p-6 text-center">Loading favorites...</div>;
    }

    return (
        <div className="p-6 bg-gradient-to-br from-pink-50 via-white to-purple-50 min-h-screen">
            <h1 className="text-3xl font-extrabold mb-6 text-center text-purple-700">
                My <span className="text-pink-600">Favorite Events</span>
            </h1>

            {favorites.length === 0 ? (
                <div className="text-center text-gray-500">
                    You have no favorite events yet
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((fav) => {
                        const event = fav.event;
                        if (!event) return null;

                        return (
                            <div
                                key={event.event_id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col"
                            >
                                <div className="relative">
                                    <img
                                        src={
                                            event.bannerImage
                                                ? `http://localhost:8000${event.bannerImage}`
                                                : "/default-thumbnail.jpg"
                                        }
                                        alt={event.title}
                                        className="w-full h-52 object-cover rounded-t-xl"
                                    />
                                    <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                                        {event.category}
                                    </span>
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                                        {event.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                                        {event.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-1">
                                        📅{" "}
                                        {new Date(event.start_at).toLocaleDateString()} –{" "}
                                        {event.duration_minutes} minutes
                                    </p>
                                    <p className="text-xs text-gray-500 mb-3">
                                        📍 {event.venue}
                                    </p>

                                    <Link
                                        to={`/event/${event.event_id}`}
                                        className="mt-auto w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow hover:from-pink-600 hover:to-purple-700 text-center"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
