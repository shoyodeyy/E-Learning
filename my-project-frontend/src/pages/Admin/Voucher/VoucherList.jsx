import { useEffect, useState } from "react"
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import api from "../../../api/axios.js"

export default function VoucherList() {
    const [vouchers, setVouchers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get("/vouchers")
            .then((res) => setVouchers(res.data))
            .catch((err) => console.log(err))
            .finally(() => setLoading(false))
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this voucher?")) return
        try {
            await api.delete(`/vouchers/${id}`)
            setVouchers((prev) => prev.filter((v) => v.id !== id))
            toast.success("Voucher deleted successfully")
        } catch (err) {
            console.error(err)
            toast.error("Failed to delete this voucher")
        }
    }

    return (
        <div className="p-4 md:p-6 bg-white rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">🎟️ Vouchers</h2>
                <Link
                    to="/admin/vouchers/create"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 md:px-6 py-2 rounded-lg shadow transition flex items-center gap-2"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12 text-gray-500">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Loading vouchers...
                </div>
            ) : vouchers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No vouchers found.</div>
            ) : (
                <>
                    {/* Table for md+ screens */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Code</th>
                                <th className="px-4 py-3 text-left">Discount</th>
                                <th className="px-4 py-3 text-left">Min</th>
                                <th className="px-4 py-3 text-left">Use</th>
                                <th className="px-4 py-3 text-left">Time</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {vouchers.map((v, idx) => (
                                <tr
                                    key={v.id}
                                    className={`border-b hover:bg-gray-50 transition ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                >
                                    <td className="px-4 py-3">{v.id}</td>
                                    <td className="px-4 py-3 font-mono text-purple-600">{v.code}</td>
                                    <td className="px-4 py-3">
                                        {v.discount_type === "percent"
                                            ? `${parseInt(v.discount_value)}%`
                                            : `${parseInt(v.discount_value).toLocaleString()} VND`}
                                    </td>
                                    <td className="px-4 py-3">{v.min_order ? `${parseInt(v.min_order).toLocaleString()} VND` : "—"}</td>
                                    <td className="px-4 py-3">{v.usage_limit ?? "Unlimited"}</td>
                                    <td className="px-4 py-3">
                                        {v.start_date && v.end_date
                                            ? `${v.start_date.substring(0, 10)} → ${v.end_date.substring(0, 10)}`
                                            : "Untimed"}
                                    </td>
                                    <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    v.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {v.status ? "Active" : "Inactive"}
                                            </span>
                                    </td>
                                    <td className="px-4 py-3 text-center space-x-3">
                                        <Link
                                            to={`/admin/vouchers/edit/${v.id}`}
                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                                        >
                                            <Pencil size={16} /> Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(v.id)}
                                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 transition cursor-pointer"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Card layout for mobile */}
                    <div className="md:hidden space-y-4">
                        {vouchers.map((v) => (
                            <div key={v.id} className="bg-gray-50 rounded-lg p-4 border">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{v.code}</h3>
                                        <p className="text-sm text-gray-600">
                                            {v.discount_type === "percent"
                                                ? `${parseInt(v.discount_value)}%`
                                                : `${parseInt(v.discount_value).toLocaleString()} VND`}{" "}
                                            off
                                        </p>
                                        {v.min_order && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Min: {parseInt(v.min_order).toLocaleString()} VND
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            {v.start_date && v.end_date
                                                ? `${v.start_date.substring(0, 10)} → ${v.end_date.substring(0, 10)}`
                                                : "Untimed"}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            v.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {v.status ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <Link
                                        to={`/admin/vouchers/edit/${v.id}`}
                                        className="flex items-center justify-center gap-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition cursor-pointer"
                                    >
                                        <Pencil size={16} /> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(v.id)}
                                        className="flex items-center justify-center gap-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition cursor-pointer"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
