import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./assets/css/index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ToastContainer limit={5} />
        <App />
    </GoogleOAuthProvider>
);
