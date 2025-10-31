import { useEffect, useState } from "react";
import api from "../../api/axios.js"; // axios instance bạn đã setup
import { useAuth } from "../../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

export default function ParticipantDashboard() {
    const { user } = useAuth();

    // fallback mặc định
    const [stats, setStats] = useState({
        totalEventsAttended: 0,
        upcomingRegistrations: 0,
        eventsSaved: 0,
        communityContributions: 0,
    });

    const [activities, setActivities] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        api.get("/dashboard/stats")
            .then(res => {
                setStats(res.data)
            })
            .catch(err => console.error("Stats error:", err));

        api.get("/dashboard/recent-activities")
            .then(res => {
                setActivities(res.data)
            })
            .catch(err => console.error("Recent activities error:", err));

        api.get("/dashboard/upcoming-events")
            .then(res => {
                setUpcomingEvents(res.data ?? []);
            })
            .catch(err => {
                console.error("Upcoming events error:", err);
                setUpcomingEvents([]);
            });

    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
                <p className="text-gray-600 mt-2">Your event journey starts here. Explore your stats and upcoming activities.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard label="Total Events Attended" value={stats.totalEventsAttended} icon="🎉" color="from-blue-500 to-cyan-500" />
                <StatCard label="Upcoming Registrations" value={stats.upcomingRegistrations} icon="📅" color="from-purple-500 to-pink-500" />
                <StatCard label="Events Saved" value={stats.eventsSaved} icon="💾" color="from-green-500 to-emerald-500" />
                <StatCard label="Community Contributions" value={stats.communityContributions} icon="🏆" color="from-orange-500 to-red-500" />
            </div>


            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                    <RecentActivity activities={activities} />
                </div>
                <div className="flex-1">
                    <UpcomingEvents events={upcomingEvents } />
                </div>
            </div>

        </div>
    );
}

function StatCard({ label, value, icon, color }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${color} flex items-center justify-center`}>
                    <span className="text-xl">{icon}</span>
                </div>
            </div>
        </div>
    );
}

function RecentActivity({ activities }) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 min-h-[300px]">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
                {activities.length > 0 ? (
                    activities.map((activity, idx) => (
                        <div key={idx} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm">{activity.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 mb-1">{activity.title}</p>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center mt-10">No recent activity</p>
                )}
            </div>
        </div>
    );
}

function UpcomingEvents({ events }) {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 min-h-[300px]">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Events</h3>
            <div className="space-y-4">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div key={event.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                            <img src={`http://localhost:8000${event.image}`} alt={event.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <h4 onClick={() => navigate(`/event/${event.id}`)} className="cursor-pointer hover:underline transation duration-200 text-sm font-semibold text-gray-900 mb-1">{event.title}</h4>
                                <p className="text-xs text-gray-600 mb-1">📅 {event.date}</p>
                                <p className="text-xs text-gray-600 mb-1">⏰ {event.time}</p>
                                <p className="text-xs text-gray-600">📍 {event.location}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center mt-10">No upcoming events</p>
                )}
            </div>
        </div>
    );
}

