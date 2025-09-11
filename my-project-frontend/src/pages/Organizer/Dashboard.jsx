import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"

import { useAuth } from "../../context/AuthContext.jsx"
import Header from "../../components/Header.jsx"
import OrganizerSidebar from "./component/OrganizerSidebar.jsx";

export default function Dashboard() {
    const { user, refreshUser } = useAuth()

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        if (windowWidth < 768) {
            setIsSidebarCollapsed(true)
        }
    }, [windowWidth])

    useEffect(() => {
        if (!user) return
        if (!user.email_verified_at) {
            refreshUser()
        }
    }, [user, refreshUser])

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            {windowWidth < 768 ? (
                <div>
                    <div className="sticky top-[64px] z-50">
                        <OrganizerSidebar horizontal={true} isCollapsed={true} />
                    </div>
                    <div className="bg-white p-4 shadow mt-2">
                        <Outlet />
                    </div>
                </div>
            ) : (
                <div className="flex">
                    <div className="relative">
                        <OrganizerSidebar
                            isCollapsed={isSidebarCollapsed}
                            setIsCollapsed={setIsSidebarCollapsed}
                        />
                    </div>
                    <div className="flex-1 bg-white pr-6 pb-6 pl-6 shadow transition-all duration-300 ease-in-out overflow-y-auto pt-0">
                        <Outlet />
                    </div>
                </div>
            )}
        </div>
    )
}
