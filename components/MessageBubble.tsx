import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { useRef } from "react";

type Props = {
  role: "user" | "ai";
  text: string;
};

export default function MessageBubble({ role, text }: Props) {
  const isUser=role==="user";

  const fallbackSpeak = (text: string) => {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";

    const voices = window.speechSynthesis.getVoices();

    // Try better voice
    speech.voice =
      voices.find((v) => v.name.includes("Google")) ||
      voices.find((v) => v.name.includes("Microsoft")) ||
      voices[0];

    speech.rate = 0.95;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  const audioRef=useRef<HTMLAudioElement | null>(null);

  const speak=async()=>{
    try {
      const res=await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if(!res.ok){
        throw new Error("TTS failed");
      }

      const blob=await res.blob();
      if (blob.size<1000) {
        throw new Error("Invalid audio");
      }

      const url=URL.createObjectURL(blob);
      const audio=new Audio(url);
      audioRef.current=audio;
      await audio.play();
    } catch(err){
      console.warn("Using fallback voice!");
      console.log(err);
      fallbackSpeak(text);
    }
  };

  const stop=()=>{
    audioRef.current?.pause();
    window.speechSynthesis.cancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className="flex flex-col max-w-[65%] group">
        
        <div
          className={`p-3 rounded-lg ${
            isUser
              ? "bg-linear-to-br from-blue-600 via-blue-500 to-blue-600 text-white"
              : "bg-linear-to-br from-gray-800 via-gray-700 to-gray-800 text-gray-100"
          }`}
        >
          {isUser ? (
            text
          ) : (
            <div className="prose prose-invert">
              <ReactMarkdown>{text}</ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && (
          <div className="opacity-0 group-hover:opacity-100 flex gap-3 mt-1 text-xs text-gray-400 transition">
            <button
              onClick={speak}
              className="hover:text-blue-400 transition cursor-pointer"
            >
              🔊 Speak
            </button>

            <button
              onClick={stop}
              className="hover:text-red-400 transition cursor-pointer"
            >
              ⏹ Stop
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}