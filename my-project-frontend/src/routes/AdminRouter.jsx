import {Route} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";
import Dashboard from "../pages/Admin/Dashboard.jsx";
import VoucherList from "../pages/Admin/Voucher/VoucherList.jsx";
import CreateVoucher from "../pages/Admin/Voucher/CreateVoucher.jsx";
import EditVoucher from "../pages/Admin/Voucher/EditVoucher.jsx";
import UserList from "../pages/Admin/User/UserList.jsx";
import ChangePassword from "../pages/ChangePassword.jsx";
import Overview from "../pages/Admin/Overview.jsx";
// import CourseList from "../pages/Admin/components/CourseList.jsx";

export default function AdminRouter() {
    return (
        <>
            <Route
                element={
                    <ProtectedRoute allowedRoles={["admin"]} />
                }
            >
                <Route path="/admin" element={<Dashboard />}>
                    <Route path="dashboard" element={<Overview />} />

                    {/* Voucher */}
                    <Route path="vouchers" element={<VoucherList />} />
                    <Route path="vouchers/create" element={<CreateVoucher />} />
                    <Route path="vouchers/edit/:id" element={<EditVoucher />} />

                    {/* User */}
                    <Route path="user" element={<UserList />} />

                    {/* Change password */}
                    <Route path="change-password" element={<ChangePassword />} />

                    {/* Course */}
                    {/*<Route path="course" element={<CourseList />} />*/}
                </Route>
            </Route>
        </>
    )
}
