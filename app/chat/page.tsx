"use client";

import React, { FC, useState, useRef, useEffect } from "react";
import Header from "@/components/ui/Header";
import { Bot, Search, Upload, Palette, History } from "lucide-react";

import { useChat } from "@/hooks/useChat";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";

interface Assistant {
  id: string;
  name: string;
  greeting: string;
}

interface ChatHistory {
  id: string;
  title: string;
  date: string;
  assistantId: string;
}

const ChatPage: FC = () => {
  const assistants: Assistant[] = [
    { id: "general",   name: "Assistente Geral", greeting: "Olá! Como posso ajudar você hoje?" },
    { id: "technical", name: "Suporte Técnico",  greeting: "Olá! Estou aqui para resolver seus problemas técnicos." },
    { id: "sales",     name: "Vendas",           greeting: "Olá! Posso ajudar com informações sobre nossos produtos e serviços." },
    { id: "finance",   name: "Financeiro",       greeting: "Olá! Posso ajudar com questões financeiras e de pagamento." },
  ];

  const [selectedAssistant, setSelectedAssistant] = useState(assistants[0]);
  const [showAssistantSelector, setShowAssistantSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  
  // Refs para os modais
  const assistantSelectorRef = useRef<HTMLDivElement>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  
  // Exemplo de histórico de chats (em produção, isso viria de uma API)
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    { id: "1", title: "Dúvida sobre faturamento", date: "2023-11-15", assistantId: "finance" },
    { id: "2", title: "Problema com login", date: "2023-11-14", assistantId: "technical" },
    { id: "3", title: "Informações sobre produtos", date: "2023-11-12", assistantId: "sales" },
  ]);

  const {
    messages,
    input,
    isLoading,
    handleChange,
    handleKeyDown,
    sendMessage,
    textareaRef,
    endRef,
  } = useChat(selectedAssistant.greeting);

  const userName = "Josué Celeste";
  const handleLogout = () => console.log("Logout");

  const changeAssistant = (assistant: Assistant) => {
    setSelectedAssistant(assistant);
    setShowAssistantSelector(false);
    setSearchTerm("");
  };

  const loadChatFromHistory = (chatId: string) => {
    console.log(`Carregando chat ${chatId}`);
    // Aqui você implementaria a lógica para carregar o chat do histórico
    setShowChatHistory(false);
  };

  const filteredAssistants = assistants.filter(assistant => 
    assistant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Efeito para fechar os modais quando clicar fora deles
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Fechar seletor de assistente se clicar fora
      if (
        showAssistantSelector && 
        assistantSelectorRef.current && 
        !assistantSelectorRef.current.contains(event.target as Node)
      ) {
        setShowAssistantSelector(false);
      }
      
      // Fechar histórico de chat se clicar fora
      if (
        showChatHistory && 
        chatHistoryRef.current && 
        !chatHistoryRef.current.contains(event.target as Node)
      ) {
        setShowChatHistory(false);
      }
    };
    
    // Adicionar listener quando os modais estiverem abertos
    if (showAssistantSelector || showChatHistory) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAssistantSelector, showChatHistory]);

  useEffect(() => {
    if (showAssistantSelector && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showAssistantSelector]);

  return (
    <div className="flex h-screen">
      <main className="flex-1 flex flex-col bg-gradient-to-br from-[#4C1D95] via-[#7E22CE] to-[#1E1B4B]">
        {/* Header padrão */}
        <Header
          title="Chat"
          icon={<Bot className="w-6 h-6 text-purple-300" />}
          userName={userName}
          onLogout={handleLogout}
        />

        {/* Barra de título e seleção (tema escuro, mantendo degradê roxo) */}
        <div className="bg-white/10 border-b border-white/20 px-6 py-4 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-white truncate">
              {selectedAssistant.name}
            </h2>
            <p className="text-sm text-white/70 mt-1 truncate">
              {selectedAssistant.greeting.replace("Olá! ", "")}
            </p>
          </div>
          <div className="flex-shrink-0 ml-4 relative flex items-center">
            {/* Botão de trocar assistente */}
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap"
              onClick={(e) => {
                e.stopPropagation(); // Previne que o evento propague
                setShowAssistantSelector(!showAssistantSelector);
                setShowChatHistory(false); // Fecha o outro modal
              }}
            >
              Trocar Assistente
            </button>

            {/* Botões de ação adicionais */}
            <div className="flex items-center space-x-2 ml-2">
              {/* Botão de histórico de chats */}
              <button
                type="button"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation(); // Previne que o evento propague
                  setShowChatHistory(!showChatHistory);
                  setShowAssistantSelector(false); // Fecha o outro modal
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

            {/* Dropdown do seletor de assistente */}
            {showAssistantSelector && (
              <div 
                ref={assistantSelectorRef}
                className="absolute right-0 top-12 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg z-10 w-64 overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Previne que o clique dentro do modal o feche
              >
                <div className="p-3">
                  {/* Barra de pesquisa */}
                  <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-white/50" />
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar assistente..."
                      className="w-full pl-10 pr-3 py-2 bg-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                    />
                  </div>

                  {/* Lista de assistentes */}
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredAssistants.length > 0 ? (
                      filteredAssistants.map((assistant) => (
                        <button
                          key={assistant.id}
                          onClick={() => changeAssistant(assistant)}
                          className={`w-full text-left px-4 py-3 rounded-lg text-white hover:bg-white/20 transition ${
                            selectedAssistant.id === assistant.id ? 'bg-white/20' : ''
                          }`}
                        >
                          {assistant.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-white/50 text-center">
                        Nenhum assistente encontrado
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Dropdown do histórico de chats */}
            {showChatHistory && (
              <div 
                ref={chatHistoryRef}
                className="absolute right-0 top-12 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg z-10 w-80 overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Previne que o clique dentro do modal o feche
              >
                <div className="p-3">
                  <h3 className="text-white font-medium mb-2">Histórico de Conversas</h3>
                  
                  {/* Lista de chats anteriores */}
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {chatHistory.length > 0 ? (
                      chatHistory.map((chat) => (
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
