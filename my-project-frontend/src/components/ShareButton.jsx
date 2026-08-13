import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { FaFacebook, FaWhatsapp, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import { generateShareLinks } from "./generateShareLinks";

export default function ShareButton({ event, children }) {
    const [open, setOpen] = useState(false);

    const baseUrl = useMemo(() => {
        if (typeof window === "undefined") return import.meta.env.VITE_PUBLIC_URL || "";

        // Ưu tiên URL public nếu có (prod)
        if (import.meta.env.VITE_PUBLIC_URL) return String(import.meta.env.VITE_PUBLIC_URL).replace(/\/$/, "");

        const { protocol, hostname, port, origin } = window.location;
        const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";

        // chuyển localhost sang IP mạng cục bộ nếu đang ở môi trường local
        if (import.meta.env.DEV && isLocalHost) {
            const devHost = import.meta.env.VITE_DEV_NETWORK_HOST;
            if (devHost && devHost !== "localhost") {
                const p = port ? `:${port}` : "";
                return `${protocol}//${devHost}${p}`.replace(/\/$/, "");
            }
        }

        // Mặc định: giữ nguyên origin hiện tại
        return origin.replace(/\/$/, "");
    }, []);
    const links = generateShareLinks(event, baseUrl);

    // Map platform -> icon + màu
    const platformIcons = {
        twitter: { icon: <FaTwitter className="text-sky-500 w-5 h-5" />, name: "Twitter (X)" },
        email: { icon: <FaEnvelope className="text-gray-600 w-5 h-5" />, name: "Email" },
        facebook: { icon: <FaFacebook className="text-blue-600 w-5 h-5" />, name: "Facebook" },
        whatsapp: { icon: <FaWhatsapp className="text-green-500 w-5 h-5" />, name: "WhatsApp" },
        linkedin: { icon: <FaLinkedin className="text-blue-700 w-5 h-5" />, name: "LinkedIn" },
    };

    const order = ["twitter", "email"];

    const orderedKeys = [
        ...order.filter((k) => links[k]), // đưa twitter, email lên đầu nếu có
        ...Object.keys(links).filter((k) => !order.includes(k)), // các key còn lại
    ];

    return (
        <>
            {/* Nút do component cha truyền vào */}
            <div onClick={() => setOpen(true)} className="inline-block">
                {children}
            </div>

            {/* Popup chọn nền tảng */}
            {open && (
                <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-80 shadow-2xl relative border border-gray-100">
                        {/* Close button */}
                        <button onClick={() => setOpen(false)} className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>

                        {/* Title */}
                        <h2 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                            Share Event
                        </h2>

                        {/* Share buttons */}
                        <div className="flex flex-col gap-3">
                            {orderedKeys.map((key) => (
                                <button
                                    key={key}
                                    onClick={() => window.open(links[key].url, "_blank")}
                                    className="cursor-pointer flex items-center gap-3 w-full py-3 px-4 rounded-xl font-medium shadow-sm border border-gray-200 
                 bg-gradient-to-r from-gray-50 to-gray-100 
                 hover:from-fuchsia-50 hover:to-pink-50 hover:border-fuchsia-300 
                 transition-all duration-200 text-left"
                                >
                                    {platformIcons[key]?.icon}
                                    <span>{platformIcons[key]?.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
