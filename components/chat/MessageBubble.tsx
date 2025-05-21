// components/chat/MessageBubble.tsx
import React, { FC } from "react";
import { Bot, User } from "lucide-react";
import { Message } from "@/hooks/useChat";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.from === "user";

  return (
    <div className={`flex items-start ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-xl flex items-end gap-2">
        {!isUser && <Bot className="flex-shrink-0 w-5 h-5 text-purple-300" />}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg border backdrop-blur-sm ${isUser
              ? "bg-purple-600 text-white border-purple-300 rounded-br-none"
              : "bg-white/10 text-white border-white/20 rounded-bl-none"
            }`}
        >
          <p className="whitespace-pre-wrap">{message.text}</p>
          <time className="block text-xs text-white/50 mt-1 text-right">
            {new Date(message.timestamp).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>
        {isUser && <User className="flex-shrink-0 w-5 h-5 text-purple-300" />}
      </div>
    </div>
  );
};

export default MessageBubble;
