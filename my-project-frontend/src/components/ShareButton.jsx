import { useState } from "react";
import { X } from "lucide-react";
import { FaFacebook, FaWhatsapp, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import { generateShareLinks } from "./generateShareLinks";

export default function ShareButton({ event, children }) {
  const [open, setOpen] = useState(false);

  const baseUrl = "https://shareEvents.loca.lt"; // hoặc process.env.REACT_APP_SHARE_URL
  const links = generateShareLinks(event, baseUrl);

  // Map platform -> icon + màu
  const platformIcons = {
    facebook: { icon: <FaFacebook className="text-blue-600 w-5 h-5" />, name: "Facebook" },
    whatsapp: { icon: <FaWhatsapp className="text-green-500 w-5 h-5" />, name: "WhatsApp" },
    linkedin: { icon: <FaLinkedin className="text-blue-700 w-5 h-5" />, name: "LinkedIn" },
    twitter: { icon: <FaTwitter className="text-sky-500 w-5 h-5" />, name: "Twitter (X)" },
    email: { icon: <FaEnvelope className="text-gray-600 w-5 h-5" />, name: "Email" },
  };

  return (
    <>
      {/* Nút do component cha truyền vào */}
      <div onClick={() => setOpen(true)} className="inline-block">
        {children}
      </div>

      {/* Popup chọn nền tảng */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-80 shadow-2xl relative border border-gray-100"
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
              Share Event
            </h2>

            {/* Share buttons */}
            <div className="flex flex-col gap-3">
              {Object.entries(links).map(([key, { url }]) => (
                <button
                  key={key}
                  onClick={() => window.open(url, "_blank")}
                  className="flex items-center gap-3 w-full py-3 px-4 rounded-xl font-medium shadow-sm border border-gray-200 
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
