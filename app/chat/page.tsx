/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";
import StressMeter from "@/components/StressMeter";
import StressChart from "@/components/StressChart";
import ChatSidebar from "@/components/ChatSidebar";

export default function ChatPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef=useRef<HTMLDivElement | null>(null);
  const [analytics,setAnalytics]=useState<any>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const loadSessions = async () => {
    const res = await fetch("/api/sessions");
    if (!res.ok) {
      console.error("Failed to load sessions");
      return;
    }

    const data = await res.json();
    setSessions(data);
  };

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
        body: JSON.stringify({message,sessionId: activeSession || undefined}),
      });
      const data = await res.json();
      if(!activeSession && data.sessionId){
        setActiveSession(data.sessionId);
      }
      await loadSessions();
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

  const loadMessages = async (sessionId: string) => {
    const res = await fetch(`/api/session/${sessionId}`);
    const data = await res.json();

    setMessages(data);
  };

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSessions();
    loadAnalytics();
  }, []);

  const deleteChat = async (id:string)=>{
    await fetch(`/api/session/${id}/delete`,{method:"DELETE"});
    if (activeSession === id) {
      setActiveSession(null);
      setMessages([]);
    }
    await loadSessions();
  }

  const renameChat = async (id: string) => {
    const title = prompt("New chat name");
    if (!title) return;
    const res = await fetch(`/api/session/${id}/rename`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Rename failed:", data);
      return;
    }
    await loadSessions();
  };

  return (
    <div className="h-screen flex">

      <ChatSidebar sessions={sessions} activeSession={activeSession} onSelect={id=>{setActiveSession(id);loadMessages(id)}} 
      onNew={()=>{setActiveSession(null);setMessages([]);}} 
      renameChat={renameChat} deleteChat={deleteChat}/>

      <div className="flex-1 flex flex-col p-8">
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

      
    </div>
  );
}