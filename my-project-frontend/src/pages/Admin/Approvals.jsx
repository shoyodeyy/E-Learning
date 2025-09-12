import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle, Search, Filter, ChevronDown, ChevronUp, ArrowUpDown, ArrowUp, ArrowDown, UserCheck } from "lucide-react";
import { toast } from "react-toastify";

import api from "../../api/axios.js";

export default function ApprovalsEnhanced() {
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredOrganizers, setFilteredOrganizers] = useState([]);

    // Filter and search states
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("user_id");
    const [sortDirection, setSortDirection] = useState("asc");

    // Processing states
    const [processingId, setProcessingId] = useState(null);

    const fetchOrganizers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/organizers?status=pending");
            setOrganizers(res.data);
        } catch {
            toast.error("Failed to load organizers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizers();
    }, []);

    // Filter and sort organizers
    useEffect(() => {
        let filtered = [...organizers];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (organizer) =>
                    organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    organizer.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sorting
        filtered.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

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

        setFilteredOrganizers(filtered);
    }, [organizers, searchTerm, sortField, sortDirection]);

    const handleApproval = async (id, status) => {
        setProcessingId(id);
        try {
            await api.post(`/organizer/${id}/approve`, { status });
            toast.success(`Organizer ${status === "active" ? "approved" : "banned"} successfully!`);
            fetchOrganizers();
        } catch {
            toast.error("Failed to update organizer");
        } finally {
            setProcessingId(null);
        }
    };

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
        setSortField("user_id");
        setSortDirection("asc");
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) {
            return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
        }
        return sortDirection === "asc" ? <ArrowUp className="w-4 h-4 text-blue-600" /> : <ArrowDown className="w-4 h-4 text-blue-600" />;
    };

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        Organizer Approvals
                    </h2>
                    <div className="text-white/80 text-sm">Pending: {organizers.length} organizers</div>
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
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                        />
                    </div>

                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-gray-700 font-medium"
                    >
                        <Filter className="w-4 h-4" />
                        Sorting Options
                        {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Sort Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                    <select
                                        value={sortField}
                                        onChange={(e) => setSortField(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                                    >
                                        <option value="user_id">ID</option>
                                        <option value="name">Name</option>
                                        <option value="email">Email</option>
                                    </select>
                                </div>

                                {/* Sort Direction */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
                                    <select
                                        value={sortDirection}
                                        onChange={(e) => setSortDirection(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                                    >
                                        <option value="asc">Ascending</option>
                                        <option value="desc">Descending</option>
                                    </select>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="cursor-pointer w-full px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Summary */}
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredOrganizers.length} of {organizers.length} pending organizers
                        {searchTerm && <span className="font-medium"> matching "{searchTerm}"</span>}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-16 text-gray-500">
                        <Loader2 className="animate-spin mr-3 w-6 h-6" />
                        <span className="text-lg">Loading Organizers...</span>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr className="text-gray-700 text-sm font-semibold">
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => handleSort("user_id")}
                                                className="cursor-pointer flex items-center gap-2 hover:text-emerald-600 transition-colors"
                                            >
                                                ID <SortIcon field="user_id" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => handleSort("name")}
                                                className="cursor-pointer flex items-center gap-2 hover:text-emerald-600 transition-colors"
                                            >
                                                Name <SortIcon field="name" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left">
                                            <button
                                                onClick={() => handleSort("email")}
                                                className="cursor-pointer flex items-center gap-2 hover:text-emerald-600 transition-colors"
                                            >
                                                Email <SortIcon field="email" />
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {filteredOrganizers.map((organizer, index) => (
                                        <tr
                                            key={organizer.user_id}
                                            className={`hover:bg-emerald-50 transition-colors duration-150 ${
                                                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                            }`}
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">#{organizer.user_id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{organizer.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{organizer.email}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Pending
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleApproval(organizer.user_id, "active")}
                                                        disabled={processingId === organizer.user_id}
                                                        className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {processingId === organizer.user_id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="w-4 h-4" />
                                                        )}
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproval(organizer.user_id, "banned")}
                                                        disabled={processingId === organizer.user_id}
                                                        className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-700 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {processingId === organizer.user_id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4" />
                                                        )}
                                                        Ban
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4">
                            {filteredOrganizers.map((organizer) => (
                                <div
                                    key={organizer.user_id}
                                    className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">{organizer.name}</h3>
                                            <p className="text-gray-600 text-sm">#{organizer.user_id}</p>
                                        </div>
                                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Pending
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-gray-700">{organizer.email}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApproval(organizer.user_id, "active")}
                                            disabled={processingId === organizer.user_id}
                                            className="cursor-pointer flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processingId === organizer.user_id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4" />
                                            )}
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleApproval(organizer.user_id, "banned")}
                                            disabled={processingId === organizer.user_id}
                                            className="cursor-pointer flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processingId === organizer.user_id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <XCircle className="w-4 h-4" />
                                            )}
                                            Ban
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {!loading && filteredOrganizers.length === 0 && organizers.length > 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No organizers found</h3>
                                <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
                                <button
                                    onClick={clearFilters}
                                    className="cursor-pointer px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                        {/* No Pending Organizers */}
                        {!loading && organizers.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UserCheck className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending organizers</h3>
                                <p className="text-gray-600">All organizer applications have been processed</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
