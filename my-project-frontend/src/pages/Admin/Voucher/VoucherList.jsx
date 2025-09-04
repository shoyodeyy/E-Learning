import {useEffect, useState} from "react"
import {Pencil, Trash2, Plus, Loader2} from "lucide-react"
import {Link} from "react-router-dom"
import {toast} from "react-toastify";

import api from "../../../api/axios.js"

export default function VoucherList() {
    const [vouchers, setVouchers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api
            .get("/vouchers")
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
            <div className="p-6 bg-white rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">🎟️ Vouchers</h2>
                    <div
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow transition cursor-pointer">
                        <Link to="/admin/vouchers/create" className="flex items-center gap-2">
                            <Plus size={18}/>
                            <span>Create</span>
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-12 text-gray-500">
                            <Loader2 className="animate-spin mr-2" size={20}/>
                            Loading vouchers...
                        </div>
                    ) : vouchers.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">No vouchers found.</div>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Code</th>
                                <th className="px-4 py-3 text-left hidden sm:table-cell">Discount</th>
                                <th className="px-4 py-3 text-left hidden md:table-cell">Min</th>
                                <th className="px-4 py-3 text-left hidden lg:table-cell">Use</th>
                                <th className="px-4 py-3 text-left hidden lg:table-cell">Time</th>
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
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                        {v.discount_type === "percent"
                                            ? `${Number.parseInt(v.discount_value)}%`
                                            : `${Number.parseInt(v.discount_value).toLocaleString()} VND`}
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        {v.min_order ? `${Number.parseInt(v.min_order).toLocaleString()} VND` : "—"}
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell">{v.usage_limit ?? "Unlimited"}</td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
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
                                    <td className="px-4 py-3 text-center flex gap-3 justify-center">
                                        <Link
                                            to={`/admin/vouchers/edit/${v.id}`}
                                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
                                        >
                                            <Pencil size={16}/> Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(v.id)}
                                            className="flex items-center gap-1 text-red-600 hover:text-red-800 transition cursor-pointer"
                                        >
                                            <Trash2 size={16}/> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        )
    }
