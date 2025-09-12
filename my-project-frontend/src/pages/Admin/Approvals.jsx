import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { toast } from "react-toastify";

export default function Approvals() {
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrganizers = async () => {
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

    const handleApproval = async (id, status) => {
        try {
            await api.post(`/organizer/${id}/approve`, { status });
            toast.success(`Organizer ${status} successfully!`);
            fetchOrganizers(); // reload lại danh sách
        } catch {
            toast.error("Failed to update organizer");
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">Organizer Approvals</h1>
            {organizers.length === 0 ? (
                <p>No pending organizers</p>
            ) : (
                <table className="w-full border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {organizers.map((o) => (
                            <tr key={o.user_id}>
                                <td className="p-2 border">{o.user_id}</td>
                                <td className="p-2 border">{o.name}</td>
                                <td className="p-2 border">{o.email}</td>
                                <td className="p-2 border flex gap-2">
                                    <button onClick={() => handleApproval(o.user_id, "active")} className="px-3 py-1 bg-green-500 text-white rounded">
                                        Approve
                                    </button>
                                    <button onClick={() => handleApproval(o.user_id, "banned")} className="px-3 py-1 bg-red-500 text-white rounded">
                                        Ban
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
