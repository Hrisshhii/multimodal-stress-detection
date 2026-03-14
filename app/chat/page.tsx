/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";
import StressMeter from "@/components/StressMeter";
import StressChart from "@/components/StressChart";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef=useRef<HTMLDivElement | null>(null);
  const [analytics,setAnalytics]=useState<any>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const loadAnalytics = async () => {
    const res = await fetch("/api/dashboard");
    const data = await res.json();
    setAnalytics(data);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setLoading(true);
    try {
      const res=await fetch("/api/chat",{
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
      await loadAnalytics();
    }catch(err){
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong. Please try again." },
      ]);
    }

    setLoading(false);
    setMessage("");
  };

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAnalytics();
  }, []);

  return (
    <div className="mx-auto h-screen flex flex-col p-8">
      <h1 className="text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-linear-to-r from-gray-100 to-gray-500">
        MindScope AI
      </h1>

      <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-black chat-scroll">
        {showAnalytics && analytics && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-xl w-200">
              <h2 className="text-xl mb-4">Stress Analytics</h2>

              <StressMeter score={analytics.avgStress} />
              <StressChart data={analytics.stressTimeline} />

              <button
                className="mt-4 bg-red-500 px-4 py-2 rounded cursor-pointer"
                onClick={() => setShowAnalytics(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

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

        <button className="bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer" onClick={() => setShowAnalytics(!showAnalytics)}>📊</button>

        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}