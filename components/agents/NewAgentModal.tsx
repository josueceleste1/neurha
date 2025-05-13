// components/agents/NewAgentModal.tsx
"use client";

import React from "react";
import AgentForm, { MyDocument } from "./AgentForm";

interface NewAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  myDocuments?: MyDocument[];
}

const NewAgentModal: React.FC<NewAgentModalProps> = ({
  isOpen,
  onClose,
  myDocuments = [],
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/40 backdrop-blur-sm">
      <div
        className="
          w-full 
          max-w-3xl 
          max-h-[90vh]    /* não deixa passar de 90% da altura da viewport */
          overflow-y-auto /* ativa scroll vertical interno */
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
