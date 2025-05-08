// app/chat/page.tsx
"use client";

import React, { FC } from "react";
import Header from "@/components/Header";
import { Bot } from "lucide-react";

import { useChat } from "@/hooks/useChat";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";

const ChatPage: FC = () => {
  const {
    messages,
    input,
    isLoading,
    handleChange,
    handleKeyDown,
    sendMessage,
    textareaRef,
    endRef,
  } = useChat("Olá! Como posso ajudar você hoje?");

  const userName = "João Silva";
  const handleLogout = () => console.log("Logout");

  return (
    <div className="flex h-screen overflow-x-hidden">
      <main className="flex-1 flex flex-col bg-gradient-to-br from-[#4C1D95] via-[#7E22CE] to-[#1E1B4B] text-white">
        <Header
          title="Chat"
          icon={<Bot className="w-6 h-6 text-purple-300" />}
          userName={userName}
          onLogout={handleLogout}
        />

        <ChatWindow messages={messages} endRef={endRef} isLoading={isLoading} />

        <ChatInput
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSend={sendMessage}
          textareaRef={textareaRef}
        />
      </main>
    </div>
  );
};

export default ChatPage;
