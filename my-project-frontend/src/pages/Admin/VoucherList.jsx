import {useEffect, useState} from "react";
import {Pencil, Trash2, Plus} from "lucide-react";
import {Link} from "react-router-dom";
import api from "../../api/axios.js";

export default function VoucherList() {
    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        api.get("/vouchers")
            .then(res => setVouchers(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this voucher?")) return;

        try {
            await api.delete(`/vouchers/${id}`);
            setVouchers(prev => prev.filter(v => v.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to Delete this voucher");
        }
    };

    return (
        <div className="p-6 bg-white rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">🎟️ Vouchers</h2>
                <div className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow transition">
                    <Link
                        to="/admin/vouchers/create"
                        className="flex items-center gap-2"
                    >
                        <Plus size={18} />
                        <span>Create</span>
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
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
                            className={`border-b hover:bg-gray-50 transition ${
                                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                        >
                            <td className="px-4 py-3">{v.id}</td>
                            <td className="px-4 py-3 font-mono text-purple-600">{v.code}</td>
                            <td className="px-4 py-3">
                                {v.discount_type === "percent"
                                    ? `${parseInt(v.discount_value)}%`
                                    : `${parseInt(v.discount_value).toLocaleString()} VND`}
                            </td>
                            <td className="px-4 py-3">
                                {v.min_order
                                    ? `${parseInt(v.min_order).toLocaleString()} VND`
                                    : "—"}
                            </td>
                            <td className="px-4 py-3">
                                {v.usage_limit ?? "Unlimited"}
                            </td>
                            <td className="px-4 py-3">
                                {v.start_date && v.end_date
                                    ? `${v.start_date.substring(0, 10)} → ${v.end_date.substring(0, 10)}`
                                    : "Untimed"}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        v.status
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
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
                                    <Pencil size={16} /> Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(v.id)}
                                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
