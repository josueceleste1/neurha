// hooks/useChat.ts
import { useState, useRef, useLayoutEffect, useCallback } from "react";

// Define o tipo de uma mensagem
export interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
  timestamp: string;
}

export function useChat(initialPrompt: string) {
  // --------------------------
  // ESTADOS & REFS
  // --------------------------
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      from: "bot",
      text: initialPrompt,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState<string>("");         // valor do textarea
  const [isLoading, setIsLoading] = useState(false);      // controle da animação de digitação

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);     // usado para scroll automático

  // --------------------------
  // FUNÇÕES
  // --------------------------

  // Redimensiona o textarea conforme o conteúdo
  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, []);

  // Envia a mensagem do usuário e aguarda resposta do bot
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    // Empilha a mensagem do usuário
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), from: "user", text, timestamp: new Date().toISOString() },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      // Chamada à API interna (Next.js → Nest.js → LLM)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      const payload = await res.json();

      const botText = res.ok
        ? payload.answer
        : `Erro ${res.status}: ${payload.error || payload.message}`;

      // Empilha a resposta do bot
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), from: "bot", text: botText, timestamp: new Date().toISOString() },
      ]);
    } catch (e) {
      console.error("Erro ao chamar API:", e);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          from: "bot",
          text: "Não foi possível conectar ao servidor.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  // Atualiza o conteúdo do input conforme o usuário digita
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  // Permite envio com Enter (sem Shift)
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Redimensiona o textarea quando o texto muda
  useLayoutEffect(() => {
    resizeTextarea();
  }, [input, resizeTextarea]);

  // Scroll automático para a última mensagem
  useLayoutEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --------------------------
  // RETORNO PARA O COMPONENTE
  // --------------------------
  return {
    messages,
    input,
    isLoading,
    handleChange,
    handleKeyDown,
    sendMessage,
    textareaRef,
    endRef,
  };
}
