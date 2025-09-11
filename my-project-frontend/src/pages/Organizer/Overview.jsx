import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Sample data for charts
const userRegistrationData = [
    { date: '12 tháng 8', desktop: 300, mobile: 200 },
    { date: '18 tháng 8', desktop: 450, mobile: 350 },
    { date: '23 tháng 8', desktop: 320, mobile: 280 },
    { date: '24 tháng 8', desktop: 380, mobile: 400 },
    { date: '7 tháng 9', desktop: 500, mobile: 450 },
    { date: '8 tháng 9', desktop: 420, mobile: 380 },
    { date: '9 tháng 9', desktop: 480, mobile: 420 },
];

const eventComparisonData = [
    { month: 'tháng 4 năm 2023', online: 14, offline: 21, hybrid: 18 },
    { month: 'tháng 5 năm 2023', online: 18, offline: 25, hybrid: 22 },
    { month: 'tháng 6 năm 2023', online: 22, offline: 28, hybrid: 26 },
];

const recentEvents = [
    {
        id: 1,
        title: 'Hòa nhạc Rock "Thế giới không ngủ"',
        date: '25 tháng 8, 2024',
        status: 'active'
    },
    {
        id: 2,
        title: 'Giải chay Marathon Quốc tế Hà Nội',
        date: '1 tháng 9, 2024',
        status: 'active'
    },
    {
        id: 3,
        title: 'Hội nghị Công nghệ AI 2024',
        date: '5 tháng 9, 2024',
        status: 'inactive'
    },
    {
        id: 4,
        title: 'Workshop Nghệ thuật Đương phố',
        date: '12 tháng 9, 2024',
        status: 'active'
    },
    {
        id: 5,
        title: 'Lễ hội Ẩm thực Mùa thu',
        date: '18 tháng 9, 2024',
        status: 'active'
    }
];

// Stats Card Component
const StatsCard = ({ title, value, subtitle, icon, color }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
                    <p className="text-sm text-gray-500">{subtitle}</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                    <span className="text-white text-xl">{icon}</span>
                </div>
            </div>
        </div>
    );
};

// Chart Component
const ChartCard = ({ title, children }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
            {children}
        </div>
    );
};

// Event List Component
const EventList = () => {
    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Sự kiện gần đây</h3>
                <p className="text-sm text-gray-500 mb-6">5 sự kiện được tạo hoặc cập nhật gần đây nhất.</p>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Tiêu đề</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Ngày tạo</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-600 text-sm">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentEvents.map((event) => (
                            <tr key={event.id} className="border-b border-gray-50 hover:bg-purple-50 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="font-medium text-gray-900">{event.title}</div>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-600">{event.date}</td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                                            <span className="text-lg">👁️</span>
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                                            <span className="text-lg">✏️</span>
                                        </button>
                                        <button
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                event.status === 'active'
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-gray-500 text-white'
                                            }`}
                                        >
                                            {event.status === 'active' ? 'Xóa' : 'Xóa'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const Overview = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tổng quan</h1>
                <p className="text-gray-600">Chào mừng trở lại! Đây là tổng quan về hoạt động của bạn.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                    title="Sự kiện đang hoạt động"
                    value="12"
                    subtitle="+3.1% so với tháng trước"
                    icon="📅"
                    color="bg-gradient-to-r from-blue-500 to-cyan-500"
                />
                <StatsCard
                    title="Tổng đăng ký"
                    value="789"
                    subtitle="+15.3% so với tháng trước"
                    icon="👥"
                    color="bg-gradient-to-r from-purple-500 to-pink-500"
                />
                <StatsCard
                    title="Tài liệu phương tiện"
                    value="235"
                    subtitle="+5.2% so với tuần trước"
                    icon="📊"
                    color="bg-gradient-to-r from-green-500 to-emerald-500"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartCard title="Đăng ký người dùng theo thời gian">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userRegistrationData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="desktop"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                                    name="Máy tính bàn"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="mobile"
                                    stroke="#ec4899"
                                    strokeWidth={3}
                                    dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                                    name="Di động"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center space-x-6 mt-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Máy tính bàn</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Di động</span>
                        </div>
                    </div>
                </ChartCard>

                <ChartCard title="So sánh thể loại sự kiện">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={eventComparisonData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="online"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                                    name="Trực tuyến"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="offline"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                    name="Trực tiếp"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="hybrid"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                                    name="Hỗn hợp"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center space-x-6 mt-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Trực tuyến</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Trực tiếp</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Hỗn hợp</span>
                        </div>
                    </div>
                </ChartCard>
            </div>

            {/* Recent Events Table */}
            <EventList />
        </div>
    );
};

export default Overview;