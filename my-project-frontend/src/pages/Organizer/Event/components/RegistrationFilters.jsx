import { Filter, ChevronDown } from "lucide-react";

const RegistrationFilters = ({ filters, onFilterChange }) => {
    const handleFilterChange = (filterType, value) => {
        onFilterChange((prev) => ({
            ...prev,
            [filterType]: value,
        }));
    };

    const statusOptions = [
        { value: "all", label: "All Status" },
        { value: "confirmed", label: "Confirmed" },
        { value: "waitlist", label: "Waitlist" },
        { value: "cancelled", label: "Cancelled" },
    ];

    const attendanceOptions = [
        { value: "all", label: "All Attendance" },
        { value: "attended", label: "Attended" },
        { value: "not_attended", label: "Not Attended" },
    ];

    return (
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters:</span>
            </div>

            {/* Status Filter */}
            <div className="relative">
                <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
                >
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Attendance Filter */}
            <div className="relative">
                <select
                    value={filters.attendance}
                    onChange={(e) => handleFilterChange("attendance", e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
                >
                    {attendanceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Clear Filters */}
            {(filters.status !== "all" || filters.attendance !== "all") && (
                <button
                    onClick={() => onFilterChange({ status: "all", attendance: "all" })}
                    className="cursor-pointer text-sm text-purple-600 hover:text-purple-800 underline"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
};

export default RegistrationFilters;
