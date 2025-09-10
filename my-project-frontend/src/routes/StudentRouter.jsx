import {Route} from "react-router-dom";

import Dashboard from "../pages/Dashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function StudentRouter() {
    return (
        <>
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
        </>
    )
}