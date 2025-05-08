// components/chat/ChatWindow.tsx
import React, { FC } from "react";
import { ChatWindowProps } from "@/types/chat";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const ChatWindow: FC<ChatWindowProps> = ({ messages, endRef, isLoading }) => (
  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" role="log" aria-live="polite">
    {messages.map((msg) => (
      <MessageBubble key={msg.id} message={msg} />
    ))}
    {isLoading && <TypingIndicator />}
    <div ref={endRef} />
  </div>
);

export default ChatWindow;