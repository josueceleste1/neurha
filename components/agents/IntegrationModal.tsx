"use client";

import React, { useState } from "react";
import IntegrationTab from "./IntegrationTab";
import { AgentData } from "./AgentForm";
import { X, Plug } from "lucide-react";

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: AgentData | null;
}

const IntegrationModal: React.FC<IntegrationModalProps> = ({
  isOpen,
  onClose,
  agent,
}) => {
  if (!isOpen || !agent) return null;

  const [webhookUrl, setWebhookUrl] = useState("");
  const [isWebhookActive, setIsWebhookActive] = useState(false);
  const [apiToken, setApiToken] = useState("");
  const [isApiActive, setIsApiActive] = useState(false);
  const widgetCode = `<script src="https://api.agentes.ai/widget/${agent.id}"></script>`;
  const [isWidgetActive, setIsWidgetActive] = useState(false);

  function generateApiToken() {
    const token = Math.random().toString(36).substring(2, 10);
    setApiToken(token);
  }

  function copyWidgetCode() {
    navigator.clipboard.writeText(widgetCode);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-[700px] max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fechar"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 px-6 py-4 border-b">
          <Plug className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            Integrações do agente {agent.name}
          </h2>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <IntegrationTab
            webhookUrl={webhookUrl}
            isWebhookActive={isWebhookActive}
            onWebhookUrlChange={setWebhookUrl}
            onWebhookToggle={setIsWebhookActive}
            apiToken={apiToken}
            isApiActive={isApiActive}
            onGenerateToken={generateApiToken}
            onApiToggle={setIsApiActive}
            widgetCode={widgetCode}
            isWidgetActive={isWidgetActive}
            onCopyWidgetCode={copyWidgetCode}
            onWidgetToggle={setIsWidgetActive}
          />
        </div>
        <div className="flex justify-end gap-3 bg-gray-50 px-6 py-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationModal;
