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
  const [recording,setRecording]=useState(false);

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
    window.speechSynthesis.cancel();
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


  const sendMessageWithText=async(customText: string)=>{
    if (!customText.trim()) return;
    setMessages((prev)=>[...prev,{ role:"user",text:customText}]);
    setLoading(true);
    try {
      const res=await fetch("/api/chat",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: customText,
          sessionId: activeSession || undefined,
        }),
      });

      const data=await res.json();

      if(!activeSession && data.sessionId){
        setActiveSession(data.sessionId);
      }

      await loadSessions();

      setMessages((prev)=>[
        ...prev,
        { role: "ai", text: data.aiReply },
      ]);

      await loadAnalytics();
    } catch(err){
      console.error(err);
    }

    setLoading(false);
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    window.speechSynthesis.cancel();

    if(recording){
      mediaRecorderRef.current?.stop();
      setRecording(false);
      return;
    }

    if (recording) {
      mediaRecorderRef.current?.stop();
      setRecording(false);
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      const formData = new FormData();
      formData.append("audio", audioBlob);

      const res = await fetch("/api/audio", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.text) {
        sendMessageWithText(data.text);
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  return (
    <div className="h-screen flex bg-linear-to-bl from-black via-gray-900 to-black">

      <ChatSidebar sessions={sessions} activeSession={activeSession} onSelect={id=>{setActiveSession(id);loadMessages(id)}} 
      onNew={()=>{setActiveSession(null);setMessages([]);}} 
      renameChat={renameChat} deleteChat={deleteChat}/>

      <div className="flex-1 flex flex-col p-8">
        <h1 className="text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-linear-to-r from-gray-100 to-gray-500">
          MindScope AI
        </h1>
        <div className="flex-1 overflow-y-auto border border-white/20 rounded-lg p-4 bg-linear-to-tr from-black via-black/50 to-black chat-scroll">
          {showAnalytics && analytics && (
            <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
              <div className="bg-linear-to-tr from-black via-gray-950 to-black  p-6 rounded-xl w-[80%] md:w-[60%]">
                <h2 className="text-xl mb-4 text-center fot-bold bg-clip-text text-transparent bg-linear-to-r from-gray-100 to-gray-500">Stress Analytics</h2>

                <StressMeter score={analytics.avgStress} />
                <StressChart data={analytics.stressTimeline} />

                <button
                  className="mt-4 bg-red-500 hover:bg-red-500/50 px-4 py-2 rounded cursor-pointer"
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
            className="border p-3 flex-1 rounded-lg border-white/20 focus:outline-none  focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 placeholder:text-gray-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e)=>{
              if(e.key==="Enter"){
                if(recording){
                  mediaRecorderRef.current?.stop();
                  setRecording(false);
                }
                window.speechSynthesis.cancel();
                sendMessage();
              }
            }}
            placeholder="Tell me how you're feeling..."
          />

          <button className="bg-gray-700 hover:bg-gray-500 transition text-white px-4 py-2 rounded-lg cursor-pointer" onClick={() => setShowAnalytics(!showAnalytics)}>📊</button>

          <button className={`bg-gray-700 hover:bg-gray-500 transition text-white px-4 py-2 rounded-lg cursor-pointer
              ${recording?"bg-red-500":"bg-green-600"}
            `} onClick={startRecording} >
              🎤
            </button>

          <button
            className="bg-blue-600 hover:bg-blue-500 transition text-white px-6 py-2 rounded-lg cursor-pointer"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>

      
    </div>
  );
}