import {Route} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../pages/Admin/Dashboard.jsx";
import VoucherList from "../pages/Admin/VoucherList.jsx";
import CreateVoucher from "../pages/Admin/CreateVoucher.jsx";
import EditVoucher from "../pages/Admin/components/EditVoucher.jsx";
// import CourseList from "../pages/Admin/components/CourseList.jsx";
// import UserList from "../pages/Admin/components/UserList.jsx";


export default function AdminRouter() {
    return (
        <>
            <Route
                element={
                    <ProtectedRoute allowedRoles={["admin"]} />
                }
            >
                <Route path="/admin" element={<Dashboard />}>
                    <Route path="dashboard" element={<h2>Welcome Admin</h2>} />
                    <Route path="vouchers" element={<VoucherList />} />
                    <Route path="vouchers/create" element={<CreateVoucher />} />
                    <Route path="vouchers/edit/:id" element={<EditVoucher />} />
                    {/*<Route path="course" element={<CourseList />} />*/}
                    {/*<Route path="user" element={<UserList />} />*/}
                </Route>
            </Route>
        </>
    )
}
