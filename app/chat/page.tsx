/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";
<<<<<<< HEAD
import StressMeter from "@/components/StressMeter";
import StressChart from "@/components/StressChart";
=======
>>>>>>> origin/main

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef=useRef<HTMLDivElement | null>(null);
<<<<<<< HEAD
  const [analytics,setAnalytics]=useState<any>(null);
=======
>>>>>>> origin/main

  const sendMessage = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "ai", text: data.aiReply },
    ]);

    setLoading(false);
    setMessage("");
  };
  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages]);

<<<<<<< HEAD
  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => setAnalytics(data));
  }, []);

  return (
    <div className="mx-auto h-screen flex flex-col p-8">
      <h1 className="text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-linear-to-r from-gray-100 to-gray-500">
        MindScope AI
      </h1>

      <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-black chat-scroll">
        {analytics && (
          <div className="mb-6">
            <StressMeter score={analytics.avgStress} />

            <StressChart data={analytics.stressTimeline} />
          </div>
        )}
=======
  return (
    <div className="max-w-3xl mx-auto h-screen flex flex-col p-6">
      <h1 className="text-3xl mb-6">MindScope AI</h1>

      <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-black chat-scroll">
>>>>>>> origin/main
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} text={m.text} />
        ))}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <input
          className="border p-3 flex-1 rounded-lg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key==="Enter") sendMessage();
          }}
          placeholder="Tell me how you're feeling..."
        />

        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}