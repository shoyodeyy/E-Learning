
import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Menu, X } from "lucide-react"


import {useAuth} from "../../context/AuthContext.jsx"
import AdminSidebar from "./components/AdminSidebar.jsx"

export default function Dashboard() {
    const navigate = useNavigate()
    const {user, logout, refreshUser} = useAuth()

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [filters, setFilters] = useState({
        start_date: "",
        end_date: "",
        min_order: "",
        usage_limit: "",
        discount_type: "",
        discount_value: "",
        status: "",
    });

    useEffect(() => {
        if (isMobileSidebarOpen) {
            document.body.classList.add("overflow-hidden")
        } else {
            document.body.classList.remove("overflow-hidden")
        }
    }, [isMobileSidebarOpen])

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener("resize", handleResize)
        handleResize()
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        if (windowWidth < 768) {
            setIsSidebarCollapsed(true)
            setIsMobileSidebarOpen(false)
        }
    }, [windowWidth])

    useEffect(() => {
        if (!user) return
        if (!user.email_verified_at) {
            refreshUser()
        }
    }, [user, refreshUser])

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    const toggleSidebar = () => {
        if (windowWidth < 768) {
            setIsMobileSidebarOpen(!isMobileSidebarOpen)
        } else {
            setIsSidebarCollapsed(!isSidebarCollapsed)
        }
    }

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            aria-label="Toggle sidebar"
                        >
                            {windowWidth < 768 ? (
                                isMobileSidebarOpen ? (
                                    <X size={20}/>
                                ) : (
                                    <Menu size={20}/>
                                )
                            ) : isSidebarCollapsed ? (
                                <Menu size={20}/>
                            ) : (
                                <X size={20}/>
                            )}
                        </button>
                        <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        {user.email_verified_at ? (
                            <span
                                className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">✓ Verified</span>
                        ) : (
                            <span
                                className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">⚠ Unverified</span>
                        )}



                        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                            Logout
                        </button>
                    </div>
                </div>
            </header>
            <div className="flex">
                <div
                    className={`
                        ${
                            windowWidth < 768
                                ? `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${
                                    isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                                } top-[5rem] rounded-tl-lg rounded-tr-lg`
                                : "relative rounded-tl-lg rounded-tr-lg"
                        }
                    `}

                >
                    <AdminSidebar
                        isCollapsed={isSidebarCollapsed}
                        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                        onFilter={setFilters}
                        filters={filters}
                    />
                </div>

                {isMobileSidebarOpen && (
                    <div
                        className="fixed inset-0 backdrop-blur-xs z-40 md:hidden top-[5rem]"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                )}

                <div
                    className="flex-1 bg-white pr-6 pb-6 pl-6 shadow transition-all duration-300 ease-in-out overflow-y-auto pt-0">
                    <Outlet context={{filters, setFilters}}/>
                </div>
            </div>
        </div>
    )
}
