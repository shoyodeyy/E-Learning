import { useState } from "react";
import api from "../api/axios";
import { CalendarDays, CalendarPlus } from "lucide-react";

export default function CalendarIntegration({ eventId, variant = "floating" }) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.get(`/events/${eventId}/calendar`);
      setOptions(res.data);
      setShowPopup(true);
    } catch (err) {
      console.error("Error fetching calendar links:", err);
      alert("Unable to create calendar link.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCalendar = () => {
    window.open(options.google_url, "_blank");
    setShowPopup(false);
  };

  const handleDownloadICS = () => {
    window.location.href = options.ics_url;
    setShowPopup(false);
  };

  const Trigger = () => {
    if (variant === "inline") {
      return (
        <button
          onClick={handleClick}
          disabled={loading}
          className="cursor-pointer flex items-center space-x-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl shadow-lg border border-gray-200 transition-all duration-200 disabled:opacity-50"
        >
          <CalendarPlus className="w-5 h-5" />
          <span>Add to Calendar</span>
        </button>
      );
    }
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center rounded-full shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 z-40"
      >
        <CalendarDays className="w-6 h-6" />
      </button>
    );
  };

  return (
    <>
      <Trigger />

      {/* Popup */}
      {showPopup && options && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowPopup(false)} // click overlay để đóng
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-80 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoogleCalendar}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
              >
                Google Calendar
              </button>
              <button
                onClick={handleDownloadICS}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
              >
                Download .ics
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
