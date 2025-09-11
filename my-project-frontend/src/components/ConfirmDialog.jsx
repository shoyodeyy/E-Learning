import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
    return (
        <AnimatePresence>
            {open && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                    onClick={onCancel}
                >
                    {/* Dialog box */}
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-gray-800 mb-6">{message}</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={onCancel} className="cursor-pointer px-4 py-2 rounded-xl bg-red-400 hover:bg-red-600 text-white">
                                Cancel
                            </button>
                            <button onClick={onConfirm} className="cursor-pointer px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300">
                                Ok
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
