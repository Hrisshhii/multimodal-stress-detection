import { useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = {
  sessions: any[];
  activeSession: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  renameChat:(id:string)=>void;
  deleteChat:(id:string)=>void;
};

export default function ChatSidebar({sessions,activeSession,onSelect,onNew,renameChat,deleteChat}: Props) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const toggleMenu=(id: string)=>{
    setMenuOpen(menuOpen === id ? null : id);
  };
  return (
    <div className="w-72 bg-linear-to-b from-gray-900 to-black p-4 border-r border-gray-800 flex flex-col">
      <button
        className="w-full mb-4 bg-blue-600 hover:bg-blue-500 transition py-2 rounded-lg font-medium cursor-pointer"
        onClick={onNew}
      >
        + New Chat
      </button>
      <div className="flex-1 overflow-y-auto space-y-2 chat-scroll">
        {sessions.map((s) => (
          <div
            key={s._id}
            onClick={() => onSelect(s._id)}
            className={`p-3 rounded-lg cursor-pointer transition ${
              activeSession === s._id ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm truncate">{s.title || "New Chat"}</p>
              <button onClick={(e) => {e.stopPropagation();
                  toggleMenu(s._id);
                }}
                className="text-gray-400 hover:text-white"
              >
                ⋯
              </button>
            </div>
            {menuOpen === s._id && (
              <div className="bg-gray-800 rounded p-2 text-sm mt-1 space-y-1">
                <button
                  className="block w-full text-left hover:text-blue-400"
                  onClick={(e) => {e.stopPropagation();renameChat(s._id);}}
                >
                  Rename
                </button>

                <button
                  className="block w-full text-left hover:text-red-400"
                  onClick={(e) => {e.stopPropagation();deleteChat(s._id);}}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
        
      </div>
    </div>
  );
}