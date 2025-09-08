import { useState } from "react";
import { Search } from "lucide-react";

export default function VoucherFilter({ onFilter }) {
    const [filters, setFilters] = useState({
        start_date: "",
        end_date: "",
        min_order: "",
        usage_limit: 0,
        discount_type: "",
        discount_value: "",   // chỉ còn 1 field
        status: "",
    });

    const handleChange = (field, value) => {
        let newValue = value;

        // ép kiểu number cho các field số
        if (["min_order", "usage_limit", "discount_value"].includes(field) && value !== "") {
            newValue = Number(value);
        }
        if (field === "status" && value !== "") {
            newValue = Number(value);
        }

        const updated = { ...filters, [field]: newValue };
        setFilters(updated);
        onFilter(updated); // callback gửi filter ra ngoài
    };

    return (
        <div className="p-4 bg-[#8200DB] rounded-lg mt-6 space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Search size={18} /> Filter Vouchers
            </h3>

            {/* Start Date */}
            <div>
                <label className="block text-sm text-white">Start Date</label>
                <input
                    type="date"
                    value={filters.start_date}
                    onChange={e => handleChange("start_date", e.target.value)}
                    className="w-full border rounded p-1"
                />
            </div>

            {/* End Date */}
            <div>
                <label className="block text-sm text-white">End Date</label>
                <input
                    type="date"
                    value={filters.end_date}
                    onChange={e => handleChange("end_date", e.target.value)}
                    className="w-full border rounded p-1"
                />
            </div>

            {/* Min Order */}
            <div>
                <label className="block text-sm text-white">Min Order</label>
                <input
                    type="range"
                    min="0"
                    max="10000000"
                    value={filters.min_order}
                    onChange={e => handleChange("min_order", e.target.value)}
                    className="w-full"
                />
                <span className="text-white">{Number(filters.min_order).toLocaleString()}</span>
            </div>

            {/* Usage Limit */}
            <div>
                <label className="block text-sm text-white">Usage Limit</label>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.usage_limit}
                    onChange={e => handleChange("usage_limit", e.target.value)}
                    className="w-full"
                />
                <span className="text-white">{Number(filters.usage_limit).toLocaleString()}</span>
            </div>

            {/* Discount Type */}
            <div>
                <label className="block text-sm text-white">Discount Type</label>
                <select
                    value={filters.discount_type}
                    onChange={e => handleChange("discount_type", e.target.value)}
                    className="w-full border rounded p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400 cursor-pointer"
                >
                    <option value="">All</option>
                    <option value="percent">Percent %</option>
                    <option value="fixed">Fixed</option>
                </select>
            </div>

            {/* Discount Value */}
            <div>
                <label className="block text-sm text-white">Discount Value</label>

                {filters.discount_type === "percent" ? (
                    <>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={filters.discount_value}
                            onChange={e => handleChange("discount_value", e.target.value)}
                            className="w-full"
                        />
                        <span className="text-white">{Number(filters.discount_value).toLocaleString()}%</span>
                    </>
                ) : (
                    <>
                        <input
                            type="range"
                            min="0"
                            max="10000000"
                            value={filters.discount_value}
                            onChange={e => handleChange("discount_value", e.target.value)}
                            className="w-full"
                        />
                        <span className="text-white">{Number(filters.discount_value).toLocaleString()}</span>
                    </>
                )}
            </div>

            {/* Status */}
            <div>
                <label className="block text-sm mb-1 text-white">Status</label>
                <select
                    value={filters.status}
                    onChange={e => handleChange("status", e.target.value)}
                    className="w-full border rounded p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400 cursor-pointer"
                >
                    <option value="">All</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                </select>
            </div>
        </div>
    );
}
