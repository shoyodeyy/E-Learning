import { useState } from "react";
import { Filter, X } from "lucide-react";

export default function VoucherFilterMobile({ filters, setFilters }) {
    const [open, setOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev => ({
            ...prev,
            [name]: value,
        })));
    };

    const handleReset = () => {
        setFilters({
            start_date: "",
            end_date: "",
            min_order: "",
            usage_limit: "",
            status: "",
            discount_type: "",
            discount_value: "",
        });
        setOpen(false);
    };


    return (
        <div className="w-full">
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 w-full bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md"
            >
                <Filter size={18} /> Filter
            </button>

            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                    <div className="w-full sm:w-2/3 h-full bg-white shadow-lg flex flex-col animate-slide-in">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-700">Filter Voucher</h3>
                            <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-red-500">
                                <X size={22} />
                            </button>
                        </div>

                        <form className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Start Date */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={filters.start_date}
                                    onChange={handleChange}
                                    className="w-full border rounded-md p-2"
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">End Date</label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={filters.end_date}
                                    onChange={handleChange}
                                    className="w-full border rounded-md p-2"
                                />
                            </div>

                            {/* Min Order */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Min Order: {Number(filters.min_order).toLocaleString()}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10000000"
                                    name="min_order"
                                    value={filters.min_order}
                                    onChange={handleChange}
                                    className="w-full accent-purple-600"
                                />
                            </div>

                            {/* Usage Limit */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Usage Limit: {Number(filters.usage_limit).toLocaleString()}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    name="usage_limit"
                                    value={filters.usage_limit}
                                    onChange={handleChange}
                                    className="w-full accent-purple-600"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleChange}
                                    className="w-full border rounded-md p-2"
                                >
                                    <option value="">All</option>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>

                            {/* Discount Type */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Discount Type</label>
                                <select
                                    name="discount_type"
                                    value={filters.discount_type}
                                    onChange={handleChange}
                                    className="w-full border rounded-md p-2"
                                >
                                    <option value="">All</option>
                                    <option value="percent">Percent %</option>
                                    <option value="fixed">Fixed</option>
                                </select>
                            </div>

                            {/* Discount Value */}
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Discount Value: {Number(filters.discount_value).toLocaleString()}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max={filters.discount_type === "percent" ? 100 : 10000000}
                                    name="discount_value"
                                    value={filters.discount_value}
                                    onChange={handleChange}
                                    className="w-full accent-purple-600"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg shadow"
                                >
                                    Apply
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="flex-1 border border-gray-400 text-gray-700 py-2 rounded-lg"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
