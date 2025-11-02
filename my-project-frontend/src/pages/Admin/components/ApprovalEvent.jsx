import React, {useState, useEffect} from "react";
import {useSearchParams, useParams} from "react-router-dom";
import api from "../../../api/axios.js";

const ApprovalEvent = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rejectModal, setRejectModal] = useState({show: false, eventId: null});
    const [rejectNotes, setRejectNotes] = useState("");

    const {eventId} = useParams();
    const [searchParams] = useSearchParams();
    const eventIdFromQuery = searchParams.get("event_id") || null;

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await api.get("/events/pending");
            setEvents(res.data.data || []);
        } catch (err) {
            console.error("Failed to load events", err);
        }
        setLoading(false);
    };

    const handleApprove = async (id) => {
        try {
            const res = await api.post(`/events/${id}/approve`, {notes: ''});
            fetchEvents();
        } catch (err) {
            console.error("❌ Approve failed:", err.response?.data || err.message);
            alert("Approve failed: " + (err.response?.data?.message || err.message));
        }
    };

    const handleReject = async () => {
        if (!rejectNotes.trim()) {
            alert("Rejection reason is required");
            return;
        }
        try {
            const res = await api.post(`/events/${rejectModal.eventId}/reject`, {notes: rejectNotes});
            setRejectModal({show: false, eventId: null});
            setRejectNotes("");
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
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
                        {filteredEvents.map((event, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col"
                            >
                                {/* Banner Image */}
                                {event.bannerImage && (
                                    <img
                                        src={`http://localhost:8000${event.bannerImage}`}
                                        alt={event.title}
                                        className="w-full h-40 object-cover"
                                    />
                                )}

                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Organizer: {event.organizer.name || "Unknown"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Submitted: {formatDate(event.created_at)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Event Date: {formatDate(event.start_at)}
                                    </p>

                                    <span
                                          className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${
                                              event.status.includes("pending")
                                                  ? "bg-yellow-400"
                                                  : event.status === "approved"
                                                      ? "bg-green-400"
                                                      : "bg-red-400"
                                          }`}
                                        >
                                          {event.status}
                                        </span>

                                    {/* Buttons */}
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={() => handleApprove(event.event_id)}
                                            className="cursor-pointer flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => setRejectModal({ show: true, eventId: event.event_id })}
                                            className="cursor-pointer flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg"
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

            {/* Reject Modal */}
            {rejectModal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Event</h3>
                        <p className="text-gray-600 mb-4">Please provide a reason for rejecting this event:</p>

                        <textarea
                            value={rejectNotes}
                            onChange={(e) => setRejectNotes(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full border border-gray-300 rounded-xl p-4 min-h-[120px] text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
                            rows={4}
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setRejectModal({ show: false, eventId: null });
                                    setRejectNotes("");
                                }}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={!rejectNotes.trim()}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovalEvent;
