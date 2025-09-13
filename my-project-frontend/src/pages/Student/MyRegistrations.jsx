import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";

// Tạm thời dùng dữ liệu mẫu; đổi sang false khi dùng dữ liệu thật
const USE_MOCK = true;

const SAMPLE_REGISTRATIONS = [
  {
    id: 1,
    eventId: 1,
    eventName: "Future Tech Summit 2025",
    date: "2025-09-15",
    location: "Convention Center, San Francisco",
    registeredOn: "2025-09-01",
    rawStatus: "confirmed",
  },
  {
    id: 2,
    eventId: 2,
    eventName: "Sustainable Cities Conference",
    date: "2025-10-22",
    location: "Eco Hall, New York",
    registeredOn: "2025-09-05",
    rawStatus: "confirmed",
  },
  {
    id: 3,
    eventId: 3,
    eventName: "Innovation Hackathon Challenge",
    date: "2025-11-05",
    location: "Tech Hub, Austin",
    registeredOn: "2025-09-10",
    rawStatus: "waitlist",
  },
  {
    id: 4,
    eventId: 4,
    eventName: "Digital Marketing Mastery Workshop",
    date: "2025-09-30",
    location: "Online Webinar",
    registeredOn: "2025-09-02",
    rawStatus: "cancelled",
  },
  {
    id: 5,
    eventId: 5,
    eventName: "Global Health Forum",
    date: "2025-12-01",
    location: "World Congress Centre, Geneva",
    registeredOn: "2025-09-07",
    rawStatus: "confirmed",
  },
];
const statusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "confirmed":
      return "bg-green-500";
    case "waitlist":
    case "waitlisted":
      return "bg-yellow-500";
    case "cancelled":
    default:
      return "bg-gray-500";
  }
};

const MyRegistrations = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/registrations");
      const list = (res.data || []).map((r, idx) => ({
        id: r.registration_id ?? idx,
        eventId: r.event?.event_id,
        eventName: r.event?.title,
        date: r.event?.start_at?.substring(0, 10),
        location: r.event?.venue,
        registeredOn: (r.registered_on || "").substring(0, 10),
        status: (r.status || "").charAt(0).toUpperCase() + (r.status || "").slice(1),
        rawStatus: (r.status || "").toLowerCase(),
        statusColor: statusColor(r.status),
      }));
      setItems(list);
    } catch (e) {
      toast.error("Không tải được danh sách đăng ký");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (USE_MOCK) {
      const list = SAMPLE_REGISTRATIONS.map((r) => ({
        id: r.id,
        eventId: r.eventId,
        eventName: r.eventName,
        date: r.date,
        location: r.location,
        registeredOn: r.registeredOn,
        status: r.rawStatus === "waitlist" ? "Waitlisted" : r.rawStatus.charAt(0).toUpperCase() + r.rawStatus.slice(1),
        rawStatus: r.rawStatus,
        statusColor: statusColor(r.rawStatus),
      }));
      setItems(list);
      setLoading(false);
    } else {
      fetchData();
    }
  }, []);

  const cancelRegistration = async (eventId, id) => {
    try {
      const res = await api.post(`/events/${eventId}/cancel`);
      toast.success(res.data?.message || "Đã hủy đăng ký");
      setItems((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: "Cancelled", rawStatus: "cancelled", statusColor: "bg-gray-500" }
            : r
        )
      );
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Hủy đăng ký thất bại";
      toast.error(msg);
    }
  };

  const rejoin = async (eventId, id) => {
    try {
      const res = await api.post(`/events/${eventId}/register`);
      toast.success(res.data?.message || "Đăng ký lại thành công");
      const newStatus = (res.data?.status || "confirmed").toLowerCase();
      setItems((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: newStatus === "waitlist" ? "Waitlisted" : "Confirmed",
                rawStatus: newStatus,
                statusColor: statusColor(newStatus),
              }
            : r
        )
      );
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Đăng ký lại thất bại";
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          My Event Registrations
        </h2>
        <p className="text-gray-600 mt-1">Manage your event registrations and track your participation</p>
      </div>

      {loading ? (
        <div className="p-6">Đang tải danh sách...</div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="pl-6 pr-3 py-4 text-center text-xs font-semibold text-purple-700 uppercase tracking-wider">
                    Event Name
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-purple-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-purple-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-purple-700 uppercase tracking-wider">
                    Registered On
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-purple-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-4 text-center text-xs font-semibold text-purple-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {items.map((registration) => (
                  <tr
                    key={registration.id}
                    className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 text-center"
                  >
                    <td className="pl-6 pr-3 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        <Link to={`/event/${registration.eventId}`} className="hover:underline">
                          {registration.eventName}
                        </Link>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-700">{registration.date}</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-700">{registration.location}</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-700">{registration.registeredOn}</div>
                    </td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full text-white ${registration.statusColor}`}>
                        {registration.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm font-medium flex gap-2 justify-center">
                      <button className="cursor-pointer text-purple-600 hover:text-white bg-purple-100 hover:bg-purple-600 px-3 py-2 rounded-lg transition-all duration-300">
                        View Details
                      </button>
                      {registration.rawStatus === "cancelled" ? (
                        <button
                          onClick={() => rejoin(registration.eventId, registration.id)}
                          className="cursor-pointer text-green-600 hover:text-white bg-green-100 hover:bg-green-600 px-3 py-2 rounded-lg transition-all duration-300"
                        >
                          Re-Join
                        </button>
                      ) : (
                        <button
                          onClick={() => cancelRegistration(registration.eventId, registration.id)}
                          className="cursor-pointer text-red-600 hover:text-white bg-red-100 hover:bg-red-600 px-3 py-2 rounded-lg transition-all duration-300"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden p-4 space-y-4">
            {items.map((registration) => (
              <div
                key={registration.id}
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">
                    <Link to={`/event/${registration.eventId}`} className="hover:underline">
                      {registration.eventName}
                    </Link>
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${registration.statusColor} shrink-0`}>
                    {registration.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="font-medium text-purple-700 w-20 shrink-0">Date:</span>
                    <span>{registration.date}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium text-purple-700 w-20 shrink-0">Location:</span>
                    <span className="leading-tight">{registration.location}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-purple-700 w-20 shrink-0">Registered:</span>
                    <span>{registration.registeredOn}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="cursor-pointer flex-1 text-purple-600 hover:text-white bg-purple-100 hover:bg-purple-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                    View Details
                  </button>
                  {registration.rawStatus === "cancelled" ? (
                    <button
                      onClick={() => rejoin(registration.eventId, registration.id)}
                      className="cursor-pointer flex-1 text-green-600 hover:text-white bg-green-100 hover:bg-green-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                    >
                      Re-Join
                    </button>
                  ) : (
                    <button
                      onClick={() => cancelRegistration(registration.eventId, registration.id)}
                      className="cursor-pointer flex-1 text-red-600 hover:text-white bg-red-100 hover:bg-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Main My Registrations Component
export default function MyRegistrationsPage() {
  return <MyRegistrations />;
}
