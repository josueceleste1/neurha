import React from "react";
import type { IngestionTabProps } from "@/types/agents";

const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";
const inputClasses =
  "mt-1 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 transition-all";
const helperTextClasses = "mt-1.5 text-xs text-gray-500";

const IngestionTab: React.FC<IngestionTabProps> = ({
  cron,
  onCronChange,
  chunkSize,
  onChunkSizeChange,
  chunkOverlap,
  onChunkOverlapChange,
  embeddingModel,
  onEmbeddingModelChange,
}) => (
  <div className="space-y-6">
    <h2 className="text-lg font-medium text-gray-800">Configuração de Ingestão de Dados</h2>

    {/* Agendamento */}
    <div>
      <label className={labelClasses}>Agendamento de Atualização</label>
      <input
        type="text"
        value={cron}
        onChange={e => onCronChange(e.target.value)}
        placeholder="*/30 * * * *"
        className={inputClasses}
      />
      <p className={helperTextClasses}>
        Formato cron. Exemplo: */30 * * * * (a cada 30 minutos)
      </p>
    </div>

    {/* Tamanho do Chunk */}
    <div>
      <label className={labelClasses}>Tamanho do Chunk</label>
      <select
        value={chunkSize}
        onChange={e => onChunkSizeChange(e.target.value)}
        className={inputClasses}
      >
        <option value="100">100 tokens</option>
        <option value="200">200 tokens</option>
        <option value="500">500 tokens</option>
        <option value="1000">1000 tokens</option>
      </select>
      <p className={helperTextClasses}>
        Tamanho dos fragmentos de texto para processamento
      </p>
    </div>

    {/* Sobreposição */}
    <div>
      <label className={labelClasses}>Sobreposição de Chunks</label>
      <input
        type="number"
        value={chunkOverlap}
        onChange={e => onChunkOverlapChange(e.target.value)}
        className={inputClasses}
      />
      <p className={helperTextClasses}>
        Quantidade de tokens que se sobrepõem entre chunks consecutivos
      </p>
    </div>

    {/* Embeddings */}
    <div>
      <label className={labelClasses}>Modelo de Embeddings</label>
      <select
        value={embeddingModel}
        onChange={e => onEmbeddingModelChange(e.target.value)}
        className={inputClasses}
      >
        <option value="text-embedding-3-small">OpenAI text-embedding-3-small</option>
        <option value="text-embedding-3-large">OpenAI text-embedding-3-large</option>
      </select>
      <p className={helperTextClasses}>
        Modelo utilizado para gerar embeddings vetoriais dos documentos
      </p>
    </div>
  </div>
);

export default IngestionTab;
