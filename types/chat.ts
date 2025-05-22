// types/chat.ts

export interface Message {
    id: string;
    from: "user" | "bot";
    text: string;
    timestamp: string;
  }
  
  export interface ChatInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onSend: () => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  }
  
  export interface ChatWindowProps {
    messages: Message[];
    endRef: React.RefObject<HTMLDivElement | null>;
    isLoading?: boolean;
  }
  
  export interface MessageBubbleProps {
    message: Message;
  }

export interface Assistant {
  id: string;
  name: string;
  description: string;
  greeting: string;
}

export interface ChatHistory {
  id: string;
  title: string;
  date: string;
  assistantId: string;
}
  