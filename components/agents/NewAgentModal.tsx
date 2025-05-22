// components/agents/NewAgentModal.tsx
"use client";

import React from "react";
import AgentForm from "./AgentForm";
import type { MyDocument, NewAgentModalProps } from "@/types/agents";

const NewAgentModal: React.FC<NewAgentModalProps> = ({
  isOpen,
  onClose,
  myDocuments = [],
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div
        className="
          w-full 
          max-w-[900px]
          max-h-[90vh]
          bg-white 
          rounded-xl 
          shadow-lg 
          overflow-hidden
        "
      >
        <AgentForm onCancel={onClose} myDocuments={myDocuments} />
      </div>
    </div>
  );
};

export default NewAgentModal;
