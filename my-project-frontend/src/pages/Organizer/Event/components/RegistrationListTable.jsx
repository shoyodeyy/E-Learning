import { useState } from "react";
import { Check, X, Mail, Calendar, MoreHorizontal, User } from "lucide-react";

const RegistrationListTable = ({ registrations, onAttendanceToggle, loading }) => {
    const [expandedRow, setExpandedRow] = useState(null);

    const getStatusBadge = (status) => {
        const statusStyles = {
            confirmed: "bg-green-100 text-green-800",
            waitlist: "bg-yellow-100 text-yellow-800",
            cancelled: "bg-red-100 text-red-800",
        };

        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>{status}</span>;
    };

    const getAttendanceToggle = (registration) => {
        const isAttended = registration.attendance_status;

        return (
            <button
                onClick={() => onAttendanceToggle(registration.registration_id, isAttended)}
                className={`cursor-pointer flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                    isAttended ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
                title={isAttended ? "Mark as not attended" : "Mark as attended"}
            >
                {isAttended ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </button>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading registrations...</p>
            </div>
        );
    }

    if (registrations.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations found</h3>
                <p className="text-gray-600">No registrations match your current filters.</p>
            </div>
        );
    }

    console.log(registrations)
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Info</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {registrations.map((registration) => (
                        <tr key={registration.registration_id} className="hover:bg-gray-50 transition-colors">
                            {/* Participant Info */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <img
                                        src={registration.user.avatar_url !== null ? `http://localhost:8000${registration.user.avatar_url}` :
                                            `https://ui-avatars.com/api/?name=${registration.user.name}&background=8b5cf6&color=ffffff`
                                        }
                                        alt={registration.user.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{registration.user.name}</div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <Mail className="w-3 h-3 mr-1" />
                                            {registration.user.email}
                                        </div>
                                    </div>
                                </div>
                            </td>

                            {/* Registration Info */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 flex items-center mb-1">
                                    <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                                    {formatDate(registration.registered_on)}
                                </div>
                                {registration.seats && registration.seats.length > 0 && (
                                    <div className="text-xs text-gray-500">
                                        Seats: {registration.seats.map((seat) => seat.seat_number).join(", ")}
                                    </div>
                                )}
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(registration.status)}</td>

                            {/* Attendance */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                {registration.status === "confirmed" ? (
                                    <div className="flex items-center space-x-2">
                                        {getAttendanceToggle(registration)}
                                        <span className={`text-sm ${registration.attendance_status ? "text-green-600" : "text-gray-500"}`}>
                                            {registration.attendance_status ? "Attended" : "Not attended"}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-400">N/A</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RegistrationListTable;
