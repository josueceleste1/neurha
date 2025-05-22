"use client";

import React from "react";
import AgentForm, { MyDocument, AgentData } from "./AgentForm";


interface EditAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: AgentData | null;
  myDocuments?: MyDocument[];
  onSaved?: () => void;

}

const EditAgentModal: React.FC<EditAgentModalProps> = ({
  isOpen,
  onClose,
  agent,
  myDocuments = [],
  onSaved,
}) => {
  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-[900px] max-h-[90vh] bg-white rounded-xl shadow-lg overflow-hidden">

        <AgentForm
          onCancel={onClose}
          myDocuments={myDocuments}
          mode="edit"
          agent={agent}
          onSave={onSaved}
        />
      </div>
    </div>
  );
};

export default EditAgentModal;
