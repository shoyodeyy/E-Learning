import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header.jsx";
import { Search } from "lucide-react";
import {toast} from "react-toastify";

export default function Gallery() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState({});

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({});

    const [department, setDepartment] = useState("all");
    const [date, setDate] = useState("all");

    const categories = [
        "Cultural",
        "Technical Fests",
        "Sports Meets",
        "Annual Day Functions",
        "Workshops and Seminars",
        "Intercollegiate Competitions",
    ];

    useEffect(() => {
        setLoading(true);
        api.get("/public-events", {
            params: { search, category, department, date, page },
        })
            .then((res) => {
                const data = res.data.data || [];
                setEvents(data);
                setMeta({
                    current_page: res.data.current_page,
                    last_page: res.data.last_page,
                });
            })
            .catch((err) => console.error("Error fetching events:", err))
            .finally(() => setLoading(false));
    }, [search, category, department, date, page]);

    const toggleSelect = (eventId) => {
        setSelected((prev) => ({
            ...prev,
            [eventId]: !prev[eventId],
        }));
    };

    const saveFavorites = () => {
        const selectedIds = Object.keys(selected).filter((id) => selected[id]);

        if (selectedIds.length === 0) {
            toast.error("⚠️ You haven’t selected any events!");
            return;
        }

        api.post("/favorites", { events: selectedIds })
            .then(() => {
                toast.success("✅ Favorite events saved successfully!");
                // Optionally reload favorites từ backend
                api.get("/favorites").then((res) => {
                    const favIds = res.data.map(f => f.event_id);
                    const favMap = {};
                    favIds.forEach(id => favMap[id] = true);
                    setSelected(favMap);
                });
            })
            .catch((err) => {
                console.error("Error saving favorites:", err);
                toast.error("❌ Failed to save favorites!");
            });
    };

    const onResetFilters = () => {
        setSearch("");
        setCategory("all");
        setDepartment("all");
        setDate("all");
        setPage(1);
    };

    if (loading) {
        return <div className="p-6 text-center">Loading events...</div>;
    }

    return (
        <div className="p-6 bg-gradient-to-br from-pink-50 via-white to-purple-50 min-h-screen">
            <Header />

            <h1 className="text-3xl font-extrabold mb-6 text-center text-purple-700">
                Discover Amazing <span className="text-pink-600">Events</span>
            </h1>

            {/* 🔍 Search + Filters */}
            <div className="shadow-lg border border-purple-100 rounded-xl p-6 mb-8 bg-gradient-to-br from-pink-50 via-white to-purple-50">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
                    {/* Search Input */}
                    <div className="flex-1 w-full lg:max-w-md">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <div className="size-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Search className="text-purple-600 size-5" />
                                </div>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by event title or keyword..."
                                value={search}
                                onChange={(e) => {
                                    setPage(1);
                                    setSearch(e.target.value);
                                }}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-purple-200 rounded-xl
                                    focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-md
                                    transition-all duration-200 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Department + Date + Reset */}
                    <div className="flex flex-wrap gap-3 items-center">


                        <button
                            onClick={onResetFilters}
                            className="cursor-pointer px-5 py-2 bg-white hover:bg-gray-50 text-purple-600 hover:text-purple-700 font-semibold rounded-lg shadow-sm border border-purple-200"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* Categories nằm ngang */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                    {categories.map((c) => (
                        <button
                            key={c}
                            onClick={() => {
                                setPage(1);
                                setCategory(c);
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition ${
                                category === c
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                    : "bg-white border border-purple-200 text-gray-700 hover:bg-purple-50"
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Event Cards */}
            {events.length === 0 ? (
                <div className="text-center text-gray-500">
                    No approved events available
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div
                            key={event.event_id}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col"
                        >
                            <div className="relative">
                                <img
                                    src={`http://localhost:8000${event.bannerImage}` || "/default-thumbnail.jpg"}
                                    alt={event.title}
                                    className="w-full h-52 object-cover rounded-t-xl"
                                />
                                <span className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                                    {event.maxParticipants} Slots Available
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
                                    📅 {new Date(event.start_at).toLocaleDateString()} –{" "}
                                    {event.duration_minutes} minutes
                                </p>
                                <p className="text-xs text-gray-500 mb-3">
                                    📍 {event.venue}
                                </p>

                                <button className="mt-auto w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow hover:from-pink-600 hover:to-purple-700">
                                    View Details
                                </button>

                                {user?.role === "participant" && (
                                    <label className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={selected[event.event_id] || false}
                                            onChange={() => toggleSelect(event.event_id)}
                                            className="w-4 h-4 text-purple-600"
                                        />
                                        Select event
                                    </label>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {meta.last_page > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded-full bg-white shadow hover:bg-gray-100 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                        Page {meta.current_page} of {meta.last_page}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, meta.last_page))}
                        disabled={page === meta.last_page}
                        className="px-4 py-2 border rounded-full bg-white shadow hover:bg-gray-100 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Save Favorites */}
            {user?.role === "participant" && events.length > 0 && (
                <div className="mt-10 text-center">
                    <button
                        onClick={saveFavorites}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow hover:from-purple-700 hover:to-pink-700"
                    >
                        Save Selected
                    </button>
                </div>
            )}
        </div>
    );
}
