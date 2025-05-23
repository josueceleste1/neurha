import React, { useRef } from "react";
import { Upload, Database as DatabaseIcon, FileText } from "lucide-react";
import type { MyDocument, KnowledgeTabProps } from "@/types/agents";


const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
const inputClasses = "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 transition-all";
const helperTextClasses = "mt-1 text-xs text-gray-500";

const KnowledgeTab: React.FC<KnowledgeTabProps> = ({
  onFilesChange,
  sourceUrl,
  onSourceUrlChange,
  onAddUrl,
  myDocuments,
  selectedDocs,
  onSelectedDocsChange,
  onConnectSharePoint,
  onConnectGoogleDrive,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredDocs = myDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDoc = (id: string) => {
    if (selectedDocs.includes(id)) {
      onSelectedDocsChange(selectedDocs.filter(docId => docId !== id));
    } else {
      onSelectedDocsChange([...selectedDocs, id]);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-800">Fontes de Conhecimento</h2>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className={labelClasses}>Documentos Existentes</label>
          <span className="text-sm font-medium text-gray-700">
            Selecionados: <span className="font-semibold text-purple-600">{selectedDocs.length}</span>
          </span>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar documentos..."
          className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-400"
        />
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filteredDocs.map(doc => (
            <div
              key={doc.id}
              onClick={() => toggleDoc(doc.id)}
              className={
                `flex items-center gap-2 p-2 rounded-xl border transition-shadow transition-colors cursor-pointer ` +
                (selectedDocs.includes(doc.id)
                  ? "bg-purple-100 border-purple-400 shadow"
                  : "bg-white border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50")
              }
            >
              <input
                type="checkbox"
                checked={selectedDocs.includes(doc.id)}
                onChange={() => toggleDoc(doc.id)}
                className="h-4 w-4 accent-purple-600 transform scale-110"
              />
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-gray-800 font-medium text-sm">{doc.name}</span>
            </div>
          ))}
        </div>
        <p className={helperTextClasses}>
          Selecione os documentos que farão parte da base de conhecimento deste agente.
        </p>
      </div>

      <label className="block w-full border-2 border-dashed p-2 text-center rounded-xl hover:border-purple-500 transition-colors cursor-pointer bg-gray-50 shadow-sm hover:shadow-md">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={e => onFilesChange(e.target.files)}
        />
        <Upload className="mx-auto h-6 w-6 text-gray-400" />
        <p className="mt-1 text-xs text-gray-600">Arraste arquivos ou clique</p>
        <p className="text-[0.6rem] text-gray-500 mt-0.5">PDF, DOCX, TXT, CSV</p>
        <button
          type="button"
          className="mt-1 px-2 py-1 bg-white border border-gray-300 rounded-md text-[0.65rem] font-medium hover:bg-gray-50 shadow-sm transition-all"
          onClick={() => fileInputRef.current?.click()}
        >
          Selecionar
        </button>
      </label>

      <div>
        <label className={labelClasses}>Adicionar URL</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={sourceUrl}
            onChange={e => onSourceUrlChange(e.target.value)}
            placeholder="https://site.com/documento"
            className={inputClasses}
          />
          <button
            type="button"
            onClick={onAddUrl}
            className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium shadow-sm transition-all text-xs"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Conectar com Serviços</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onConnectSharePoint}
            className="flex items-center gap-2 p-2 rounded-xl border transition-shadow hover:shadow-md hover:bg-gray-50 cursor-pointer bg-white shadow-sm"
          >
            <DatabaseIcon className="h-5 w-5 text-blue-500" />
            <div>
              <p className="font-medium text-sm">SharePoint</p>
              <p className="text-[0.65rem] text-gray-500">Conecte um site</p>
            </div>
          </button>
          <button
            type="button"
            onClick={onConnectGoogleDrive}
            className="flex items-center gap-2 p-2 rounded-xl border transition-shadow hover:shadow-md hover:bg-gray-50 cursor-pointer bg-white shadow-sm"
          >
            <DatabaseIcon className="h-5 w-5 text-green-500" />
            <div>
              <p className="font-medium text-sm">Google Drive</p>
              <p className="text-[0.65rem] text-gray-500">Conecte pastas</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeTab;
