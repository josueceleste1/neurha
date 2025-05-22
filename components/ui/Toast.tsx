import React, { useEffect } from "react";
import { X } from "lucide-react"; // ícone de fechar
import type { ToastProps } from "@/types/ui";

const Toast: React.FC<ToastProps> = ({ title, description, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-xl border border-purple-200 bg-purple-50 p-4 shadow-md text-purple-900 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <strong className="block text-sm font-semibold">
            {title}
          </strong>
          <p className="mt-1 text-sm text-purple-800/90">{description}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Fechar toast"
          className="ml-4 p-1 rounded hover:bg-purple-100 transition-colors"
        >
          <X size={16} className="text-purple-900" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
