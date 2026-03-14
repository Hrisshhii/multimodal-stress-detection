import { useEffect, useRef, useState } from "react";

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
  const sidebarRef=useRef<HTMLDivElement|null>(null);
  const toggleMenu=(id: string)=>{
    setMenuOpen(menuOpen === id ? null : id);
  };

  useEffect(()=>{
    function handleClickOutSide(event:MouseEvent){
      if(
        sidebarRef.current && !sidebarRef.current.contains(event.target as Node)
      ){
        setMenuOpen(null);
      }
    }
    document.addEventListener("mousedown",handleClickOutSide);
    return ()=>{
      document.removeEventListener("mousedown",handleClickOutSide);
    };
  },[])
  return (
    <div className="w-72 bg-linear-to-b from-black via-gray-950 to-black p-4 border-r border-gray-800 flex flex-col" ref={sidebarRef}>
      <button
        className="w-full mb-4 bg-blue-600 hover:bg-blue-500 transition py-2 rounded-lg font-medium cursor-pointer hover:scale-95"
        onClick={onNew}
      >
        + New Chat
      </button>
      <div className="flex-1 overflow-y-auto space-y-2 chat-scroll">
        {sessions.map((s) => (
          <div key={s._id}
            onClick={() => onSelect(s._id)}
            className={`p-3 border border-white/10 rounded-lg hover:scale-98 cursor-pointer transition ${
              activeSession === s._id ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm truncate">{s.title || "New Chat"}</p>
              <button onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu(s._id);
                }}
                className="text-gray-400 hover:text-white cursor-pointer hover:scale-120 transition"
              >
                ⋯
              </button>
            </div>
            {menuOpen === s._id && (
              <div className="bg-gray-800 rounded p-2 text-[0.8rem] mt-1 space-y-2">
                <button
                  className="block w-full hover:text-blue-400 text-center cursor-pointer hover:scale-120 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    renameChat(s._id);
                  }}
                >
                  Rename
                </button>

                <button
                  className="block w-full text-center hover:text-red-400 cursor-pointer hover:scale-120 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(s._id);
                  }}
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