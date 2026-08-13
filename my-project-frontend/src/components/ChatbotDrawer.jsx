import { motion } from "framer-motion";
import MessageBubble from "./ChatbotMessageBubble";

export default function ChatDrawer({
                                       onClose,
                                       messages,
                                       input,
                                       setInput,
                                       onSend,
                                       messagesEndRef,
                                       isTyping,
                                       isHistoryLoading,
                                   }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 w-[92vw] max-w-sm sm:w-80 md:w-96 h-[60vh] sm:h-[500px] bg-white shadow-xl rounded-xl flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between bg-purple-600 text-white p-3 rounded-t-xl">
                <div className="flex items-center gap-2">
                    <img src="/icon/chatbot.png" alt="Chatbot" className="w-6 h-6" />
                    <span className="font-semibold">Chatbot</span>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close chat"
                    className="p-1 rounded hover:bg-purple-500/30"
                >
                    <img src="/icon/closeChatbot.png" alt="Close" className="w-5 h-5" />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
                {isHistoryLoading ? (
                    <div className="space-y-3 animate-pulse">
                        <div className="flex justify-start">
                            <div className="bg-gray-100 h-4 rounded w-3/5" />
                        </div>
                        <div className="flex justify-end">
                            <div className="bg-purple-100 h-4 rounded w-1/2" />
                        </div>
                        <div className="flex justify-start">
                            <div className="bg-gray-100 h-4 rounded w-4/5" />
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, i) => (
                            <MessageBubble key={i} role={msg.role} content={msg.content} />
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="text-left">
                                <div className="inline-block bg-gray-100 p-2 rounded-lg max-w-[60%] italic text-gray-500">
                                    Compiling...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t flex items-center gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            const text = input;
                            if (!text.trim()) return;
                            setInput("");
                            onSend(text);
                        }
                    }}
                    placeholder="Enter message..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                    type="button"
                    onClick={() => {
                        const text = input;
                        if (!text.trim() || isTyping) return;
                        setInput("");
                        onSend(text);
                    }}
                    disabled={isTyping || !input.trim()}
                    aria-label="Send message"
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    <img src="/icon/sendChatbot.png" alt="Send" className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}
