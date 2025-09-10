import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";

import StudentRouter from "./routes/StudentRouter.jsx";
import AdminRouter from "./routes/AdminRouter.jsx";
import InstructorRouter from "./routes/InstructorRouter.jsx";
import NotFound from "./pages/NotFound.jsx";
import Forbidden from "./pages/Forbidden.jsx";
import VerificationResult from "./pages/VerificationResult.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Student routes */}
                    {StudentRouter()}

                    {/* Admin routes */}
                    {AdminRouter()}

                    {/* Instructor routes */}
                    {InstructorRouter()}

                    {/* Common */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/user/forgot-password" element={<ForgotPassword />} />
                    <Route path="/user/reset-password" element={<ResetPassword />} />

                    {/* Email verification routes */}
                    <Route path="/email-verification-result" element={<VerificationResult />} />

                    {/* Protected email verification page */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/verify-email" element={<VerifyEmail />} />
                    </Route>
                    <Route path="/403" element={<Forbidden/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App