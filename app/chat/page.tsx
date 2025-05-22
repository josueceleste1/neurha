"use client";

import React, { FC, useState, useRef, useEffect } from "react";
import Header from "@/components/ui/Header";
import { Bot, Search, Upload, Palette, History } from "lucide-react";

import { useChat } from "@/hooks/useChat";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import type { Assistant, ChatHistory } from "@/types/chat";

const CHAT_API_URL = "http://localhost:3001/api/v1";

const ChatPage: FC = () => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [showAssistantSelector, setShowAssistantSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [showChatHistory, setShowChatHistory] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const assistantSelectorRef = useRef<HTMLDivElement>(null);

  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  // Busca agents do backend
  useEffect(() => {
    async function fetchAssistants() {
      try {
        const res = await fetch(`${CHAT_API_URL}/agents`);
        const data = await res.json();
        const fetched = Array.isArray(data)
          ? data.map((agent: any) => ({
            id: agent.id,
            name: agent.name,
            description: agent.description,
            greeting: agent.greeting,
          }))
          : [];
        setAssistants(fetched);
        if (fetched.length && !selectedAssistant) {
          setSelectedAssistant(fetched[0]);
        }
      } catch (err) {
        console.error("Erro ao buscar assistentes:", err);
      }
    }
    fetchAssistants();
  }, []);

  // Hook de chat
  const {
    messages,
    input,
    isLoading,
    handleChange,
    handleKeyDown,
    sendMessage,
    textareaRef,
    endRef,
  } = useChat(selectedAssistant?.greeting || "Olá! Como posso ajudar?");

  const userName = "Josué Celeste";
  const handleLogout = () => console.log("Logout");

  const changeAssistant = (assistant: Assistant) => {
    setSelectedAssistant(assistant);
    setShowAssistantSelector(false);
    setSearchTerm("");
  };

  const loadChatFromHistory = (chatId: string) => {
    console.log(`Carregando chat ${chatId}`);
    setShowChatHistory(false);
  };

  const filteredAssistants = assistants.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fecha modais ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showAssistantSelector &&
        assistantSelectorRef.current &&
        !assistantSelectorRef.current.contains(event.target as Node)
      ) {
        setShowAssistantSelector(false);
      }
      if (
        showChatHistory &&
        chatHistoryRef.current &&
        !chatHistoryRef.current.contains(event.target as Node)
      ) {
        setShowChatHistory(false);
      }
    };
    if (showAssistantSelector || showChatHistory) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAssistantSelector, showChatHistory]);

  useEffect(() => {
    if (showAssistantSelector && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showAssistantSelector]);

  return (
    <div className="flex h-screen">
      <main className="flex-1 flex flex-col bg-gradient-to-br from-[#4C1D95] via-[#7E22CE] to-[#1E1B4B]">
        <Header
          title="Chat"
          icon={<Bot className="w-6 h-6 text-purple-300" />}
          userName={userName}
          onLogout={handleLogout}
        />

        <div className="bg-white/10 border-b border-white/20 px-6 py-4 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-white truncate">
              {selectedAssistant?.name}
            </h2>
            <p className="text-sm text-white/70 mt-1 truncate">
              {selectedAssistant?.description}
            </p>
          </div>
          <div className="flex-shrink-0 ml-4 relative flex items-center">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap"
              onClick={e => {
                e.stopPropagation();
                setShowAssistantSelector(!showAssistantSelector);
                setShowChatHistory(false);
              }}
            >
              Trocar Chat
            </button>
            <div className="flex items-center space-x-2 ml-2">
              <button
                type="button"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg"
                onClick={e => {
                  e.stopPropagation();
                  setShowChatHistory(!showChatHistory);
                  setShowAssistantSelector(false);
                }}
              >
                <History className="w-5 h-5 text-white" />
              </button>
              <button
                type="button"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg"
                onClick={() => console.log("Upload clicado")}
              >
                <Upload className="w-5 h-5 text-white" />
              </button>
              <button
                type="button"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg"
                onClick={() => console.log("Configurar tema")}
              >
                <Palette className="w-5 h-5 text-white" />
              </button>
            </div>

            {showAssistantSelector && (
              <div
                ref={assistantSelectorRef}
                className="absolute right-0 top-12 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg z-10 w-64 overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-3">
                  <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-white/50" />
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Buscar chat..."
                      className="w-full pl-10 pr-3 py-2 bg-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredAssistants.length ? (
                      filteredAssistants.map(assistant => (
                        <button
                          key={assistant.id}
                          onClick={() => changeAssistant(assistant)}
                          className={`w-full text-left px-4 py-3 rounded-lg text-white hover:bg-white/20 transition ${selectedAssistant?.id === assistant.id ? 'bg-white/20' : ''
                            }`}
                        >
                          <span className="font-medium">{assistant.name}</span>
                          <span className="text-xs text-white/60 mt-1 block">{assistant.description}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-white/50 text-center">
                        Nenhum chat encontrado
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showChatHistory && (
              <div
                ref={chatHistoryRef}
                className="absolute right-0 top-12 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg z-10 w-80 overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-3">
                  <h3 className="text-white font-medium mb-2">Histórico de Conversas</h3>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {chatHistory.length ? (
                      chatHistory.map(chat => (
                        <button
                          key={chat.id}
                          onClick={() => loadChatFromHistory(chat.id)}
                          className="w-full text-left px-4 py-3 rounded-lg text-white hover:bg-white/20 transition flex flex-col"
                        >
                          <span className="font-medium">{chat.title}</span>
                          <div className="flex justify-between text-xs text-white/70 mt-1">
                            <span>{new Date(chat.date).toLocaleDateString("pt-BR")}</span>
                            <span>{assistants.find(a => a.id === chat.assistantId)?.name}</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-white/50 text-center">
                        Nenhuma conversa anterior
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Janela de chat */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          <ChatWindow
            messages={messages}
            endRef={endRef}
            isLoading={isLoading}
          />
        </div>

        {/* Input de envio */}
        <div className="px-6 pb-6">
          <ChatInput
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onSend={sendMessage}
            textareaRef={textareaRef}
          />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
