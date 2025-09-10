import { useEffect, useState } from "react"
import {Loader2, Ban, Undo, Search} from "lucide-react"
import { toast } from "react-toastify"
import api from "../../../api/axios.js"

export default function UserList() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [banUser, setBanUser] = useState(null)
    const [reason, setReason] = useState("")
    const [isProcessingBan, setIsProcessingBan] = useState(false)
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [search, setSearch] = useState("");

    const fetchUsers = async (pageNumber = 1, searchTerm = search) => {
        setLoading(true)
        try {
            const res = await api.get(`/users`, {
                params: {
                    page: pageNumber,
                    search: searchTerm,
                }
            })
            setUsers(res.data.data)
            setPagination({
                current_page: res.data.current_page,
                last_page: res.data.last_page,
                total: res.data.total,
            })
        } catch (err) {
            console.error("Error fetching users: ", err)
            toast.error("Failed to load users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers(page, search)
    }, [page])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchUsers(1, search);
            setPage(1);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [search])

    const handleBan = async () => {
        if (!banUser) return
        setIsProcessingBan(true)
        try {
            const response = await api.post(`/users/${banUser.id}/ban`, { reason })

            if (response.status >= 200 && response.status < 300) {
                setUsers(users.map((u) =>
                    u.id === banUser.id ? { ...u, banned_until: "9999-12-31", ban_reason: reason } : u
                ))
                toast.success(`Banned ${banUser.name} successfully!`)
            } else {
                console.error("Unexpected response status:", response.status)
                toast.error("Failed to ban user")
            }
        } catch {
            toast.error("Failed to ban user")
        } finally {
            setIsProcessingBan(false)
            setBanUser(null)
            setReason("")
        }
    }

    const handleUnban = async (id) => {
        if (!window.confirm("Are you sure you want to unban this user?")) return
        try {
            await api.post(`/users/${id}/unban`)
            setUsers(users.map((u) =>
                u.id === id ? { ...u, banned_until: null, ban_reason: null } : u
            ))
            toast.success("User unbanned successfully!")
        } catch {
            toast.error("Failed to unban user")
        }
    }

    return (
        <div className="container mx-auto px-4">
            <div className="p-4 md:p-6 bg-white rounded-2xl shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
                    <h2 className="text-xl md:text-2xl font-bold">👤 Users</h2>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size={18}" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search Users..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12 text-gray-500">
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Loading Users...
                    </div>
                ) : (
                    <>
                        <div className="p-4 md:p-6 bg-white rounded-2xl shadow-md max-w-full overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                <tr className="bg-gray-100 text-gray-700 text-sm uppercase text-center">
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3 block md:hidden lg:table-cell">Created</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                                </thead>
                                <tbody className="text-center">
                                {users.map((u) => (
                                    <tr key={u.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">{u.id}</td>
                                        <td className="px-4 py-3 align-middle">{u.name}</td>
                                        <td className="px-4 py-3 max-w-[200px] truncate">{u.email}</td>
                                        <td className="px-4 py-3 capitalize align-middle">{u.role}</td>
                                        <td className="px-4 py-3 block md:hidden lg:table-cell align-middle">
                                            {new Date(u.created_at).toLocaleDateString("vi-VN")}
                                        </td>
                                        <td className="px-4 py-3 align-middle">
                                            {u.banned_until ? (
                                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm">Banned</span>
                                            ) : (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">Active</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 align-middle text-center">
                                            {u.banned_until ? (
                                                <button
                                                    onClick={() => handleUnban(u.id)}
                                                    className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors cursor-pointer"
                                                >
                                                    <Undo size={16} /> Unban
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setBanUser(u)}
                                                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                                                >
                                                    <Ban size={16} /> Ban
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden space-y-4">
                            {users.map((u) => (
                                <div key={u.id} className="flex justify-between items-end bg-gray-50 rounded-lg p-4 border">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm text-gray-500">#{u.id}</span>
                                                {u.banned_until ? (
                                                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">Banned</span>
                                                ) : (
                                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Active</span>
                                                )}
                                            </div>
                                            <h3 className="font-semibold text-gray-900">{u.name}</h3>
                                            <p className="text-sm text-gray-600 truncate">{u.email}</p>
                                            <p className="text-sm text-gray-500 capitalize mt-1">Role: {u.role}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Created: {new Date(u.created_at).toLocaleDateString("vi-VN")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        {u.banned_until ? (
                                            <button
                                                onClick={() => handleUnban(u.id)}
                                                className="flex items-center justify-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors cursor-pointer min-w-[100px]"
                                            >
                                                <Undo size={16} /> Unban
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setBanUser(u)}
                                                className="flex items-center justify-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors cursor-pointer min-w-[100px]"
                                            >
                                                <Ban size={16} /> Ban
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {pagination && (
                    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-75"
                        >
                            Prev
                        </button>

                        {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                            .filter(
                                (p) =>
                                    p === 1 ||
                                    p === pagination.last_page ||
                                    (p >= page - 2 && p <= page + 2)
                            )
                            .map((p, idx, arr) => (
                                <span key={p} className="flex">
                                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                                          <span className="px-2">...</span>
                                      )}
                                    <button
                                        onClick={() => setPage(p)}
                                        className={`px-3 py-1 rounded ${
                                            p === page
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                </span>
                            ))}

                        <button
                            onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
                            disabled={page === pagination.last_page}
                            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}



                {banUser && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg w-full max-w-md mx-4">
                            <h3 className="text-lg font-bold mb-4">Ban {banUser.name}</h3>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter reason..."
                                className="w-full border rounded-lg p-3 mb-4 min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                            />
                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                                <button
                                    onClick={() => setBanUser(null)}
                                    disabled={isProcessingBan}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBan}
                                    disabled={isProcessingBan}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 transition-colors font-medium disabled:opacity-70 flex items-center justify-center"
                                >
                                    {isProcessingBan ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Confirm Ban"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
}
