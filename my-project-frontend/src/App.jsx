import {BrowserRouter, Route, Routes} from "react-router-dom";

import StudentRouter from "./routes/StudentRouter.jsx";
import AdminRouter from "./routes/AdminRouter.jsx";
import InstructorRouter from "./routes/InstructorRouter.jsx";
import NotFound from "./pages/NotFound.jsx";
import Forbidden from "./pages/Forbidden.jsx";
import VerificationResult from "./pages/VerificationResult.jsx";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            {/* Student routes */}
            {StudentRouter()}

            {/* Admin routes */}
            {AdminRouter()}

            {/* Instructor routes */}
            {InstructorRouter()}

            {/* Common */}
            <Route path="/email-verification-result" element={<VerificationResult />} />
            <Route path="/403" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App