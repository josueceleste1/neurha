import React, { ChangeEvent, useRef } from "react";
import { Upload, Database as DatabaseIcon } from "lucide-react";
import type { MyDocument } from "@/components/agents/AgentForm";

export interface KnowledgeTabProps {
  onFilesChange: (files: FileList | null) => void;
  url: string;
  onUrlChange: (value: string) => void;
  onAddUrl: () => void;
  myDocuments: MyDocument[];
  selectedDocs: string[];
  onSelectedDocsChange: (docs: string[]) => void;
  onConnectSharePoint: () => void;
  onConnectGoogleDrive: () => void;
}

const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";
const inputClasses = "mt-1 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 transition-all";
const helperTextClasses = "mt-1.5 text-xs text-gray-500";

const KnowledgeTab: React.FC<KnowledgeTabProps> = ({
  onFilesChange,
  url,
  onUrlChange,
  onAddUrl,
  myDocuments,
  selectedDocs,
  onSelectedDocsChange,
  onConnectSharePoint,
  onConnectGoogleDrive,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-800">Fontes de Conhecimento</h2>

      <label className="block w-full border-2 border-dashed p-8 text-center rounded-lg hover:border-purple-500 transition-colors cursor-pointer bg-gray-50">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={e => onFilesChange(e.target.files)}
        />
        <Upload className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-3 text-sm text-gray-600 font-medium">Arraste arquivos ou clique para fazer upload</p>
        <p className="text-xs text-gray-500 mt-1">Formatos suportados: PDF, DOCX, TXT, CSV</p>
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 shadow-sm transition-all"
          onClick={() => fileInputRef.current?.click()}
        >
          Selecionar Arquivos
        </button>
      </label>

      <div>
        <label className={labelClasses}>Adicionar URL</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={e => onUrlChange(e.target.value)}
            placeholder="https://site.com/documento"
            className={inputClasses}
          />
          <button
            type="button"
            onClick={onAddUrl}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium shadow-sm transition-all"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Conectar com Serviços</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onConnectSharePoint}
            className="flex items-center gap-3 p-4 border rounded-md hover:bg-gray-50 transition-all shadow-sm"
          >
            <DatabaseIcon className="h-6 w-6 text-blue-500" />
            <div>
              <p className="font-medium">SharePoint</p>
              <p className="text-sm text-gray-500">Conecte um site do SharePoint</p>
            </div>
          </button>
          <button
            type="button"
            onClick={onConnectGoogleDrive}
            className="flex items-center gap-3 p-4 border rounded-md hover:bg-gray-50 transition-all shadow-sm"
          >
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
          onChange={e =>
            onSelectedDocsChange(
              Array.from(e.target.selectedOptions).map(o => o.value)
            )
          }
          className={`${inputClasses} h-40`}
        >
          {myDocuments.map(doc => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
        <p className={helperTextClasses}>Selecione múltiplos documentos usando Ctrl ou Cmd</p>
      </div>
    </div>
  );
};

export default KnowledgeTab;
