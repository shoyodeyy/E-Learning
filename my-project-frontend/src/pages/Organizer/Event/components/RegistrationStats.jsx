import { Users, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";

const RegistrationStats = ({ stats }) => {
    const statCards = [
        {
            title: "Total Registrations",
            value: stats.total,
            icon: Users,
            color: "bg-blue-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700"
        },
        {
            title: "Confirmed",
            value: stats.confirmed,
            icon: CheckCircle,
            color: "bg-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-700"
        },
        {
            title: "Waitlist",
            value: stats.waitlist,
            icon: Clock,
            color: "bg-yellow-500",
            bgColor: "bg-yellow-50",
            textColor: "text-yellow-700"
        },
        {
            title: "Cancelled",
            value: stats.cancelled,
            icon: XCircle,
            color: "bg-red-500",
            bgColor: "bg-red-50",
            textColor: "text-red-700"
        },
        {
            title: "Attendance Rate",
            value: `${stats.attendanceRate}%`,
            icon: TrendingUp,
            color: "bg-purple-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-700",
            subtitle: `${stats.attended} of ${stats.confirmed} attended`
        }
    ];

    return (
        <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {statCards.map((stat, index) => {
                    const IconComponent = stat.icon;
                    
                    return (
                        <div 
                            key={index}
                            className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <IconComponent className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            
                            <div>
                                <p className={`text-2xl font-bold ${stat.textColor}`}>
                                    {stat.value}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {stat.title}
                                </p>
                                {stat.subtitle && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {stat.subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RegistrationStats;