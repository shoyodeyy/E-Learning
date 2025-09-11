import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { apiUrl } from "../services/http.jsx";
import ChatButton from "./ChatbotButton.jsx";
import ChatDrawer from "./ChatbotDrawer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Chatbox() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    // Persist session per-user to avoid cross-account leakage
    const storageKey = user?.id ? `chat_session_id:${user.id}` : "chat_session_id";
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);
    const assistantIndexRef = useRef(null);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);

    // Load session id for current user when mounted or user changes
    useEffect(() => {
        try {
            const id = localStorage.getItem(storageKey);
            setSessionId(id || null);
        } catch (_) {
            setSessionId(null);
        }
        // Reset chat UI when switching accounts
        setMessages([]);
        setIsTyping(false);
    }, [storageKey]);

    // If no session in storage, try to load the latest session from server when opening chat
    useEffect(() => {
        if (!isOpen) return;
        if (sessionId) return; // already have
        const token = localStorage.getItem("auth_token");
        if (!token) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`${apiUrl}/chat/sessions`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                if (!res.ok) return;
                const sessions = await res.json();
                if (cancelled) return;
                if (Array.isArray(sessions) && sessions.length > 0) {
                    const latestId = sessions[0]?.id;
                    if (latestId) {
                        setSessionId(String(latestId));
                        try { localStorage.setItem(storageKey, String(latestId)); } catch (_) {}
                    }
                }
            } catch (e) {
                // ignore
            }
        })();
        return () => { cancelled = true; };
    }, [isOpen, sessionId, storageKey]);

    useEffect(() => {
        if (isHistoryLoading) return;
        const behavior = isTyping ? "smooth" : "auto";
        messagesEndRef.current?.scrollIntoView({ behavior });
    }, [messages, isTyping, isHistoryLoading]);


    useEffect(() => {
        if (!isHistoryLoading) {
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        }
    }, [isHistoryLoading]);

    // Load lịch sử khi mở chat (hiển thị loading, tránh cuộn gây rối mắt)
    useEffect(() => {
        if (!isOpen || !sessionId || isTyping || messages.length > 0) return;

        const token = localStorage.getItem("auth_token");
        setIsHistoryLoading(true);
        fetch(`${apiUrl}/chat/${sessionId}/history`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
                Accept: "application/json",
            },
        })
            .then(async (res) => {
                if (!res.ok) {
                    // Invalid or unauthorized session for this user → clear it
                    setSessionId(null);
                    try { localStorage.removeItem(storageKey); } catch (_) {}
                    return { messages: [] };
                }
                return res.json();
            })
            .then((data) => {
                setMessages(data.messages || []);
            })
            .finally(() => setIsHistoryLoading(false));
    }, [isOpen, sessionId, isTyping, messages.length, storageKey]);

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
        let lastIndex = 0; // reserved for future chunk tracking
        let sseBuffer = ""; // carry over partial chunks between progress events
        // Pre-create assistant bubble to avoid race with history effect and ensure first reply slot exists
        assistantIndexRef.current = null;
        setMessages((prev) => {
            const idx = prev.length;
            assistantIndexRef.current = idx;
            return [...prev, { ...assistantMsg }];
        });

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
                            try { localStorage.setItem(storageKey, id); } catch (_) {}
                        }
                        continue;
                    }
                    assistantMsg.content += payload;
                    setMessages((prev) => {
                        const copy = [...prev];
                        const idx = assistantIndexRef.current ?? prev.length - 1;
                        if (!copy[idx]) {
                            // Fallback: create slot if missing
                            copy.push({ role: "assistant", content: assistantMsg.content });
                            assistantIndexRef.current = copy.length - 1;
                        } else {
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
