"use client";

import React, { useState } from "react";
import { ArrowLeft, Webhook, Server, Code, Plug } from "lucide-react";
import WebhookTab from "./WebhookTab";
import ApiTab from "./ApiTab";
import WidgetTab from "./WidgetTab";
import ExternalTab from "./ExternalTab";
import type { AgentData, IntegrationModalProps } from "@/types/agents";

type Tab = "webhook" | "api" | "widget" | "external";
const tabs: { value: Tab; label: string; icon: React.ReactNode }[] = [
  { value: "webhook", label: "Webhook", icon: <Webhook size={16} /> },
  { value: "api", label: "API REST", icon: <Server size={16} /> },
  { value: "widget", label: "Widget", icon: <Code size={16} /> },
  { value: "external", label: "Externo", icon: <Plug size={16} /> },
];

export default function IntegrationModal({ isOpen, onClose, agent }: IntegrationModalProps) {
  if (!isOpen || !agent) return null;

  const [activeTab, setActiveTab] = useState<Tab>("webhook");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isWebhookActive, setIsWebhookActive] = useState(false);
  const [apiToken, setApiToken] = useState("");
  const [isApiActive, setIsApiActive] = useState(false);
  const widgetCode = `<script src=\"https://api.agentes.ai/widget/${agent.id}\"></script>`;
  const [isWidgetActive, setIsWidgetActive] = useState(false);

  const generateApiToken = () => {
    const token = Math.random().toString(36).substring(2, 10);
    setApiToken(token);
    setIsApiActive(true);
  };

  const copyWidgetCode = () => navigator.clipboard.writeText(widgetCode);

  const currentIndex = tabs.findIndex(t => t.value === activeTab);
  const goNext = () => currentIndex < tabs.length - 1 && setActiveTab(tabs[currentIndex + 1].value);
  const goBack = () => currentIndex > 0 && setActiveTab(tabs[currentIndex - 1].value);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col h-[75vh] text-gray-900 mx-auto">
        {/* Header */}
        <div className="flex items-center border-b px-6 py-4 bg-white shadow-sm shrink-0">
          <button 
            onClick={onClose} 
            className="text-gray-700 hover:text-gray-900 transition-colors p-1 hover:bg-gray-100 rounded-lg mr-3"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">
            Integrações do agente <span className="text-purple-600">{agent.name}</span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 bg-gray-50 border-b shrink-0 flex justify-center">
          <div className="inline-flex bg-gray-200 rounded-lg p-1">
            {tabs.map(tab => {
              const isActive = tab.value === activeTab;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all min-w-[110px] justify-center ${
                    isActive 
                      ? "bg-purple-600 text-white shadow-md" 
                      : "text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white px-6 py-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">

            {/* Tab Content */}
            <div className="space-y-4">
              {activeTab === "webhook" && (
                <WebhookTab
                  webhookUrl={webhookUrl}
                  isWebhookActive={isWebhookActive}
                  onWebhookUrlChange={setWebhookUrl}
                  onWebhookToggle={setIsWebhookActive}
                  agent={agent}
                />
              )}
              {activeTab === "api" && (
                <ApiTab
                  apiToken={apiToken}
                  isApiActive={isApiActive}
                  onGenerateToken={generateApiToken}
                  onApiToggle={setIsApiActive}
                  agent={agent}
                />
              )}
              {activeTab === "widget" && (
                <WidgetTab
                  widgetCode={widgetCode}
                  isWidgetActive={isWidgetActive}
                  onCopyWidgetCode={copyWidgetCode}
                  onWidgetToggle={setIsWidgetActive}
                  agent={agent}
                />
              )}
              {activeTab === "external" && <ExternalTab agent={agent} />}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center bg-gray-50 px-6 py-4 border-t border-gray-200 shrink-0">
          <button
            type="button"
            onClick={goBack}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 text-gray-700 transition-colors"
          >
            Voltar
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
            >
              Cancelar
            </button>
            {currentIndex < tabs.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Próximo
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Salvar alterações
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}