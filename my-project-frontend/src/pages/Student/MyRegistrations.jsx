const registrations = [
    {
        id: 1,
        eventName: "Future Tech Summit 2024",
        date: "2024-12-15",
        location: "Convention Center, San Francisco",
        registeredOn: "2024-05-01",
        status: "Confirmed",
        statusColor: "bg-green-500",
    },
    {
        id: 2,
        eventName: "Sustainable Cities Conference",
        date: "2024-09-22",
        location: "Eco Hall, New York",
        registeredOn: "2024-06-10",
        status: "Confirmed",
        statusColor: "bg-green-500",
    },
    {
        id: 3,
        eventName: "Innovation Hackathon Challenge",
        date: "2024-10-05",
        location: "Tech Hub, Austin",
        registeredOn: "2024-07-01",
        status: "Waitlisted",
        statusColor: "bg-yellow-500",
    },
    {
        id: 4,
        eventName: "Digital Marketing Mastery Workshop",
        date: "2024-11-10",
        location: "Online Webinar",
        registeredOn: "2024-03-15",
        status: "Completed",
        statusColor: "bg-green-500",
    },
    {
        id: 5,
        eventName: "Global Health Forum",
        date: "2024-12-01",
        location: "World Congress Centre, Geneva",
        registeredOn: "2024-08-01",
        status: "Confirmed",
        statusColor: "bg-green-500",
    },
];

const MyRegistrations = () => {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    My Event Registrations
                </h2>
                <p className="text-gray-600 mt-1">Manage your event registrations and track your participation</p>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Event Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Registered On</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-purple-100">
                        {registrations.map((registration) => (
                            <tr
                                key={registration.id}
                                className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
                            >
                                <td className="px-6 py-4">
                                    <div className="text-sm font-semibold text-gray-900">{registration.eventName}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-700">{registration.date}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-700">{registration.location}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-700">{registration.registeredOn}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full text-white ${registration.statusColor}`}
                                    >
                                        {registration.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium space-x-2">
                                    <button className="text-purple-600 hover:text-white bg-purple-100 hover:bg-purple-600 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
                                        View Details
                                    </button>
                                    <button className="text-red-600 hover:text-white bg-red-100 hover:bg-red-600 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-4 space-y-4">
                {registrations.map((registration) => (
                    <div
                        key={registration.id}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">{registration.eventName}</h3>
                            <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${registration.statusColor} shrink-0`}
                            >
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
                            <button className="flex-1 text-purple-600 hover:text-white bg-purple-100 hover:bg-purple-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                                View Details
                            </button>
                            <button className="flex-1 text-red-600 hover:text-white bg-red-100 hover:bg-red-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                                Cancel
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main My Registrations Component
export default function MyRegistrationsPage() {
    return <MyRegistrations />;
}
