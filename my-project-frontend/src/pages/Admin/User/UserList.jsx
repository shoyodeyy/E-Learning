import { useEffect, useRef, useState } from "react"
import { Loader2, Ban, Undo } from "lucide-react"
import { toast } from "react-toastify"
import api from "../../../api/axios.js"

export default function UserList() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const [banUser, setBanUser] = useState(null)
    const [reason, setReason] = useState("")
    const [isProcessingBan, setIsProcessingBan] = useState(false)

    const loadMoreRef = useRef(null)

    const fetchUsers = async (pageNum = 1, isLoadMore = false) => {
        if (isLoadMore) {
            setLoadingMore(true)
        } else {
            setLoading(true)
        }

        try {
            console.log("[v0] Fetching users for page:", pageNum)
            const res = await api.get(`/users?page=${pageNum}&per_page=100`)
            const usersArray = Array.isArray(res.data.data) ? res.data.data : []

            if (pageNum === 1) {
                setUsers(usersArray)
            } else {
                setUsers((prev) => [...prev, ...usersArray])
            }

            if (res.data.current_page && res.data.last_page) {
                setHasMore(res.data.current_page < res.data.last_page)
            } else {
                setHasMore(usersArray.length >= 100)
            }

            console.log("[v0] Loaded users:", usersArray.length, "hasMore:", hasMore)
        } catch (err) {
            console.error("Error fetching users:", err)
            toast.error("Failed to load users")
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    useEffect(() => {
        fetchUsers(1)
    }, [])

    useEffect(() => {
        if (!hasMore || loadingMore) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && !loadingMore) {
                    setPage((prev) => {
                        const nextPage = prev + 1
                        console.log("[v0] Loading more users, page:", nextPage)
                        fetchUsers(nextPage, true)
                        return nextPage
                    })
                }
            },
            {
                root: document.querySelector(".user-scroll-container"),
                threshold: 0.1,
            }
        )

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current)
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current)
            }
        }
    }, [hasMore, loading, loadingMore])

    const handleBan = async () => {
        if (!banUser) return
        setIsProcessingBan(true)
        try {
            const response = await api.post(`/users/${banUser.id}/ban`, { reason })

            if (response.status >= 200 && response.status < 300) {
                setUsers(users.map((u) => (u.id === banUser.id ? { ...u, banned_until: "9999-12-31", ban_reason: reason } : u)))
                toast.success(`Banned ${banUser.name} successfully!`)
            } else {
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
            setUsers(users.map((u) => (u.id === id ? { ...u, banned_until: null, ban_reason: null } : u)))
            toast.success("User unbanned successfully!")
        } catch {
            toast.error("Failed to unban user")
        }
    }

    return (
        <div className="p-4 md:p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">👤 Users</h2>

            {loading ? (
                <div className="flex justify-center items-center py-12 text-gray-500">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Loading Users...
                </div>
            ) : (
                <>
                    {/* Desktop */}
                    <div className="user-scroll-container hidden md:block overflow-x-auto overflow-y-auto max-h-[80vh]">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-gray-100 z-10">
                            <tr className="text-gray-700 text-sm uppercase text-center">
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
                        {hasMore && (
                            <div ref={loadMoreRef} className="h-10 flex justify-center items-center text-gray-500">
                                {loadingMore ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={16} />
                                        Loading more users...
                                    </>
                                ) : (
                                    "Scroll to load more..."
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden space-y-4">
                        {users.map((u) => (
                            <div key={u.id} className="flex justify-between items-end bg-gray-50 rounded-lg p-4 border">
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
                        {hasMore && (
                            <div ref={loadMoreRef} className="flex justify-center items-center py-4 text-gray-500">
                                {loadingMore ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={16} />
                                        Loading more users...
                                    </>
                                ) : (
                                    "Scroll to load more..."
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Modal ban */}
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
    )
}
