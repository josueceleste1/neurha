"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import WebhookTab from "./WebhookTab";
import ApiTab from "./ApiTab";
import WidgetTab from "./WidgetTab";
import ExternalTab from "./ExternalTab";
import { AgentData } from "./AgentForm";

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: AgentData | null;
}

type Tab = "webhook" | "api" | "widget" | "external";
const tabs: { value: Tab; label: string }[] = [
  { value: "webhook", label: "Webhook" },
  { value: "api", label: "API REST" },
  { value: "widget", label: "Widget" },
  { value: "external", label: "Integra\u00e7\u00f5es Externas" },
];

const IntegrationModal: React.FC<IntegrationModalProps> = ({
  isOpen,
  onClose,
  agent,
}) => {
  if (!isOpen || !agent) return null;

  const [activeTab, setActiveTab] = useState<Tab>("webhook");

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-[900px] max-h-[90vh] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center border-b px-8 py-4 bg-white shadow-sm shrink-0">
          <button type="button" onClick={onClose} className="text-gray-700 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <h2 className="ml-4 text-lg font-semibold">Integrações do agente {agent.name}</h2>
        </div>

        {/* Tabs */}
        <div className="px-5 py-4 bg-gray-50 border-b shrink-0">
          <div className="inline-flex bg-gray-200 rounded-lg p-1 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setActiveTab(t.value)}
                className={`px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === t.value ? "bg-purple-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 bg-white px-8 mt-2 pb-6 overflow-y-auto">
          {activeTab === "webhook" && (
            <WebhookTab
              webhookUrl={webhookUrl}
              isWebhookActive={isWebhookActive}
              onWebhookUrlChange={setWebhookUrl}
              onWebhookToggle={setIsWebhookActive}
            />
          )}
          {activeTab === "api" && (
            <ApiTab
              apiToken={apiToken}
              isApiActive={isApiActive}
              onGenerateToken={generateApiToken}
              onApiToggle={setIsApiActive}
            />
          )}
          {activeTab === "widget" && (
            <WidgetTab
              widgetCode={widgetCode}
              isWidgetActive={isWidgetActive}
              onCopyWidgetCode={copyWidgetCode}
              onWidgetToggle={setIsWidgetActive}
            />
          )}
          {activeTab === "external" && <ExternalTab />}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 bg-gray-50 px-8 py-4 border-t border-gray-200 shrink-0">
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
