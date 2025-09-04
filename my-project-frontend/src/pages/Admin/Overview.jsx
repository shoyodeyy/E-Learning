import React, {useState, useMemo} from 'react';
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
    Cell
} from 'recharts';
import {
    Users,
    TrendingUp,
    TrendingDown,
    Calendar,
    Mail,
    UserCheck,
    UserX,
    Shield
} from 'lucide-react';

const Overview = () => {
    const [timeFilter, setTimeFilter] = useState('day');

    // Tạo dữ liệu ảo cho users
    const generateMockUsers = () => {
        const users = [];
        const roles = ['user', 'admin', 'moderator'];
        const currentDate = new Date();

        for (let i = 0; i < 1000; i++) {
            const createdDate = new Date(currentDate.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
            const isBanned = Math.random() < 0.05; // 5% bị ban
            const hasGoogleId = Math.random() < 0.3; // 30% dùng Google
            const isVerified = hasGoogleId || Math.random() < 0.8; // Google auto verify hoặc 80% verify

            users.push({
                id: i + 1,
                name: `User ${i + 1}`,
                email: `user${i + 1}@example.com`,
                role: roles[Math.floor(Math.random() * roles.length)],
                google_id: hasGoogleId ? `google_${i + 1}` : null,
                email_verified_at: isVerified ? createdDate : null,
                banned_until: isBanned ? new Date(currentDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
                created_at: createdDate
            });
        }
        return users;
    };

    const mockUsers = useMemo(() => generateMockUsers(), []);

    // Hàm tính toán thống kê theo thời gian
    const calculateStats = (users, period) => {
        const now = new Date();
        const stats = [];
        const days = period === 'day' ? 30 : period === 'month' ? 12 : 5;

        for (let i = days - 1; i >= 0; i--) {
            let startDate, endDate, label;

            if (period === 'day') {
                startDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
                label = startDate.toLocaleDateString('vi-VN', {month: 'short', day: 'numeric'});
            } else if (period === 'month') {
                startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
                label = startDate.toLocaleDateString('vi-VN', {year: 'numeric', month: 'short'});
            } else {
                startDate = new Date(now.getFullYear() - i, 0, 1);
                endDate = new Date(now.getFullYear() - i + 1, 0, 0);
                label = startDate.getFullYear().toString();
            }

            const periodUsers = users.filter(user => {
                const createdDate = new Date(user.created_at);
                return createdDate >= startDate && createdDate < endDate;
            });

            stats.push({
                period: label,
                newUsers: periodUsers.length,
                totalUsers: users.filter(user => new Date(user.created_at) <= endDate).length,
                verifiedUsers: periodUsers.filter(user => user.email_verified_at).length,
                bannedUsers: periodUsers.filter(user => user.banned_until).length,
                googleUsers: periodUsers.filter(user => user.google_id).length
            });
        }

        return stats;
    };

    const stats = useMemo(() => calculateStats(mockUsers, timeFilter), [mockUsers, timeFilter]);

    // Tính tỷ lệ tăng giảm
    const calculateGrowthRate = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous * 100).toFixed(1);
    };

    const currentPeriodUsers = stats[stats.length - 1]?.newUsers || 0;
    const previousPeriodUsers = stats[stats.length - 2]?.newUsers || 0;
    const growthRate = calculateGrowthRate(currentPeriodUsers, previousPeriodUsers);

    // Thống kê tổng quan
    const totalUsers = mockUsers.length;
    const verifiedUsers = mockUsers.filter(user => user.email_verified_at).length;
    const bannedUsers = mockUsers.filter(user => user.banned_until && new Date(user.banned_until) > new Date()).length;
    const googleUsers = mockUsers.filter(user => user.google_id).length;

    // Dữ liệu cho biểu đồ tròn (phân bổ role)
    const roleStats = mockUsers.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.entries(roleStats).map(([role, count]) => ({
        name: role.charAt(0).toUpperCase() + role.slice(1),
        value: count,
        percentage: ((count / totalUsers) * 100).toFixed(1)
    }));

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

    const StatCard = ({title, value, change, icon: Icon, trend}) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
                    {change !== undefined && (
                        <div
                            className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                            {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1"/> :
                                trend === 'down' ? <TrendingDown className="w-4 h-4 mr-1"/> : null}
                            <span>{Math.abs(change)}% so với kỳ trước</span>
                        </div>
                    )}
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="w-8 h-8 text-blue-600"/>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thống kê người dùng</h1>
                    <p className="text-gray-600">Tổng quan về người dùng và xu hướng tăng trưởng</p>
                </div>

                {/* Time Filter */}
                <div className="mb-6">
                    <div className="flex space-x-4">
                        {[
                            {value: 'day', label: 'Theo ngày'},
                            {value: 'month', label: 'Theo tháng'},
                            {value: 'year', label: 'Theo năm'}
                        ].map(({value, label}) => (
                            <button
                                key={value}
                                onClick={() => setTimeFilter(value)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    timeFilter === value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Tổng người dùng"
                        value={totalUsers}
                        change={Math.abs(parseFloat(growthRate))}
                        trend={parseFloat(growthRate) >= 0 ? 'up' : 'down'}
                        icon={Users}
                    />
                    <StatCard
                        title="Đã xác thực email"
                        value={verifiedUsers}
                        icon={UserCheck}
                    />
                    <StatCard
                        title="Đăng nhập Google"
                        value={googleUsers}
                        icon={Mail}
                    />
                    <StatCard
                        title="Bị cấm"
                        value={bannedUsers}
                        icon={UserX}
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Line Chart - User Growth */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Tăng trưởng người dùng</h3>
                            <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2"/>
                                {timeFilter === 'day' ? '30 ngày qua' : timeFilter === 'month' ? '12 tháng qua' : '5 năm qua'}
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis
                                        dataKey="period"
                                        tick={{fontSize: 12}}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis tick={{fontSize: 12}}/>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend/>
                                    <Line
                                        type="monotone"
                                        dataKey="newUsers"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        name="Người dùng mới"
                                        dot={{fill: '#3B82F6', strokeWidth: 2, r: 4}}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="totalUsers"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        name="Tổng người dùng"
                                        strokeDasharray="5 5"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart - User Roles */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Phân bổ vai trò</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({name, percentage}) => `${name}: ${percentage}%`}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Bar Chart - User Activity Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Phân tích hoạt động người dùng</h3>
                        <Shield className="w-5 h-5 text-gray-400"/>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis
                                    dataKey="period"
                                    tick={{fontSize: 12}}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis tick={{fontSize: 12}}/>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend/>
                                <Bar dataKey="verifiedUsers" fill="#10B981" name="Đã xác thực"/>
                                <Bar dataKey="googleUsers" fill="#3B82F6" name="Đăng nhập Google"/>
                                <Bar dataKey="bannedUsers" fill="#EF4444" name="Bị cấm"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Summary Table */}
                <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Chi tiết thống kê</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thời gian
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Người dùng mới
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tổng cộng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đã xác thực
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Google
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bị cấm
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {stats.slice(-10).map((stat, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {stat.period}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {stat.newUsers.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {stat.totalUsers.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {stat.verifiedUsers.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {stat.googleUsers.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
    );
};

export default Overview;