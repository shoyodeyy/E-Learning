import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import api from "../../../api/axios.js";

const ApprovalEvent = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const { eventId } = useParams();
    const [searchParams] = useSearchParams();
    const eventIdFromQuery = searchParams.get("event_id") || null;

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await api.get("/events/pending");
            console.log("Event Pending: ", res.data.data);
            setEvents(res.data.data || []);
        } catch (err) {
            console.error("Failed to load events", err);
        }
        setLoading(false);
    };

    const handleApprove = async (id) => {
        try {
            const res = await api.post(`/events/${id}/approve`);
            console.log("✅ Approve success:", res.data.data);
            fetchEvents();
        } catch (err) {
            console.error("❌ Approve failed:", err.response?.data || err.message);
            alert("Approve failed: " + (err.response?.data?.message || err.message));
        }
    };

    const handleReject = async (id) => {
        try {
            const res = await api.post(`/events/${id}/reject`);
            console.log("✅ Reject success:", res.data.data);
            fetchEvents();
        } catch (err) {
            console.error("❌ Reject failed:", err.response?.data || err.message);
            alert("Reject failed: " + (err.response?.data?.message || err.message));
        }
    };

    const targetEventId = eventId || eventIdFromQuery;
    let filteredEvents = [...events];
    if (targetEventId) {
        filteredEvents = filteredEvents.filter((e) => String(e.eventId) === String(targetEventId));
    }
    console.log("event", filteredEvents)
    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Event Approvals</h1>
                    <p className="text-gray-600">Review and manage submitted events awaiting your approval</p>
                </div>
            </div>

            <div className="p-6">
                {loading ? (
                    <p className="text-center text-gray-500">Loading events...</p>
                ) : filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <div
                                key={event.eventId}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col"
                            >
                                {/* Banner Image */}
                                {event.bannerImage && (
                                    <img
                                        src={event.bannerImage}
                                        alt={event.title}
                                        className="w-full h-40 object-cover"
                                    />
                                )}

                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Organizer: {event.organizerId?.userName || "Unknown"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Submitted: {event.created_at}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Event Date: {event.start_at}
                                    </p>

                                    <span
                                        className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${
                                            event.status.includes("pending")
                                                ? "bg-yellow-100 text-yellow-700"
                                                : event.status === "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {event.status}
                                    </span>

                                    {/* Buttons */}
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={() => handleApprove(event.eventId)}
                                            className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(event.eventId)}
                                            className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No events found.</p>
                )}
            </div>
        </div>
    );
};

export default ApprovalEvent;
