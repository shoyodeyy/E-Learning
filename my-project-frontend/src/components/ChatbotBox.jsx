import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { apiUrl } from "../services/http.jsx";
import ChatButton from "./ChatbotButton.jsx";
import ChatDrawer from "./ChatbotDrawer.jsx";

export default function Chatbox() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState(
        localStorage.getItem("chat_session_id") || null
    );
    const messagesEndRef = useRef(null);
    const assistantIndexRef = useRef(null);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);

    // Auto scroll xuống cuối (không cuộn trong lúc loading history)
    useEffect(() => {
        if (isHistoryLoading) return;
        const behavior = isTyping ? "smooth" : "auto";
        messagesEndRef.current?.scrollIntoView({ behavior });
    }, [messages, isTyping, isHistoryLoading]);

    // Khi vừa load xong history, cuộn tới cuối một lần, không animation
    useEffect(() => {
        if (!isHistoryLoading) {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        }
    }, [isHistoryLoading]);

    // Load lịch sử khi mở chat (hiển thị loading, tránh cuộn gây rối mắt)
    useEffect(() => {
        if (isOpen && sessionId) {
            const token = localStorage.getItem("auth_token");
            setIsHistoryLoading(true);
            setMessages([]);
            fetch(`${apiUrl}/chat/${sessionId}/history`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    Accept: "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setMessages(data.messages || []);
                })
                .finally(() => setIsHistoryLoading(false));
        }
    }, [isOpen, sessionId]);

    const sendMessage = async (rawText) => {
        if (isTyping) return; // prevent double send while streaming
        const text = (rawText ?? input) ?? "";
        if (!text.trim()) return;

        const userMsg = { role: "user", content: text };
        setMessages((prev) => [...prev, userMsg]);

        setInput("");
        setIsTyping(true);

        const url = `${apiUrl}/chat/stream`;
        const token = localStorage.getItem("auth_token");

        let assistantMsg = { role: "assistant", content: "" };
        let lastIndex = 0; // track how much of responseText we've processed
        let sseBuffer = ""; // carry over partial chunks between progress events
        assistantIndexRef.current = null;

        try {
            const controller = new AbortController();
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                    Authorization: token ? `Bearer ${token}` : undefined,
                },
                body: JSON.stringify({ message: text, session_id: sessionId || null }),
                signal: controller.signal,
            });

            if (!res.ok || !res.body) {
                console.error("HTTP error:", res.status, res.statusText);
                setIsTyping(false);
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                if (doneReading) break;
                const chunk = decoder.decode(value, { stream: true });
                sseBuffer += chunk;
                const parts = sseBuffer.split("\n\n");
                sseBuffer = parts.pop() || "";
                for (const part of parts) {
                    // SSE event may contain multiple data: lines → join with \n
                    const lines = part.split("\n");
                    const dataLines = [];
                    for (let ln of lines) {
                        if (!ln.startsWith("data:")) continue;
                        let after = ln.slice(5);
                        if (after.startsWith(" ")) after = after.slice(1); // strip single space after colon
                        dataLines.push(after);
                    }
                    if (dataLines.length === 0) continue;
                    const payload = dataLines.join("\n");
                    if (payload.startsWith("__PROVIDER:")) {
                        console.log("AI Provider:", payload.split(":")[1]);
                        continue;
                    }
                    if (payload === "[DONE]") {
                        setIsTyping(false);
                        done = true;
                        try { await reader.cancel(); } catch (_) {}
                        break;
                    }
                    if (payload.startsWith("[ERROR]")) {
                        console.error(payload);
                        setIsTyping(false);
                        done = true;
                        try { await reader.cancel(); } catch (_) {}
                        break;
                    }
                    if (payload.startsWith("__SESSION:")) {
                        const id = payload.split(":")[1];
                        if (id) {
                            setSessionId(id);
                            localStorage.setItem("chat_session_id", id);
                        }
                        continue;
                    }
                    assistantMsg.content += payload;
                    setMessages((prev) => {
                        if (assistantIndexRef.current === null) {
                            assistantIndexRef.current = prev.length;
                            return [...prev, { ...assistantMsg }];
                        }
                        const copy = [...prev];
                        const idx = assistantIndexRef.current;
                        if (copy[idx]) {
                            copy[idx] = { ...copy[idx], content: assistantMsg.content };
                        }
                        return copy;
                    });
                }
            }
            setIsTyping(false);
        } catch (err) {
            console.error("Fetch stream error:", err);
            setIsTyping(false);
        }
    };

    return (
        <>
            {!isOpen && <ChatButton onClick={() => setIsOpen(true)} />}

            <AnimatePresence>
                {isOpen && (
                    <ChatDrawer
                        onClose={() => setIsOpen(false)}
                        messages={messages}
                        input={input}
                        setInput={setInput}
                        onSend={sendMessage}
                        messagesEndRef={messagesEndRef}
                        isTyping={isTyping}
                        isHistoryLoading={isHistoryLoading}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
