// app/chat/page.tsx
"use client";

import React, { FC, useState, useRef, useLayoutEffect, useCallback } from "react";
import Header from "@/components/Header";
import { Bot, User, Send } from "lucide-react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
export interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
  timestamp: string;
}

// -----------------------------------------------------------------------------
// useChat Hook
// -----------------------------------------------------------------------------
function useChat(initialPrompt: string) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      from: "bot",
      text: initialPrompt,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    // Empilha mensagem do usuário
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), from: "user", text, timestamp: new Date().toISOString() },
    ]);
    setInput("");

    try {
      // Chama a rota Next.js
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });
      const payload = await res.json();
      const botText = res.ok
        ? payload.answer
        : `Erro ${res.status}: ${payload.error || payload.message}`;

      // Empilha resposta do bot
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), from: "bot", text: botText, timestamp: new Date().toISOString() },
      ]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), from: "bot", text: 'Não foi possível conectar ao servidor.', timestamp: new Date().toISOString() },
      ]);
    }
  }, [input]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  useLayoutEffect(() => {
    resizeTextarea();
  }, [input, resizeTextarea]);

  useLayoutEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return { messages, input, handleChange, handleKeyDown, sendMessage, textareaRef, endRef };
}

// -----------------------------------------------------------------------------
// ChatPage Component
// -----------------------------------------------------------------------------
const ChatPage: FC = () => {
  const { messages, input, handleChange, handleKeyDown, sendMessage, textareaRef, endRef } =
    useChat("Olá! Como posso ajudar você hoje?");

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

        <ChatWindow messages={messages} endRef={endRef} />

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

// -----------------------------------------------------------------------------
// ChatWindow Component
// -----------------------------------------------------------------------------
interface ChatWindowProps {
  messages: Message[];
  endRef: React.RefObject<HTMLDivElement | null>;
}
const ChatWindow: FC<ChatWindowProps> = ({ messages, endRef }) => (
  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4" role="log" aria-live="polite">
    {messages.map((msg) => (
      <MessageBubble key={msg.id} message={msg} />
    ))}
    <div ref={endRef} />
  </div>
);

// -----------------------------------------------------------------------------
// MessageBubble Component
// -----------------------------------------------------------------------------
interface MessageBubbleProps {
  message: Message;
}
const MessageBubble: FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.from === "user";
  return (
    <div className={`flex items-start ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-xl flex items-end gap-2">
        {!isUser && <Bot className="w-5 h-5 text-purple-300" />}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg border backdrop-blur-sm ${
            isUser
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
        {isUser && <User className="w-5 h-5 text-purple-300" />}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// ChatInput Component
// -----------------------------------------------------------------------------
interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}
const ChatInput: FC<ChatInputProps> = ({ value, onChange, onKeyDown, onSend, textareaRef }) => (
  <div className="px-6 py-4 border-t border-white/10">
    <div className="flex items-center gap-4">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="flex-1 bg-white/90 text-black px-6 py-3 rounded-xl resize-none placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[48px] max-h-40 overflow-y-auto transition-all"
        placeholder="Digite sua mensagem..."
        rows={1}
        aria-label="Digite sua mensagem"
      />
      <button
        onClick={onSend}
        disabled={!value.trim()}
        className="p-3 rounded-full bg-purple-700 hover:bg-purple-800 disabled:opacity-50 transition-shadow shadow-md hover:shadow-lg"
        aria-label="Enviar mensagem"
      >
        <Send className="w-5 h-5 text-white" />
      </button>
    </div>
  </div>
);
