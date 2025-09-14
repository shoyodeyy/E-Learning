import { useState } from "react";
import api from "../api/axios";
import { CalendarDays, CalendarPlus, Download, X } from "lucide-react";

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

  const handleDownloadICS = async () => {
    try {
      // Use axios instance so Authorization header is included
      const res = await api.get(`/events/${eventId}/calendar/ics`, { responseType: 'blob' });

      // Try to extract filename from headers; fallback to default
      const dispo = res.headers?.['content-disposition'] || '';
      const match = dispo.match(/filename=([^;]+)/i);
      const filenameFromHeader = match ? match[1].replace(/\"/g, '').trim() : '';
      const preferred = options?.filename || options?.title || '';
      const filename = (preferred ? String(preferred).replace(/\s+$/, '') : filenameFromHeader) || `event-${eventId}.ics`;

      const blob = new Blob([res.data], { type: 'text/calendar;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download ICS', e);
      alert('Unable to download .ics file. Please try again.');
    } finally {
      setShowPopup(false);
    }
  };

  const Trigger = () => {
    if (variant === "inline") {
      return (
        <button
          onClick={handleClick}
          disabled={loading}
          className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-medium shadow-sm border border-gray-200 \
                     bg-gradient-to-r from-gray-50 to-gray-100 \
                     hover:from-fuchsia-50 hover:to-pink-50 hover:border-fuchsia-300 \
                     text-gray-700 transition-all duration-200 disabled:opacity-50"
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
          onClick={() => setShowPopup(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-80 shadow-2xl relative border border-gray-100"
          >
            {/* Close button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              Add to Calendar
            </h2>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoogleCalendar}
                className="cursor-pointer flex items-center gap-3 w-full py-3 px-4 rounded-xl font-medium shadow-sm border border-gray-200 \
                           bg-gradient-to-r from-gray-50 to-gray-100 \
                           hover:from-fuchsia-50 hover:to-pink-50 hover:border-fuchsia-300 \
                           transition-all duration-200 text-left"
              >
                <CalendarDays className="text-blue-600 w-5 h-5" />
                <span>Google Calendar</span>
              </button>

              <button
                onClick={handleDownloadICS}
                className="cursor-pointer flex items-center gap-3 w-full py-3 px-4 rounded-xl font-medium shadow-sm border border-gray-200 \
                           bg-gradient-to-r from-gray-50 to-gray-100 \
                           hover:from-fuchsia-50 hover:to-pink-50 hover:border-fuchsia-300 \
                           transition-all duration-200 text-left"
              >
                <Download className="text-gray-600 w-5 h-5" />
                <span>Download .ics</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
