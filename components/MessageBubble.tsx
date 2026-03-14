import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

type Props = {
  role: "user" | "ai";
  text: string;
};

export default function MessageBubble({ role, text }: Props) {
  const isUser = role === "user";

  return (
    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.25}} 
    className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[65%] p-3 rounded-lg  ${
          isUser ? "bg-linear-to-br from-blue-600 via-blue-500 to-blue-600 text-white" : "bg-linear-to-br from-gray-800 via-gray-700 to-gray-800 text-gray-100"
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
    </motion.div>
  );
}