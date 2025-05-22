"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Toast from "@/components/ui/Toast";
import BasicTab from "./BasicTab";
import KnowledgeTab from "./KnowledgeTab";
import IngestionTab from "./IngestionTab";
import ModelTab from "@/components/agents/ModelTab";
import PermissionsTab from "@/components/agents/PermissionsTab";
import IntegrationTab from "@/components/agents/IntegrationTab";
import { MOCK_USERS, MOCK_TEAMS } from "@/mocks/mockData";

export interface MyDocument { id: string; name: string; }
type Tab = "basic" | "knowledge" | "ingestion" | "model" | "permissions" | "integration";

interface AgentFormProps {
  onCancel: () => void;
  myDocuments: MyDocument[];
  /** quando fornecido, o formulário funciona em modo de edição */
  mode?: "create" | "edit";
  agent?: any;
  onSuccess?: () => void;
}

interface ToastData { title: string; description: string; }

const tabs: { value: Tab; label: string }[] = [
  { value: "basic", label: "Dados Básicos" },
  { value: "knowledge", label: "Base de Conhecimento" },
  { value: "ingestion", label: "Configuração de Ingestão" },
  { value: "model", label: "Configuração LLM" },
  { value: "permissions", label: "Permissões" },
  { value: "integration", label: "Integrações" },
];

const NEST_API_URL = "http://localhost:3001/api/v1";

const AgentForm: React.FC<AgentFormProps> = ({
  onCancel,
  myDocuments,
  mode = "create",
  agent,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  // Basic
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  // Knowledge
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [url, setUrl] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  // Ingestion
  const [cron, setCron] = useState("*/30 * * * *");
  const [chunkSize, setChunkSize] = useState("500");
  const [chunkOverlap, setChunkOverlap] = useState("50");
  const [embeddingModel, setEmbeddingModel] = useState("text-embedding-3-large");
  // Model
  const [provider, setProvider] = useState<"openai" | "anthropic" | "ollama" | "grok" | "gemini" | "custom">("openai");
  const [specificModel, setSpecificModel] = useState("GPT-4o");
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState("5");
  const [systemPrompt, setSystemPrompt] = useState(
    "Você é um assistente AI que responde perguntas de forma útil e precisa."
  );
  const [vectorDb, setVectorDb] = useState<"chroma" | "supabase" | "pinecone" | "qdrant" | "weaviate">("supabase");
  const [apiKey, setApiKey] = useState("");
  // Permissions
  const [userSearch, setUserSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  // Integration
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isWebhookActive, setIsWebhookActive] = useState(false);
  const [apiToken, setApiToken] = useState("");
  const [isApiActive, setIsApiActive] = useState(false);
  const widgetCode = `<script src="https://api.agentes.ai/widget/SEU_AGENT_ID"></script>`;
  const [isWidgetActive, setIsWidgetActive] = useState(false);

  // Toast
  const [toastData, setToastData] = useState<ToastData | null>(null);

  const [availableDocuments, setAvailableDocuments] = useState<MyDocument[]>([]);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const res = await fetch(`${NEST_API_URL}/documents`);
        const data = await res.json();
        setAvailableDocuments(Array.isArray(data) ? data : []);
      } catch (err) {
        // opcional: exibir erro
      }
    }
    fetchDocuments();
  }, []);

  // Quando em modo de edição, popula os campos com os dados do agente
  useEffect(() => {
    if (mode === "edit" && agent) {
      setName(agent.name || "");
      setDescription(agent.description || "");
      setTags(agent.tags || "");
      setStatus(agent.status || "active");
      if (Array.isArray(agent.documentIds)) {
        setSelectedDocs(agent.documentIds);
      }
    }
  }, [mode, agent]);

  // Helpers
  function generateApiToken() {
    const token = Math.random().toString(36).substring(2, 10);
    setApiToken(token);
    setToastData({ title: "Token gerado", description: token });
  }

  function copyWidgetCode() {
    navigator.clipboard.writeText(widgetCode);
    setToastData({ title: "Código copiado", description: "Código do widget copiado." });
  }

  function handleFiles(files: FileList | null) {
    if (files) setUploadFiles(prev => [...prev, ...Array.from(files)]);
  }

  function handleAddUrl() {
    if (url) {
      setToastData({ title: "URL adicionada", description: url });
      setUrl("");
    }
  }

  function handleAddUser() {
    if (userSearch.trim()) {
      setSelectedUsers(prev => {
        const updated = [...prev, userSearch.trim()];
        const user = MOCK_USERS.find(u => u.id === userSearch.trim());
        setToastData({
          title: "Usuário adicionado",
          description: user ? user.name : userSearch.trim()
        });
        console.log("Usuários selecionados:", updated);
        return updated;
      });
      setUserSearch("");
    }
  }

  function handleAddTeam() {
    if (teamSearch.trim()) {
      setSelectedTeams(prev => {
        const updated = [...prev, teamSearch.trim()];
        const team = MOCK_TEAMS.find(t => t.id === teamSearch.trim());
        setToastData({
          title: "Equipe adicionada",
          description: team ? team.name : teamSearch.trim()
        });
        console.log("Equipes selecionadas:", updated);
        return updated;
      });
      setTeamSearch("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Log dos dados do agente antes de enviar para a API
    const agentPayload = {
      name,
      description,
      tags,
      status,
      uploadFiles,
      selectedDocs,
      cron,
      chunkSize,
      chunkOverlap,
      embeddingModel,
      provider,
      specificModel,
      temperature,
      topK,
      systemPrompt,
      vectorDb,
      apiKey,
      selectedUsers,
      selectedTeams,
      webhookUrl,
      isWebhookActive,
      apiToken,
      isApiActive,
      widgetCode,
      isWidgetActive,
      url,
    };
    console.log('Payload do agente:', agentPayload);

    const url = mode === 'edit' && agent?.id
      ? `${NEST_API_URL}/agents/${agent.id}`
      : `${NEST_API_URL}/agents`;
    const method = mode === 'edit' && agent?.id ? 'PATCH' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          tags,
          status,
          documentIds: selectedDocs,
        }),
      });
      if (!res.ok) throw new Error('Erro ao salvar agente');
      setToastData({
        title: mode === 'edit' ? 'Agente atualizado' : 'Agente criado',
        description:
          mode === 'edit'
            ? `O agente ${name} foi atualizado com sucesso.`
            : `O agente ${name} foi cadastrado com sucesso.`,
      });
      onCancel();
      onSuccess && onSuccess();
    } catch (err) {
      setToastData({ title: 'Erro', description: 'Não foi possível salvar o agente.' });
    }
  }

  function handleToastClose() {
    setToastData(null);
  }

  const handleWebhookToggle = (active: boolean) => {
    setIsWebhookActive(active);
  };
  const handleApiToggle = (active: boolean) => {
    setIsApiActive(active);
  };

  const handleWidgetToggle = (active: boolean) => {
    setIsWidgetActive(active);
  };

  const currentIndex = tabs.findIndex(t => t.value === activeTab);
  const goNext = () => currentIndex < tabs.length - 1 && setActiveTab(tabs[currentIndex + 1].value);
  const goBack = () => currentIndex > 0 && setActiveTab(tabs[currentIndex - 1].value);

  const inputClasses =
    "mt-1 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 transition-all";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";
  const sectionTitleClasses = "text-lg font-medium text-gray-800 mb-4";
  const helperTextClasses = "mt-1.5 text-xs text-gray-500";

  return (
    <>
      {toastData && <Toast {...toastData} onClose={handleToastClose} />}

      <form onSubmit={handleSubmit} className="flex flex-col h-[90vh] text-gray-900">
        {/* Header */}
        <div className="flex items-center border-b px-8 py-4 bg-white shadow-sm shrink-0">
          <button type="button" onClick={onCancel} className="text-gray-700 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <h1 className="ml-4 text-lg font-semibold">
            {mode === "edit" ? "Editar Agente" : "Criar Novo Agente"}
          </h1>
        </div>

        {/* Tabs */}
        <div className="px-5 py-4 bg-gray-50 border-b shrink-0">
          <div className="inline-flex bg-gray-200 rounded-lg p-1 overflow-x-auto">
            {tabs.map(t => {
              const isActive = t.value === activeTab;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setActiveTab(t.value)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-md transition-all ${isActive ? "bg-purple-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 bg-white px-8 mt-2 pb-6 space-y-6 overflow-y-auto">
          {activeTab === "basic" && (
            <BasicTab
              name={name}
              onNameChange={setName}
              description={description}
              onDescriptionChange={setDescription}
              tags={tags}
              onTagsChange={setTags}
              status={status}
              onStatusChange={setStatus}
            />
          )}
          {activeTab === "knowledge" && (
            <KnowledgeTab
              onFilesChange={handleFiles}
              url={url}
              onUrlChange={setUrl}
              onAddUrl={handleAddUrl}
              myDocuments={availableDocuments}
              selectedDocs={selectedDocs}
              onSelectedDocsChange={setSelectedDocs}
              onConnectSharePoint={() => { }}
              onConnectGoogleDrive={() => { }}
            />
          )}
          {activeTab === "ingestion" && (
            <IngestionTab
              cron={cron}
              onCronChange={setCron}
              chunkSize={chunkSize}
              onChunkSizeChange={setChunkSize}
              chunkOverlap={chunkOverlap}
              onChunkOverlapChange={setChunkOverlap}
              embeddingModel={embeddingModel}
              onEmbeddingModelChange={setEmbeddingModel}
            />
          )}
          {activeTab === "model" && (
            <ModelTab
              provider={provider}
              onProviderChange={setProvider}
              specificModel={specificModel}
              onSpecificModelChange={setSpecificModel}
              temperature={temperature}
              onTemperatureChange={setTemperature}
              topK={topK}
              onTopKChange={setTopK}
              systemPrompt={systemPrompt}
              onSystemPromptChange={setSystemPrompt}
              vectorDb={vectorDb}
              onVectorDbChange={setVectorDb}
              apiKey={apiKey}
              onApiKeyChange={setApiKey}
            />
          )}
          {activeTab === "permissions" && (
            <PermissionsTab
              userSearch={userSearch}
              onUserSearchChange={setUserSearch}
              onAddUser={handleAddUser}
              selectedUsers={selectedUsers}
              onRemoveUser={user => setSelectedUsers(prev => prev.filter(u => u !== user))}
              users={MOCK_USERS}
              teamSearch={teamSearch}
              onTeamSearchChange={setTeamSearch}
              onAddTeam={handleAddTeam}
              selectedTeams={selectedTeams}
              onRemoveTeam={team => setSelectedTeams(prev => prev.filter(t => t !== team))}
              teams={MOCK_TEAMS}
            />
          )}
          {activeTab === "integration" && (
            <IntegrationTab
              webhookUrl={webhookUrl}
              isWebhookActive={isWebhookActive}
              onWebhookUrlChange={setWebhookUrl}
              onWebhookToggle={handleWebhookToggle}

              apiToken={apiToken}
              isApiActive={isApiActive}
              onGenerateToken={generateApiToken}
              onApiToggle={handleApiToggle}

              widgetCode={widgetCode}
              isWidgetActive={isWidgetActive}
              onCopyWidgetCode={copyWidgetCode}
              onWidgetToggle={handleWidgetToggle}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 bg-gray-50 px-8 py-4 border-t border-gray-200 shrink-0">
          <button
            type="button"
            onClick={goBack}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
          >
            Voltar
          </button>
          {currentIndex < tabs.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Próximo
            </button>
          ) : (
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              {mode === "edit" ? "Salvar Alterações" : "Criar Agente"}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default AgentForm;
