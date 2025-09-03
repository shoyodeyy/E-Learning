import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api from "../../../api/axios.js";
import {ArrowLeft} from "lucide-react";


export default function EditVoucher() {
    const navigate = useNavigate();
    const {id} = useParams();

    const [formData, setFormData] = useState({
        code: "",
        discount_type: "",
        discount_value: "",
        min_order: "",
        usage_limit: "",
        status: "1",
        active: true,
        start_date: "",
        end_date: "",
        enable_time_limit: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const getInputClass = (field) => {
        return `w-full border rounded-md p-2 focus:ring transition duration-300 ${
            errors[field]
                ? "border-2 border-red-500 bg-red-50 shadow-md shadow-red-200 animate-pulse focus:ring-red-400"
                : "border border-gray-300 focus:border-blue-400 focus:ring-blue-200"
        }`;
    };

    useEffect(() => {
       api
           .get(`/vouchers/${id}`)
           .then(res => {
               const v = res.data;

               setFormData({
                  code: v.code ?? "",
                  discount_type: v.discount_type ?? "",
                  discount_value: v.discount_value ? parseInt(v.discount_value, 10) : "",
                  min_order: v.min_order ? parseInt(v.min_order, 10) : "",
                  usage_limit: v.usage_limit ?? "",
                  status: v.status ? "1" : "0",
                  active: v.active ?? true,
                  start_date: v.start_date ? v.start_date.substring(0, 10) : "",
                  end_date: v.end_date ? v.end_date.substring(0, 10) : "",
                  enable_time_limit: !!(v.start_date || v.end_date),
               });

               setLoading(false);
           })
            .catch(err => {
            console.error(err);
            alert("Failed to load voucher");
            navigate("/admin/vouchers");
        });
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try{
            await api.put(`/vouchers/${id}`, formData);
            alert("Successfully updated voucher!");
            navigate("/admin/vouchers");
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                alert("Failed to update voucher!");
            }
        }
    };

    if (loading) return <p className="text-center">Loading...</p>

    return (
        <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">✏️ Edit Voucher</h2>
                <button
                    onClick={() => navigate(-1)} // quay lại trang trước
                    className="flex items-center gap-2 px-4 py-2 bg-green-400 hover:bg-gray-300 text-gray-700 rounded-lg shadow"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-1">Code</label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Code"
                        className={getInputClass("code")}
                    />
                    {errors.code && (
                        <p className="text-red-500 text-sm mt-1">{errors.code[0]}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Discount Type</label>
                        <select
                            name="discount_type"
                            value={formData.discount_type}
                            onChange={handleChange}
                            className={getInputClass("discount_type")}
                        >
                            <option value="">-- Select type --</option>
                            <option value="percent">Percent</option>
                            <option value="fixed">Fixed</option>
                        </select>
                        {errors.discount_type && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.discount_type[0]}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Discount Value</label>
                        <input
                            type="number"
                            name="discount_value"
                            value={formData.discount_value ?? ""}
                            onChange={handleChange}
                            placeholder="Enter discount"
                            className={getInputClass("discount_value")}
                        />
                        {errors.discount_value && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.discount_value[0]}
                            </p>
                        )}
                    </div>
                </div>

                {/* Order Minimum */}
                <div>
                    <label className="block text-gray-700 mb-1">Order Minimum</label>
                    <input
                        type="number"
                        name="min_order"
                        value={formData.min_order ?? ""}
                        onChange={handleChange}
                        placeholder="Minimum order amount"
                        className={getInputClass("min_order")}
                        step="1"
                    />
                    {errors.min_order && (
                        <p className="text-red-500 text-sm mt-1">{errors.min_order[0]}</p>
                    )}
                </div>

                {/* Usage Limit + Status */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Usage Limit</label>
                        <input
                            type="number"
                            name="usage_limit"
                            value={formData.usage_limit ?? ""}
                            onChange={handleChange}
                            placeholder="Leave empty for unlimited"
                            className={getInputClass("usage_limit")}
                        />
                        {errors.usage_limit && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.usage_limit[0]}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={getInputClass("status")}
                        >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        {errors.status && (
                            <p className="text-red-500 text-sm mt-1">{errors.status[0]}</p>
                        )}
                    </div>
                </div>

                {/* Enable Time Limit + Start/End */}
                <div>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="enable_time_limit"
                            checked={formData.enable_time_limit}
                            onChange={handleChange}
                            className="h-4 w-4"
                        />
                        <span className="text-gray-700">Enable Time Limit</span>
                    </label>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date ?? ""}
                                onChange={handleChange}
                                className={getInputClass("start_date")}
                                disabled={!formData.enable_time_limit}
                                min={new Date().toISOString().split("T")[0]}
                            />
                            {errors.start_date && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.start_date[0]}
                                </p>
                            )}
                        </div>
                        <div>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date ?? ""}
                                onChange={handleChange}
                                className={getInputClass("end_date")}
                                disabled={!formData.enable_time_limit}
                                min={formData.start_date || new Date().toISOString().split("T")[0]}
                            />
                            {errors.end_date && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.end_date[0]}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="px-6 py-2 bg-[#8200DB] text-white rounded-md shadow hover:bg-blue-600"
                >
                    Update
                </button>
            </form>
        </div>
    );
};
