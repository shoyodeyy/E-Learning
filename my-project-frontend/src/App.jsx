import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import StudentRouter from "./routes/StudentRouter.jsx";
import AdminRouter from "./routes/AdminRouter.jsx";
import OrganizerRouter from "./routes/OrganizerRouter.jsx";
import NotFound from "./pages/NotFound.jsx";
import Forbidden from "./pages/Forbidden.jsx";
import VerificationResult from "./pages/VerificationResult.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Footer from "./components/Footer.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import EventsPage from "./pages/Events.jsx";
import EventDetailPage from "./pages/EventDetail.jsx";
import Home from "./pages/Home.jsx";
import GuestRoute from "./routes/GuestRoute.jsx";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="flex flex-col min-h-screen">
                    {/* Header */}

                    {/* Main */}
                    <main className="flex-grow">
                        <Routes>
                            {/* Student routes */}
                            {StudentRouter()}

                            {/* Admin routes */}
                            {AdminRouter()}

                            {/* Instructor routes */}
                            {OrganizerRouter()}

                            {/* Common */}
                            <Route path="/" element={<Home />} />
                            <Route path="/event" element={<EventsPage />} />
                            <Route path="/event/:id" element={<EventDetailPage />} />

                            <Route element={<GuestRoute />}>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                            </Route>

                            <Route path="/user/forgot-password" element={<ForgotPassword />} />
                            <Route path="/user/reset-password" element={<ResetPassword />} />

                            <Route path="/about-us" element={<AboutUs />} />

                            {/* Email verification routes */}
                            <Route path="/email-verification-result" element={<VerificationResult />} />

                            {/* Protected email verification page */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/verify-email" element={<VerifyEmail />} />
                            </Route>
                            <Route path="/403" element={<Forbidden />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>

                    {/* Footer */}
                    <Footer />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
