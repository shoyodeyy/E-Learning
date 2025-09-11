import { Outlet } from "react-router-dom";

import Header from "../../components/Header";
import UserSidebar from "../../components/UserSidebar.jsx";

export default function UserLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <div className="flex flex-1">
                <UserSidebar />

                <main className="flex-1 p-4 lg:p-8 flex flex-col">
                    <div className="lg:hidden mb-4">
                        <UserSidebar mobile />
                    </div>

                    <div className="flex-1">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
