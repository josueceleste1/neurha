// app/settings/page.tsx
"use client";

import React, { FC, useState } from "react";
import Header from "@/components/Header";
import { Settings as Cog } from "lucide-react";
import { Collaborator } from "@/types/settings";

const initialCollaborators: Collaborator[] = [
  { email: "ana.silva@empresa.com", role: "Admin" },
  { email: "carlos.hr@empresa.com", role: "Editor" },
];

// Reusable Section Wrapper
const Section: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-4">
    <h2 className="text-xl font-semibold border-b border-white/20 pb-2">{title}</h2>
    {children}
  </section>
);

// General Settings
const GeneralSettings: FC<{
  assistantEnabled: boolean;
  toggleAssistant: () => void;
  showRating: boolean;
  toggleRating: () => void;
}> = ({ assistantEnabled, toggleAssistant, showRating, toggleRating }) => (
  <Section title="Ajustes gerais">
    <div className="space-y-2">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={assistantEnabled}
          onChange={toggleAssistant}
          className="h-5 w-5 text-purple-500 bg-white/20 rounded focus:ring-purple-400"
        />
        <span>Ativar assistente</span>
      </label>
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={showRating}
          onChange={toggleRating}
          className="h-5 w-5 text-purple-500 bg-white/20 rounded focus:ring-purple-400"
        />
        <span>Mostrar botão de avaliação</span>
      </label>
    </div>
  </Section>
);

// Visual Customization
const VisualSettings: FC<{
  companyName: string;
  onCompanyNameChange: (v: string) => void;
  primaryColor: string;
  onColorChange: (v: string) => void;
}> = ({ companyName, onCompanyNameChange, primaryColor, onColorChange }) => (
  <Section title="Personalização visual">
    <div className="space-y-4">
      <div className="flex flex-col">
        <label className="text-sm mb-1">Nome da empresa:</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          className="bg-white/10 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm mb-1">Cor primária:</label>
        <input
          type="color"
          value={primaryColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-16 h-8 p-0 border-0 rounded"
        />
      </div>
    </div>
  </Section>
);

// Integration Settings
const IntegrationSettings: FC<{
  isOpen: boolean;
  toggleOpen: () => void;
  webhookUrl: string;
  onWebhookChange: (v: string) => void;
}> = ({ isOpen, toggleOpen, webhookUrl, onWebhookChange }) => (
  <Section title="Integrações">
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span>Base de conhecimento externa (Notion, GDocs)</span>
        <button
          onClick={toggleOpen}
          className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
        >
          Configurar
        </button>
      </div>
      {isOpen && (
        <div className="bg-white/10 p-4 rounded-xl space-y-3">
          <label className="block text-sm">URL da base externa:</label>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => onWebhookChange(e.target.value)}
            placeholder="https://..."
            className="w-full bg-white/20 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold">
            Salvar configuração
          </button>
        </div>
      )}
      <div className="flex items-center gap-4">
        <span>Webhook para logs</span>
        <input
          type="url"
          value={webhookUrl}
          onChange={(e) => onWebhookChange(e.target.value)}
          placeholder="https://..."
          className="bg-white/10 text-white px-4 py-2 rounded-xl flex-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>
    </div>
  </Section>
);

// Access & Permissions
const AccessPermissions: FC<{
  collaborators: Collaborator[];
  onAdd: () => void;
  onRemove: (email: string) => void;
}> = ({ collaborators, onAdd, onRemove }) => (
  <Section title="Acesso & permissões">
    <button
      onClick={onAdd}
      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold"
    >
      Adicionar colaborador
    </button>
    <div className="space-y-2 mt-2">
      {collaborators.map(({ email, role }) => (
        <div
          key={email}
          className="flex items-center justify-between bg-white/10 px-4 py-2 rounded-xl"
        >
          <span>
            {email} ({role})
          </span>
          <button onClick={() => onRemove(email)} className="text-red-400 hover:text-red-500">
            Remover
          </button>
        </div>
      ))}
    </div>
  </Section>
);

// Advanced Settings
const AdvancedSettings: FC<{ onReprocess: () => void; onReset: () => void }> = ({
  onReprocess,
  onReset,
}) => (
  <Section title="Avançado">
    <div className="flex flex-col space-y-3">
      <button
        onClick={onReprocess}
        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition"
      >
        🧠 Reprocessar base de conhecimento
      </button>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl transition"
      >
        🗑️ Resetar assistente
      </button>
    </div>
  </Section>
);

const SettingsPage: FC = () => {
  // General
  const [assistantEnabled, setAssistantEnabled] = useState(true);
  const [showRatingButton, setShowRatingButton] = useState(true);
  // Visual
  const [companyName, setCompanyName] = useState("NeuRHa AI");
  const [primaryColor, setPrimaryColor] = useState("#7E22CE");
  // Integrations
  const [integrationConfigOpen, setIntegrationConfigOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  // Access
  const [collaborators, setCollaborators] = useState<Collaborator[]>(initialCollaborators);

  const handleAddCollaborator = () => {
    // lógica de adicionar colaborador
  };
  const handleRemoveCollaborator = (email: string) =>
    setCollaborators((prev) => prev.filter((c) => c.email !== email));
  const handleReprocess = () => {
    // lógica de reprocessamento
  };
  const handleReset = () => {
    // lógica de reset
  };

  // User
  const userName = "João Silva";
  const handleLogout = () => console.log("Logout");

  return (
    <div className="flex h-screen overflow-x-hidden">
      <main className="flex-1 flex flex-col bg-gradient-to-br from-[#4C1D95] via-[#7E22CE] to-[#1E1B4B] text-white">
        <Header
          title="Configurações Gerais"
          icon={<Cog className="w-6 h-6 text-purple-300" />}
          userName={userName}
          onLogout={handleLogout}
        />
        <div className="p-10 space-y-8 overflow-auto">
          <GeneralSettings
            assistantEnabled={assistantEnabled}
            toggleAssistant={() => setAssistantEnabled((v) => !v)}
            showRating={showRatingButton}
            toggleRating={() => setShowRatingButton((v) => !v)}
          />
          <VisualSettings
            companyName={companyName}
            onCompanyNameChange={setCompanyName}
            primaryColor={primaryColor}
            onColorChange={setPrimaryColor}
          />
          <IntegrationSettings
            isOpen={integrationConfigOpen}
            toggleOpen={() => setIntegrationConfigOpen((v) => !v)}
            webhookUrl={webhookUrl}
            onWebhookChange={setWebhookUrl}
          />
          <AccessPermissions
            collaborators={collaborators}
            onAdd={handleAddCollaborator}
            onRemove={handleRemoveCollaborator}
          />
          <AdvancedSettings onReprocess={handleReprocess} onReset={handleReset} />
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
