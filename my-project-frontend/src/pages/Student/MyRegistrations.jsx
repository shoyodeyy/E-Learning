import { useState } from "react";

import Header from "../../components/Header";
import UserSidebar from "../../components/UserSidebar.jsx";

// Mock data for registrations
const registrations = [
    {
        id: 1,
        eventName: "Future Tech Summit 2024",
        date: "2024-12-15",
        location: "Convention Center, San Francisco",
        registeredOn: "2024-05-01",
        status: "Confirmed",
        statusColor: "bg-green-500"
    },
    {
        id: 2,
        eventName: "Sustainable Cities Conference",
        date: "2024-09-22",
        location: "Eco Hall, New York",
        registeredOn: "2024-06-10",
        status: "Confirmed",
        statusColor: "bg-green-500"
    },
    {
        id: 3,
        eventName: "Innovation Hackathon Challenge",
        date: "2024-10-05",
        location: "Tech Hub, Austin",
        registeredOn: "2024-07-01",
        status: "Waitlisted",
        statusColor: "bg-yellow-500"
    },
    {
        id: 4,
        eventName: "Digital Marketing Mastery Workshop",
        date: "2024-11-10",
        location: "Online Webinar",
        registeredOn: "2024-03-15",
        status: "Completed",
        statusColor: "bg-green-500"
    },
    {
        id: 5,
        eventName: "Global Health Forum",
        date: "2024-12-01",
        location: "World Congress Centre, Geneva",
        registeredOn: "2024-08-01",
        status: "Confirmed",
        statusColor: "bg-green-500"
    }
];

// My Registrations Component
const MyRegistrations = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">My Event Registrations</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Event Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Registered On
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {registrations.map((registration) => (
                            <tr key={registration.id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{registration.eventName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{registration.date}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{registration.location}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{registration.registeredOn}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${registration.statusColor}`}>
                                        {registration.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button className="cursor-pointer text-purple-600 hover:text-purple-900 bg-purple-50 px-3 py-1 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                                        View Details
                                    </button>
                                    <button className="cursor-pointer text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors duration-200">
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button className="cursor-pointer text-purple-600 hover:text-purple-800 font-medium">Settings</button>
            </div>
        </div>
    );
};

// Main My Registrations Component
export default function MyRegistrationsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="flex">
                <UserSidebar />
                
                <main className="flex-1 p-8">
                    <MyRegistrations />
                </main>
            </div>
        </div>
    );
}