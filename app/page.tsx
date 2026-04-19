"use client";

import { useEffect, useState } from "react";

import VideoEmotion from "@/components/VideoEmotion";

import ChatSidebar from "@/components/ChatSidebar";

import StressChart from "@/components/StressChart";
import StressMeter from "@/components/StressMeter";

export default function Home() {

  // ✅ MOVE HOOKS INSIDE COMPONENT
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  // ✅ HANDLERS INSIDE COMPONENT
  const handleNewChat = () => {
    const newChat = {
      _id: Date.now().toString(),
      title: "New Chat",
    };

    setSessions((prev) => [newChat, ...prev]);
    setActiveSession(newChat._id);
  };

  const handleSelect = (id: string) => {
    setActiveSession(id);
  };

  const handleRename = (id: string) => {
    const name = prompt("Enter new name");
    if (!name) return;

    setSessions((prev) =>
      prev.map((s) => (s._id === id ? { ...s, title: name } : s))
    );
  };

  const handleDelete = (id: string) => {
    setSessions((prev) => prev.filter((s) => s._id !== id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Dashboard error");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ display: "flex", height: "100vh" }}>

      {/* LEFT → CHAT */}
      <ChatSidebar
        sessions={sessions}
        activeSession={activeSession}
        onSelect={handleSelect}
        onNew={handleNewChat}
        renameChat={handleRename}
        deleteChat={handleDelete}
      />

      {/* RIGHT → MAIN */}
      <div style={{ flex: 1, textAlign: "center", marginTop: "20px" }}>
        <h1>Multimodal stress detection</h1>

        <VideoEmotion />
       

        {data && (
          <>
            <StressMeter score={data.avgStress} />
            <StressChart data={data.stressTimeline} />
          </>
        )}
      </div>
    </main>
  );
}