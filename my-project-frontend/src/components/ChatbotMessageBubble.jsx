export default function MessageBubble({ role, content }) {
    const isUser = role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`inline-block px-3 py-2 rounded-2xl max-w-[90%] md:max-w-[80%] whitespace-pre-line break-words leading-6 overflow-x-hidden text-left ${
                    isUser
                        ? "bg-purple-100 rounded-br-sm"
                        : "bg-gray-100 rounded-bl-sm"
                }`}
            >
                {content}
            </div>
        </div>
    );
}
