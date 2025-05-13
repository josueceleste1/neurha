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
  { value: "knowledge", label: "Conhecimento" },
  { value: "ingestion", label: "Ingestão" },
  { value: "model", label: "Configuração LLM" },
  { value: "permissions", label: "Permissões" },
  { value: "integration", label: "Integrações" },
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
  const [toastData, setToastData] = useState<ToastData | null>(null);

  const currentIndex = tabs.findIndex((t) => t.value === activeTab);
  const goNext = () => currentIndex < tabs.length - 1 && setActiveTab(tabs[currentIndex + 1].value);
  const goBack = () => currentIndex > 0 && setActiveTab(tabs[currentIndex - 1].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToastData({ title: "Agente criado", description: `O agente ${name} foi cadastrado com sucesso.` });
  };
  const handleToastClose = () => {
    setToastData(null);
    onCancel();
    // reset
    setName("");
    setDescription("");
    setTags("");
    setStatus("active");
    setUploadFiles([]);
    setUrl("");
    setSelectedDocs([]);
    setActiveTab("basic");
  };

  const handleFiles = (files: FileList | null) => files && setUploadFiles((p) => [...p, ...Array.from(files)]);
  const handleAddUrl = () => url && (setToastData({ title: "URL adicionada", description: url }), setUrl(""));

  return (
    <>
      {toastData && <Toast {...toastData} onClose={handleToastClose} />}

      <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
        {/* Header */}
        <div className="flex items-center border-b px-8 py-4">
          <button type="button" onClick={onCancel} className="text-gray-700 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <h1 className="ml-4 text-lg font-semibold">Criar Novo Agente</h1>
        </div>

        {/* Tabs */}
        <div className="px-8 py-3">
          <div className="inline-flex bg-gray-200 rounded-lg p-1 space-x-1 overflow-x-auto">
            {tabs.map((t) => {
              const isActive = t.value === activeTab;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setActiveTab(t.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    isActive ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="bg-white px-8 pb-6 space-y-6">
          {/* Dados Básicos */}
          {activeTab === "basic" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-900">Nome do Agente</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ex: Agente de Vendas"
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">Descrição</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Descreva o propósito..."
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900">Tags (vírgula)</label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="vendas, suporte"
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Status</label>
                <div className="inline-flex items-center space-x-2">
                  <Switch
                    checked={status === "active"}
                    onCheckedChange={(c) => setStatus(c ? "active" : "inactive")}
                  />
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {status === "active" ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Conhecimento */}
          {activeTab === "knowledge" && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Fontes de Conhecimento</h2>
              <label className="block w-full border-2 border-dashed p-8 text-center rounded-lg hover:border-purple-500">
                <input type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Arraste ou clique para upload</p>
                <p className="text-xs text-gray-400">PDF, DOCX, TXT, CSV</p>
                <button
                  type="button"
                  className="mt-4 px-3 py-1.5 bg-white border rounded-md text-sm hover:bg-gray-50"
                  onClick={() => document.querySelector<HTMLInputElement>('label input[type="file"]')?.click()}
                >
                  Selecionar Arquivos
                </button>
              </label>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://site.com/doc"
                  className="flex-1 rounded-md border px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500/40"
                />
                <button type="button" onClick={handleAddUrl} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  Adicionar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button type="button" className="flex items-center gap-3 p-4 border rounded-md hover:bg-gray-50">
                  <DatabaseIcon className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">SharePoint</p>
                    <p className="text-sm text-gray-500">Conecte um site do SharePoint</p>
                  </div>
                </button>
                <button type="button" className="flex items-center gap-3 p-4 border rounded-md hover:bg-gray-50">
                  <DatabaseIcon className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Google Drive</p>
                    <p className="text-sm text-gray-500">Conecte pastas do Google Drive</p>
                  </div>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Meus Documentos</label>
                <select
                  multiple
                  value={selectedDocs}
                  onChange={(e) => setSelectedDocs(Array.from(e.target.selectedOptions).map((o) => o.value))}
                  className="w-full h-32 rounded-md border px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500/40"
                >
                  {myDocuments.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Placeholders */}
          {activeTab !== "basic" && activeTab !== "knowledge" && (
            <div className="pt-6 text-center text-gray-700">Conteúdo da aba “{tabs[currentIndex].label}” em breve.</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 bg-gray-50 px-8 py-4 border-t border-gray-200">
          <button
            type="button"
            onClick={goBack}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Voltar
          </button>
          {currentIndex < tabs.length - 1 ? (
            <button type="button" onClick={goNext} className="px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700">
              Próximo
            </button>
          ) : (
            <button type="submit" className="px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700">
              Salvar
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default AgentForm;
