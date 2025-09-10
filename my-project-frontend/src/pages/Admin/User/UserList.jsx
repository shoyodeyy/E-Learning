import { useEffect, useState } from "react";
import { Loader2, Ban, Undo, Search, Filter, ChevronDown, ChevronUp, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "react-toastify";

import api from "../../../api/axios.js";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({});

    const [banUser, setBanUser] = useState(null);
    const [reason, setReason] = useState("");
    const [isProcessingBan, setIsProcessingBan] = useState(false);

    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortField, setSortField] = useState("id");
    const [sortDirection, setSortDirection] = useState("asc");
    const [filteredUsers, setFilteredUsers] = useState([]);

    const fetchUsers = async (pageNum = 1) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/users`, {
                params: {
                    page: pageNum,
                    search: searchTerm,
                    role: roleFilter,
                    status: statusFilter,
                    sortField,
                    sortDirection,
                },
            });

            setUsers(res.data.data || []);
            setMeta({
                current_page: res.data.current_page,
                last_page: res.data.last_page,
                total: res.data.total,
            });
        } catch (err) {
            console.error("Error fetching user: ", err);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers(page);
    }, [page, searchTerm, roleFilter, statusFilter, sortField, sortDirection]);

    useEffect(() => {
        let filtered = [...users];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Role filter
        if (roleFilter !== "all") {
            filtered = filtered.filter((user) => user.role === roleFilter);
        }

        // Status filter
        if (statusFilter !== "all") {
            if (statusFilter === "banned") {
                filtered = filtered.filter((user) => user.banned_until);
            } else if (statusFilter === "active") {
                filtered = filtered.filter((user) => !user.banned_until);
            }
        }

        // Sorting
        filtered.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            if (sortField === "created_at") {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (typeof aValue === "string") {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortDirection === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredUsers(filtered);
    }, [users, searchTerm, roleFilter, statusFilter, sortField, sortDirection]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setRoleFilter("all");
        setStatusFilter("all");
        setSortField("id");
        setSortDirection("asc");
    };

    const handleBan = async () => {
        if (!banUser) return;
        setIsProcessingBan(true);
        try {
            const response = await api.post(`/users/${banUser.id}/ban`, { reason });

            if (response.status >= 200 && response.status < 300) {
                setUsers(users.map((u) => (u.id === banUser.id ? { ...u, banned_until: "9999-12-31", ban_reason: reason } : u)));
                toast.success(`Banned ${banUser.name} successfully!`);
            } else {
                toast.error("Failed to ban user");
            }
        } catch {
            toast.error("Failed to ban user");
        } finally {
            setIsProcessingBan(false);
            setBanUser(null);
            setReason("");
        }
    };

    const handleUnban = async (id) => {
        if (!window.confirm("Are you sure you want to unban this user?")) return;
        try {
            await api.post(`/users/${id}/unban`);
            setUsers(users.map((u) => (u.id === id ? { ...u, banned_until: null, ban_reason: null } : u)));
            toast.success("User unbanned successfully!");
        } catch {
            toast.error("Failed to unban user");
        }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) {
            return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
        }
        return sortDirection === "asc" ? <ArrowUp className="w-4 h-4 text-blue-600" /> : <ArrowDown className="w-4 h-4 text-blue-600" />;
    };

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">👤</div>
                        User Management
                    </h2>
                    <div className="text-white/80 text-sm">Total: {meta.total || 0} users</div>
                </div>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                        />
                    </div>

                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-gray-700 font-medium"
                    >
                        <Filter className="w-4 h-4" />
                        Filters & Sorting
                        {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Role Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                    <select
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="student">Student</option>
                                        <option value="instructor">Instructor</option>
                                    </select>
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="banned">Banned</option>
                                    </select>
                                </div>

                                {/* Sort Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                    <select
                                        value={sortField}
                                        onChange={(e) => setSortField(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option value="id">ID</option>
                                        <option value="name">Name</option>
                                        <option value="email">Email</option>
                                        <option value="role">Role</option>
                                        <option value="created_at">Created Date</option>
                                    </select>
                                </div>

                                {/* Sort Direction */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
                                    <select
                                        value={sortDirection}
                                        onChange={(e) => setSortDirection(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option value="asc">Ascending</option>
                                        <option value="desc">Descending</option>
                                    </select>
                                </div>
                            </div>

                            {/* Clear Filters Button */}
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Results Summary */}
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredUsers.length} of {users.length} users
                        {searchTerm && <span className="font-medium"> matching "{searchTerm}"</span>}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-16 text-gray-500">
                        <Loader2 className="animate-spin mr-3 w-6 h-6" />
                        <span className="text-lg">Loading Users...</span>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr className="text-gray-700 text-sm font-semibold">
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => handleSort("id")}
                                                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                            >
                                                ID <SortIcon field="id" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => handleSort("name")}
                                                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                            >
                                                Name <SortIcon field="name" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => handleSort("email")}
                                                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                            >
                                                Email <SortIcon field="email" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => handleSort("role")}
                                                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                            >
                                                Role <SortIcon field="role" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => handleSort("created_at")}
                                                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                            >
                                                Created <SortIcon field="created_at" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {filteredUsers.map((u, index) => (
                                        <tr
                                            key={u.id}
                                            className={`hover:bg-blue-50 transition-colors duration-150 ${
                                                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                            }`}
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{u.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{u.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${
                                                        u.role === "instructor" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                                                    }`}
                                                >
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(u.created_at).toLocaleDateString("vi-VN")}</td>
                                            <td className="px-6 py-4 text-center">
                                                {u.banned_until ? (
                                                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Banned
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {u.banned_until ? (
                                                    <button
                                                        onClick={() => handleUnban(u.id)}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-700 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                                    >
                                                        <Undo className="w-4 h-4" /> Unban
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => setBanUser(u)}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-700 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                    >
                                                        <Ban className="w-4 h-4" /> Ban
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden space-y-4">
                            {filteredUsers.map((u) => (
                                <div
                                    key={u.id}
                                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{u.name}</h3>
                                            <p className="text-gray-600 text-sm">#{u.id}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {u.banned_until ? (
                                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Banned
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <p className="text-gray-700">{u.email}</p>
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                                    u.role === "instructor" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                                                }`}
                                            >
                                                {u.role}
                                            </span>
                                            <span className="text-xs text-gray-500">{new Date(u.created_at).toLocaleDateString("vi-VN")}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        {u.banned_until ? (
                                            <button
                                                onClick={() => handleUnban(u.id)}
                                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                            >
                                                <Undo className="w-4 h-4" /> Unban
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setBanUser(u)}
                                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                            >
                                                <Ban className="w-4 h-4" /> Ban
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {meta.last_page > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-200">
                                <button
                                    disabled={meta.current_page === 1}
                                    onClick={() => setPage((prev) => prev - 1)}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-gray-700"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        Page <span className="font-medium">{meta.current_page}</span> of{" "}
                                        <span className="font-medium">{meta.last_page}</span>
                                    </span>
                                </div>
                                <button
                                    disabled={meta.current_page === meta.last_page}
                                    onClick={() => setPage((prev) => prev + 1)}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-gray-700"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {banUser && (
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                                <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-200">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                            <Ban className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Ban User</h3>
                                            <p className="text-gray-600">Ban {banUser.name}</p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason for ban *</label>
                                        <textarea
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="Enter the reason for banning this user..."
                                            className="w-full border border-gray-300 rounded-xl p-4 min-h-[120px] text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                            rows={4}
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                                        <button
                                            onClick={() => {
                                                setBanUser(null);
                                                setReason("");
                                            }}
                                            disabled={isProcessingBan}
                                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleBan}
                                            disabled={isProcessingBan || !reason.trim()}
                                            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isProcessingBan ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Ban className="w-4 h-4" />
                                                    Confirm Ban
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {!loading && filteredUsers.length === 0 && users.length > 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
