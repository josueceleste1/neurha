import React from "react";
import Switch from "@/components/ui/Switch";

export interface ModelOption {
  value: string;
  label: string;
}

export interface ModelTabProps {
  provider: "openai" | "anthropic" | "ollama" | "custom";
  onProviderChange: (key: ModelTabProps['provider']) => void;
  specificModel: string;
  onSpecificModelChange: (value: string) => void;
  temperature: number;
  onTemperatureChange: (value: number) => void;
  topK: string;
  onTopKChange: (value: string) => void;
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
  vectorDb: "supabase" | "pinecone" | "qdrant" | "weaviate";
  onVectorDbChange: (key: ModelTabProps['vectorDb']) => void;
  apiKey: string;
  onApiKeyChange: (value: string) => void;
}

// Modelos disponíveis por provedor
const PROVIDER_MODELS: Record<string, ModelOption[]> = {
  openai: [
    { value: "GPT-4o", label: "GPT-4o" },
    { value: "GPT-3.5-Turbo", label: "GPT-3.5-Turbo" },
  ],
  anthropic: [{ value: "Claude 3", label: "Claude 3" }],
  ollama: [{ value: "ollama-model", label: "Ollama Model" }],
  custom: [{ value: "custom-model", label: "API Personalizada" }],
};

// Opções de provedores de LLM
const PROVIDERS = [
  { key: "openai", label: "OpenAI", desc: "GPT-4o, GPT-3.5-Turbo" },
  { key: "anthropic", label: "Anthropic", desc: "Claude 3" },
  { key: "ollama", label: "Ollama", desc: "Modelos locais" },
  { key: "custom", label: "Personalizado", desc: "API personalizada" },
];

// Opções de bases vetoriais
const VECTOR_DBS = [
  { key: "supabase", label: "Supabase", desc: "pgvector" },
  { key: "pinecone", label: "Pinecone", desc: "Armazenamento vetorial dedicado" },
  { key: "qdrant", label: "Qdrant", desc: "Alta performance" },
  { key: "weaviate", label: "Weaviate", desc: "Busca semântica" },
];

const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";
const inputClasses =
  "mt-1 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 transition-all";

const ModelTab: React.FC<ModelTabProps> = ({
  provider,
  onProviderChange,
  specificModel,
  onSpecificModelChange,
  temperature,
  onTemperatureChange,
  topK,
  onTopKChange,
  systemPrompt,
  onSystemPromptChange,
  vectorDb,
  onVectorDbChange,
  apiKey,
  onApiKeyChange,
}) => (
  <div className="space-y-6">
    <h2 className="text-lg font-medium text-gray-800">Configuração de LLM</h2>

    {/* Provedor */}
    <div>
      <label className={labelClasses}>Provedor de LLM</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PROVIDERS.map(({ key, label, desc }) => (
          <label
            key={key}
            className="flex items-center p-4 border rounded-md cursor-pointer hover:border-purple-500 transition-all"
          >
            <input
              type="radio"
              name="provider"
              value={key}
              checked={provider === key}
              onChange={() => onProviderChange(key as any)}
              className="mr-3"
            />
            <div>
              <p className="font-medium">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>

    {/* Modelo Específico */}
    <div>
      <label className={labelClasses}>Modelo Específico</label>
      <select
        value={specificModel}
        onChange={e => onSpecificModelChange(e.target.value)}
        className={inputClasses}
      >
        {PROVIDER_MODELS[provider].map(model => (
          <option key={model.value} value={model.value}>
            {model.label}
          </option>
        ))}
      </select>
    </div>

    {/* Temperatura */}
    <div>
      <label className={labelClasses}>Temperatura</label>
      <div className="flex items-center space-x-4">
        <span className="text-xs text-gray-500">0.0 (Determinístico)</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={temperature}
          onChange={e => onTemperatureChange(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-xs text-gray-500">1.0 (Criativo)</span>
      </div>
    </div>

    {/* Top K Recuperação */}
    <div>
      <label className={labelClasses}>Top K Recuperação</label>
      <select
        value={topK}
        onChange={e => onTopKChange(e.target.value)}
        className={inputClasses}
      >
        <option value="1">1 documento</option>
        <option value="3">3 documentos</option>
        <option value="5">5 documentos</option>
        <option value="10">10 documentos</option>
      </select>
    </div>

    {/* Prompt de Sistema */}
    <div>
      <label className={labelClasses}>Prompt de Sistema</label>
      <textarea
        rows={4}
        value={systemPrompt}
        onChange={e => onSystemPromptChange(e.target.value)}
        className={inputClasses}
      />
    </div>

    {/* Base de Dados Vetorial */}
    <div>
      <label className={labelClasses}>Base de Dados Vetorial</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {VECTOR_DBS.map(({ key, label, desc }) => (
          <label
            key={key}
            className="flex items-center p-4 border rounded-md cursor-pointer hover:border-purple-500 transition-all"
          >
            <input
              type="radio"
              name="vectorDb"
              value={key}
              checked={vectorDb === key}
              onChange={() => onVectorDbChange(key as any)}
              className="mr-3"
            />
            <div>
              <p className="font-medium">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>

    {/* Chave de API */}
    <div>
      <label className={labelClasses}>Chave de API</label>
      <input
        type="password"
        value={apiKey}
        onChange={e => onApiKeyChange(e.target.value)}
        placeholder="sk-..."
        className={inputClasses}
      />
    </div>
  </div>
);

export default ModelTab;
