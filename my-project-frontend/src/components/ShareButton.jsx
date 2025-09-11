import { useState } from "react";
import { Share2, X } from "lucide-react";
import { generateShareLinks } from "./generateShareLinks";

export default function ShareButton({ event }) {
  const [open, setOpen] = useState(false);

  const baseUrl = "https://shareEvents.loca.lt"; // hoặc process.env.REACT_APP_SHARE_URL
  const links = generateShareLinks(event, baseUrl);

  return (
    <>
      {/* Nút Share */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <Share2 className="w-5 h-5" />
        Share
      </button>

      {/* Popup chọn nền tảng */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-72 shadow-xl relative"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4">Chia sẻ sự kiện</h2>
            <div className="flex flex-col gap-3">
              {Object.entries(links).map(([key, { name, url }]) => (
                <button
                  key={key}
                  onClick={() => window.open(url, "_blank")}
                  className="w-full bg-gray-100 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
