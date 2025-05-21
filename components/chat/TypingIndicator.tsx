import React from "react";
import { Bot } from "lucide-react";

const TypingIndicator: React.FC = () => (
  <div className="flex items-end justify-start">
    <Bot className="flex-shrink-0 w-5 h-5 text-purple-300 mr-2" />
    <div className="max-w-xs px-4 py-3 rounded-2xl text-sm shadow-lg border backdrop-blur-sm bg-white/10 text-white border-white/20 rounded-bl-none flex items-center gap-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce [animation-delay:0s]" />
        <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce [animation-delay:0.2s]" />
        <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  </div>
);

export default TypingIndicator;