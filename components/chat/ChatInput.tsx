// components/chat/ChatInput.tsx
import React, { FC } from "react";
import { Send } from "lucide-react";
import { ChatInputProps } from "@/types/chat";

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

export default ChatInput;
