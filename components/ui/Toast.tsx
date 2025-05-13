import React, { useEffect } from "react";

interface ToastProps {
  title: string;
  description: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ title, description, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-xl border border-purple-200 bg-purple-50 p-4 shadow-md text-purple-900 animate-fade-in">
      <strong className="block text-sm font-semibold text-purple-900">
        {title}
      </strong>
      <p className="mt-1 text-sm text-purple-800/90">{description}</p>
    </div>
  );
};

export default Toast;