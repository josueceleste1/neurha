import React, { useEffect, useState } from "react";
import Switch from "@/components/ui/Switch";
import type { ModelOption, ModelTabProps } from "@/types/agents";

// Modelos disponíveis por provedor (dados reais)
const PROVIDER_MODELS: Record<ModelTabProps['provider'], ModelOption[]> = {
  openai: [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4-1", label: "GPT-4.1" },
    { value: "gpt-4-1-mini", label: "GPT-4.1 Mini" },
    { value: "gpt-4-1-nano", label: "GPT-4.1 Nano" },
    { value: "o4-mini", label: "o4-mini" },
  ],
  anthropic: [
    { value: "claude-4-opus", label: "Claude Opus 4" },
    { value: "claude-4-sonnet", label: "Claude Sonnet 4" },
    { value: "claude-3-7-sonnet", label: "Claude 3.7 Sonnet" },
    { value: "claude-3-5-haiku", label: "Claude 3.5 Haiku" },
    { value: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet" },
  ],
  ollama: [
    { value: "bge-m3", label: "BGE-M3" },
    { value: "olmo2", label: "OLMo 2" },
  ],
  gemini: [
    { value: "gemini-1-5-pro", label: "Gemini 1.5 Pro" },
    { value: "gemini-1-5-flash", label: "Gemini 1.5 Flash" },
    { value: "gemini-1-5-flash-8b", label: "Gemini 1.5 Flash-8B" },
    { value: "gemini-2-0-flash-lite", label: "Gemini 2.0 Flash-Lite" },
  ],
  grok: [
    { value: "grok-3", label: "Grok 3" },
    { value: "grok-3-mini", label: "Grok 3 Mini" },
    { value: "grok-1", label: "Grok 1" },
    { value: "grok-1-5", label: "Grok 1.5" },
  ],
  custom: [{ value: "custom-model", label: "API Personalizada" }],
};

// Opções de provedores de LLM (descrição para interface)
const PROVIDERS = [
  { key: "openai", label: "OpenAI", desc: "GPT-4o, GPT-4.1, GPT-4.1 Mini, GPT-4.1 Nano, o4-mini" },
  { key: "anthropic", label: "Anthropic", desc: "Claude Opus 4, Claude Sonnet 4, Claude 3.7 Sonnet, Claude 3.5 Haiku, Claude 3.5 Sonnet" },
  { key: "ollama", label: "Ollama", desc: "BGE-M3, OLMo 2" },
  { key: "gemini", label: "Gemini", desc: "Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 1.5 Flash-8B, Gemini 2.0 Flash-Lite" },
  { key: "grok", label: "Grok", desc: "Grok 3, Grok 3 Mini, Grok 1, Grok 1.5" },
  { key: "custom", label: "Personalizado", desc: "API personalizada" },
];

// Opções de bases vetoriais
const VECTOR_DBS = [
  { key: "chroma", label: "Chroma", desc: "Armazenamento vetorial local" },
  { key: "supabase", label: "Supabase", desc: "pgvector" },
  { key: "pinecone", label: "Pinecone", desc: "Armazenamento vetorial dedicado" },
  { key: "qdrant", label: "Qdrant", desc: "Alta performance" },
  { key: "weaviate", label: "Weaviate", desc: "Busca semântica" },
  { key: "milvus", label: "Milvus", desc: "Armazenamento vetorial local" },
];

// Mapeamento de campos extras para cada modelo
const MODEL_CONFIG_FIELDS: Record<string, { key: string; label: string; placeholder: string; }[]> = {
  "ollama-model": [
    { key: "host", label: "Host", placeholder: "http://localhost:11434" },
    { key: "port", label: "Porta", placeholder: "11434" },
  ],
  "custom-model": [
    { key: "endpointUrl", label: "Endpoint URL", placeholder: "https://api.seu-modelo.com/v1" },
    { key: "headerName", label: "Nome do Header", placeholder: "Authorization" },
    { key: "headerValue", label: "Valor do Header", placeholder: "Bearer sk-..." },
  ],
  "Gemini-1.5-Pro": [
    { key: "projectId", label: "Google Cloud Project ID", placeholder: "meu-projeto" },
    { key: "location", label: "Location", placeholder: "us-central1" },
    { key: "apiKey", label: "API Key", placeholder: "AIza..." },
  ],
};

// Mapeamento de campos extras para cada base vetorial
const VECTOR_DB_FIELDS: Record<string, { key: string; label: string; placeholder: string; }[]> = {
  chroma: [
    { key: "persistDirectory", label: "Diretório de Persistência", placeholder: "/data/chroma" },
  ],
  supabase: [
    { key: "supabaseUrl", label: "Supabase URL", placeholder: "https://xyz.supabase.co" },
    { key: "supabaseKey", label: "Supabase Key", placeholder: "public-anon-key" },
  ],
  pinecone: [
    { key: "apiKey", label: "Pinecone API Key", placeholder: "YOUR_API_KEY" },
    { key: "controllerHost", label: "Controller Host", placeholder: "controller.us-west1.pinecone.io" },
  ],
  qdrant: [
    { key: "url", label: "URL", placeholder: "http://localhost:6333" },
    { key: "port", label: "Porta", placeholder: "6333" },
    { key: "apiKey", label: "Qdrant API Key", placeholder: "minha-chave" },
  ],
  weaviate: [
    { key: "url", label: "Weaviate URL", placeholder: "https://meu-cluster.weaviate.cloud" },
    { key: "apiKey", label: "Weaviate API Key", placeholder: "meu-segredo" },
  ],
  milvus: [
    { key: "host", label: "Host", placeholder: "localhost" },
    { key: "port", label: "Porta", placeholder: "19530" },
    { key: "secure", label: "Usar TLS/SSL?", placeholder: "true ou false" },
  ],
};

const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";
const inputClasses =
  "mt-1 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 transition-all";

const ModelTab: React.FC<ModelTabProps> = props => {
  const {
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
  } = props;

  const [extraValues, setExtraValues] = useState<Record<string, any>>({});

  useEffect(() => {
    // reset when selections change
    setExtraValues({});
  }, [specificModel, vectorDb]);

  const extraModelFields = MODEL_CONFIG_FIELDS[specificModel] || [];
  const extraVectorFields = VECTOR_DB_FIELDS[vectorDb] || [];

  return (
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
          {(PROVIDER_MODELS[provider] ?? []).map(model => (
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

      {/* Campos extras para LLM selecionado */}
      {extraModelFields.length > 0 && (
        <div>
          <h3 className="text-md font-medium text-gray-800">Configuração específica para {specificModel}</h3>
          {extraModelFields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className={labelClasses}>{label}</label>
              <input
                type="text"
                value={extraValues[key] ?? (props as any)[key] ?? ""}
                onChange={e => {
                  const val = e.target.value;
                  setExtraValues(prev => ({ ...prev, [key]: val }));
                  const handler = (props as any)[`on${capitalize(key)}Change`];
                  if (typeof handler === "function") {
                    handler(val);
                  }
                }}
                placeholder={placeholder}
                className={inputClasses}
              />
            </div>
          ))}
        </div>
      )}

      {/* Campos extras para Base Vetorial selecionada */}
      {extraVectorFields.length > 0 && (
        <div>
          <h3 className="text-md font-medium text-gray-800">Configuração de {vectorDb}</h3>
          {extraVectorFields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className={labelClasses}>{label}</label>
              <input
                type={key === "secure" ? "checkbox" : "text"}
                checked={key === "secure" ? extraValues[key] ?? (props as any)[key] : undefined}
                value={key !== "secure" ? extraValues[key] ?? (props as any)[key] ?? "" : undefined}
                onChange={e => {
                  const val = key === "secure" ? e.target.checked : e.target.value;
                  setExtraValues(prev => ({ ...prev, [key]: val }));
                  const handler = (props as any)[`on${capitalize(key)}Change`];
                  if (typeof handler === "function") {
                    handler(val);
                  }
                }}
                placeholder={placeholder}
                className={inputClasses}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default ModelTab;
