import Header from "../../components/Header";
import UserSidebar from "../../components/UserSidebar";

// Mock data for participant dashboard
const mockParticipantData = {
    totalEventsAttended: 12,
    upcomingRegistrations: 3,
    eventsSaved: 7,
    communityContributions: 5,
};

const recentActivities = [
    {
        id: 1,
        type: "registration",
        title: "Your registration for Tech Innovation Summit is confirmed!",
        time: "5 minutes ago",
        icon: "✅",
    },
    {
        id: 2,
        type: "event",
        title: "New event: Future of AI Workshop now open for registration.",
        time: "2 hours ago",
        icon: "🆕",
    },
    {
        id: 3,
        type: "reminder",
        title: "Reminder: Digital Marketing Masterclass starts tomorrow!",
        time: "Yesterday",
        icon: "⏰",
    },
    {
        id: 4,
        type: "feedback",
        title: "Feedback requested for Web Dev Bootcamp event.",
        time: "3 days ago",
        icon: "📝",
    },
];

const upcomingEvents = [
    {
        id: 1,
        title: "Global Tech Innovation Summit",
        date: "December 15, 2024",
        time: "9:00 AM - 5:00 PM",
        location: "Virtual (Online)",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
    },
    {
        id: 2,
        title: "AI in Healthcare Conference",
        date: "November 18, 2024",
        time: "8:00 AM - 4:30 PM",
        location: "Convention Center, Cityville",
        image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=250&fit=crop",
    },
    {
        id: 3,
        title: "Sustainable Living Workshop",
        date: "December 5, 2024",
        time: "10:00 AM - 3:00 PM",
        location: "Community Gardens, Greentown",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop",
    },
];

// Quick Stats Component
const QuickStats = () => {
    const stats = [
        {
            label: "Total Events Attended",
            value: mockParticipantData.totalEventsAttended,
            icon: "🎉",
            color: "from-blue-500 to-cyan-500",
        },
        {
            label: "Upcoming Registrations",
            value: mockParticipantData.upcomingRegistrations,
            icon: "📅",
            color: "from-purple-500 to-pink-500",
        },
        {
            label: "Events Saved",
            value: mockParticipantData.eventsSaved,
            icon: "💾",
            color: "from-green-500 to-emerald-500",
        },
        {
            label: "Community Contributions",
            value: mockParticipantData.communityContributions,
            icon: "🏆",
            color: "from-orange-500 to-red-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                            <span className="text-xl">{stat.icon}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Recent Activity Component
const RecentActivity = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
                {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">{activity.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 mb-1">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <button className="cursor-pointer text-gray-400 hover:text-gray-600">
                            <span className="text-lg">→</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Upcoming Events Component
const UpcomingEvents = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Events</h3>
            <div className="space-y-4">
                {upcomingEvents.map((event) => (
                    <div
                        key={event.id}
                        className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                    >
                        <img src={event.image} alt={event.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">{event.title}</h4>
                            <div className="flex items-center text-xs text-gray-600 mb-1">
                                <span className="mr-4">📅 {event.date}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600 mb-1">
                                <span className="mr-4">⏰ {event.time}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                                <span>📍 {event.location}</span>
                            </div>
                        </div>
                        <button className="cursor-pointer px-4 py-2 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main Participant Dashboard Component
export default function ParticipantDashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome, Participant!</h1>
                <p className="text-gray-600 mt-2">Your event journey starts here. Explore your stats and upcoming activities.</p>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Quick Stats</h2>
                <QuickStats />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentActivity />
                <UpcomingEvents />
            </div>
        </div>
    );
}
