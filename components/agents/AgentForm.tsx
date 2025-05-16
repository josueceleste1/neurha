"use client";

import React, { useState } from "react";
import { ArrowLeft, Upload, Database as DatabaseIcon } from "lucide-react";
import Switch from "@/components/ui/Switch";
import Toast from "@/components/ui/Toast";

export interface MyDocument {
  id: string;
  name: string;
}

type Tab =
  | "basic"
  | "knowledge"
  | "ingestion"
  | "model"
  | "permissions"
  | "integration";

interface AgentFormProps {
  onCancel: () => void;
  myDocuments: MyDocument[];
}

interface ToastData {
  title: string;
  description: string;
}

const tabs: { value: Tab; label: string }[] = [
  { value: "basic", label: "Dados Básicos" },
  { value: "knowledge", label: "Base de Conhecimento" },
  { value: "ingestion", label: "Configuração de Ingestão" },
  { value: "model", label: "Configuração LLM" },
  { value: "permissions", label: "Permissões" },
  { value: "integration", label: "Integrações" }
];

const AgentForm: React.FC<AgentFormProps> = ({ onCancel, myDocuments }) => {
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [url, setUrl] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  // ingestion states
  const [cron, setCron] = useState("*/30 * * * *");
  const [chunkSize, setChunkSize] = useState("500");
  const [chunkOverlap, setChunkOverlap] = useState("50");
  const [embeddingModel, setEmbeddingModel] = useState("text-embedding-3-large");

  const [toastData, setToastData] = useState<ToastData | null>(null);

  const currentIndex = tabs.findIndex((t) => t.value === activeTab);
  const goNext = () => currentIndex < tabs.length - 1 && setActiveTab(tabs[currentIndex + 1].value);
  const goBack = () => currentIndex > 0 && setActiveTab(tabs[currentIndex - 1].value);

  const handleFiles = (files: FileList | null) => files && setUploadFiles((prev) => [...prev, ...Array.from(files)]);
  const handleAddUrl = () => {
    if (url) {
      setToastData({ title: "URL adicionada", description: url });
      setUrl("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToastData({ title: "Agente criado", description: `O agente ${name} foi cadastrado com sucesso.` });
  };

  const handleToastClose = () => {
    setToastData(null);
    onCancel();
    // reset all
    setName("");
    setDescription("");
    setTags("");
    setStatus("active");
    setUploadFiles([]);
    setUrl("");
    setSelectedDocs([]);
    setCron("*/30 * * * *");
    setChunkSize("500");
    setChunkOverlap("50");
    setEmbeddingModel("text-embedding-3-large");
    setActiveTab("basic");
  };

  const inputClasses = "mt-1 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 transition-all";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";
  const sectionTitleClasses = "text-lg font-medium text-gray-800 mb-4";
  const helperTextClasses = "mt-1.5 text-xs text-gray-500";

  return (
    <>
      {toastData && <Toast {...toastData} onClose={handleToastClose} />}
      <form onSubmit={handleSubmit} className="flex flex-col h-[90vh] text-gray-900">

        {/* Header */}
        <div className="flex items-center border-b px-8 py-4 shrink-0 bg-white shadow-sm">
          <button type="button" onClick={onCancel} className="text-gray-700 hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="ml-4 text-lg font-semibold">Criar Novo Agente</h1>
        </div>

        {/* Tabs */}
        <div className="px-8 py-4 shrink-0 bg-gray-50 border-b">
          <div className="inline-flex bg-gray-200 rounded-lg p-1 overflow-x-auto">
            {tabs.map((t) => {
              const isActive = t.value === activeTab;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setActiveTab(t.value)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
                    isActive ? 'bg-purple-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 bg-white px-8 pb-6 space-y-6 overflow-y-auto">
          {activeTab === 'basic' && (
            <>
              <h2 className={sectionTitleClasses}>Informações Básicas do Agente</h2>
              <div>
                <label className={labelClasses}>Nome do Agente</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ex: Agente de Vendas"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Descreva o propósito e funcionalidades deste agente..."
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Tags</label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="vendas, suporte, atendimento"
                  className={inputClasses}
                />
                <p className={helperTextClasses}>Separe as tags por vírgulas</p>
              </div>
              <div>
                <label className={labelClasses}>Status</label>
                <div className="inline-flex items-center space-x-3 mt-1">
                  <Switch
                    checked={status === 'active'}
                    onCheckedChange={(c) => setStatus(c ? 'active' : 'inactive')} />
                  <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                    status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <h2 className={sectionTitleClasses}>Fontes de Conhecimento</h2>
              <label className="block w-full border-2 border-dashed p-8 text-center rounded-lg hover:border-purple-500 transition-colors cursor-pointer bg-gray-50">
                <input type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-3 text-sm text-gray-600 font-medium">Arraste arquivos ou clique para fazer upload</p>
                <p className="text-xs text-gray-500 mt-1">Formatos suportados: PDF, DOCX, TXT, CSV</p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 shadow-sm transition-all"
                  onClick={() => document.querySelector<HTMLInputElement>('label input[type="file"]')?.click()}>
                  Selecionar Arquivos
                </button>
              </label>

              <div>
                <label className={labelClasses}>Adicionar URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://site.com/documento"
                    className={inputClasses} />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium shadow-sm transition-all">
                    Adicionar
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Conectar com Serviços</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button type="button" className="flex items-center gap-3 p-4 border rounded-md hover:bg-gray-50 transition-all shadow-sm">
                    <DatabaseIcon className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-medium">SharePoint</p>
                      <p className="text-sm text-gray-500">Conecte um site do SharePoint</p>
                    </div>
                  </button>
                  <button type="button" className="flex items-center gap-3 p-4 border rounded-md hover:bg-gray-50 transition-all shadow-sm">
                    <DatabaseIcon className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-medium">Google Drive</p>
                      <p className="text-sm text-gray-500">Conecte pastas do Google Drive</p>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClasses}>Documentos Existentes</label>
                <select
                  multiple
                  value={selectedDocs}
                  onChange={(e) => setSelectedDocs(Array.from(e.target.selectedOptions).map(o => o.value))}
                  className={`${inputClasses} h-40`}>
                  {myDocuments.map((doc) => (
                    <option key={doc.id} value={doc.id}>{doc.name}</option>
                  ))}
                </select>
                <p className={helperTextClasses}>Selecione múltiplos documentos usando Ctrl ou Cmd</p>
              </div>
            </div>
          )}

          {activeTab === 'ingestion' && (
            <div className="space-y-6">
              <h2 className={sectionTitleClasses}>Configuração de Ingestão de Dados</h2>
              <div>
                <label className={labelClasses}>Agendamento de Atualização</label>
                <input
                  type="text"
                  value={cron}
                  onChange={(e) => setCron(e.target.value)}
                  placeholder="*/30 * * * *"
                  className={inputClasses}
                />
                <p className={helperTextClasses}>Formato cron. Exemplo: */30 * * * * (a cada 30 minutos)</p>
              </div>

              <div>
                <label className={labelClasses}>Tamanho do Chunk</label>
                <select
                  value={chunkSize}
                  onChange={(e) => setChunkSize(e.target.value)}
                  className={inputClasses}
                >
                  <option value="100">100 tokens</option>
                  <option value="200">200 tokens</option>
                  <option value="500">500 tokens</option>
                  <option value="1000">1000 tokens</option>
                </select>
                <p className={helperTextClasses}>Tamanho dos fragmentos de texto para processamento</p>
              </div>

              <div>
                <label className={labelClasses}>Sobreposição de Chunks</label>
                <input
                  type="number"
                  value={chunkOverlap}
                  onChange={(e) => setChunkOverlap(e.target.value)}
                  className={inputClasses}
                />
                <p className={helperTextClasses}>Quantidade de tokens que se sobrepõem entre chunks consecutivos</p>
              </div>

              <div>
                <label className={labelClasses}>Modelo de Embeddings</label>
                <select
                  value={embeddingModel}
                  onChange={(e) => setEmbeddingModel(e.target.value)}
                  className={inputClasses}
                >
                  <option value="text-embedding-3-small">OpenAI text-embedding-3-small</option>
                  <option value="text-embedding-3-large">OpenAI text-embedding-3-large</option>
                </select>
                <p className={helperTextClasses}>Modelo utilizado para gerar embeddings vetoriais dos documentos</p>
              </div>
            </div>
          )}

          {/* Default placeholder for other tabs */}
          {activeTab !== 'basic' && activeTab !== 'knowledge' && activeTab !== 'ingestion' && (
            <div className="pt-10 text-center text-gray-700">
              <p className="text-lg">Conteúdo da aba "{tabs[currentIndex].label}" em desenvolvimento.</p>
              <p className="text-sm text-gray-500 mt-2">Esta funcionalidade estará disponível em breve.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 bg-gray-50 px-8 py-4 border-t border-gray-200 shrink-0">
          <button
            type="button"
            onClick={goBack}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 transition-all"
          >Voltar</button>
          {currentIndex < tabs.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium shadow-sm transition-all"
            >Próximo</button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium shadow-sm transition-all"
            >Criar Agente</button>
          )}
        </div>
      </form>
    </>
  );
};

export default AgentForm;