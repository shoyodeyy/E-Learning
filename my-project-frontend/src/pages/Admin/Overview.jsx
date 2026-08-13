import { useState, useEffect } from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import { Users, TrendingUp, TrendingDown, Calendar, Mail, UserCheck, UserX, Shield } from "lucide-react"

import api from "../../api/axios.js"

const Overview = () => {
    const [users, setUsers] = useState([])
    const [stats, setStats] = useState([])
    const [overview, setOverview] = useState({})
    const [timeFilter, setTimeFilter] = useState("day")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [statsRes, overviewRes] = await Promise.all([
                    api.get(`/analytics/users/stats?period=${timeFilter}`),
                    api.get("/analytics/users/overview"),
                ])

                const statsData = statsRes.data
                const overviewData = overviewRes.data

                setStats(statsData.stats || [])
                setOverview(overviewData.overview || {})
                setUsers(overviewData.users || [])
                setLoading(false)
            } catch (error) {
                console.error("Error fetching analytics:", error)
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [timeFilter])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <p className="text-gray-600 text-center">Loading data...</p>
            </div>
        )
    }

    // Calculate growth rate
    const calculateGrowthRate = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0
        return (((current - previous) / previous) * 100).toFixed(1)
    }

    const currentPeriodUsers = stats[stats.length - 1]?.newUsers || 0
    const previousPeriodUsers = stats[stats.length - 2]?.newUsers || 0
    const growthRate = calculateGrowthRate(currentPeriodUsers, previousPeriodUsers)

    // Overview statistics
    const totalUsers = overview.totalUsers || 0
    const verifiedUsers = overview.verifiedUsers || 0
    const bannedUsers = overview.bannedUsers || 0
    const googleUsers = overview.googleUsers || 0

    // Pie chart data (role distribution)
    const roleStats = overview.roleStats || {}
    const pieData = Object.entries(roleStats).map(([role, count]) => ({
        name: role.charAt(0).toUpperCase() + role.slice(1),
        value: count,
        percentage: totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(1) : 0,
    }))

    const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]

    const StatCard = ({ title, value, change, icon: Icon, trend }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                        {value.toLocaleString()}
                    </p>
                    {change !== undefined && (
                        <div
                            className={`flex items-center mt-1 sm:mt-2 text-xs sm:text-sm ${
                                trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"
                            }`}
                        >
                            {trend === "up" ? (
                                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                            ) : trend === "down" ? (
                                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                            ) : null}
                            <span className="truncate">{Math.abs(change)}% vs previous</span>
                        </div>
                    )}
                </div>
                <div className="p-2 sm:p-3 bg-blue-50 rounded-lg ml-3 flex-shrink-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600" />
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Admin Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-600">Overview of users and growth trends</p>
                </div>

                <div className="mb-4 sm:mb-6">
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                        {[
                            { value: "day", label: "Daily" },
                            { value: "month", label: "Monthly" },
                            { value: "year", label: "Yearly" },
                        ].map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setTimeFilter(value)}
                                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors cursor-pointer text-sm sm:text-base ${
                                    timeFilter === value
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                    <StatCard
                        title="Total Users"
                        value={totalUsers}
                        change={Math.abs(Number.parseFloat(growthRate))}
                        trend={Number.parseFloat(growthRate) >= 0 ? "up" : "down"}
                        icon={Users}
                    />
                    <StatCard title="Verified Emails" value={verifiedUsers} icon={UserCheck} />
                    <StatCard title="Google Sign-ins" value={googleUsers} icon={Mail} />
                    <StatCard title="Banned" value={bannedUsers} icon={UserX} />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Line Chart - User Growth */}
                    <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">User Growth</h3>
                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                                <span className="truncate">
                  {timeFilter === "day" ? "Last 30 days" : timeFilter === "month" ? "Last 12 months" : "Last 5 years"}
                </span>
                            </div>
                        </div>
                        <div className="h-64 sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="period"
                                        tick={{ fontSize: 10 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                        }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                                    <Line
                                        type="monotone"
                                        dataKey="newUsers"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        name="New Users"
                                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="totalUsers"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        name="Total Users"
                                        strokeDasharray="5 5"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Role Distribution</h3>
                        <div className="h-64 sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={60}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                                        labelStyle={{ fontSize: "10px" }}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ fontSize: "12px" }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">User Activity Breakdown</h3>
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 self-start sm:self-center" />
                    </div>
                    <div className="h-64 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="period"
                                    tick={{ fontSize: 10 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                    interval="preserveStartEnd"
                                />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: "12px" }} />
                                <Bar dataKey="verifiedUsers" fill="#10B981" name="Verified" />
                                <Bar dataKey="googleUsers" fill="#3B82F6" name="Google Sign-in" />
                                <Bar dataKey="bannedUsers" fill="#EF4444" name="Banned" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Statistics Details</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Period
                                </th>
                                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    New Users
                                </th>
                                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Verified
                                </th>
                                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Google
                                </th>
                                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Banned
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {stats.slice(-10).map((stat, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                                        {stat.period}
                                    </td>
                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                                        {stat.newUsers.toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                                        {stat.totalUsers.toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                                        {stat.verifiedUsers.toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                                        {stat.googleUsers.toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                                        {stat.bannedUsers.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Overview
