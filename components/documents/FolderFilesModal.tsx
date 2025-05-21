import React, { useState } from "react";
import {
  UploadCloud,
  Search,
  Sliders,
  Download as DownloadIcon,
  Trash2,
  Loader2,
} from "lucide-react";
import { decodeFileName } from "@/utils/decodeFileName";

export interface DocumentItem {
  id: string;
  name: string;
  category: string;
  type: string;
  size: string;
  updated: string;
  url: string;
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface StorageStats {
  total: string;
  pdf: string;
  docs: string;
  sheets: string;
}

interface DocumentManagementPageProps {
  documents: DocumentItem[];
  recentDocuments: DocumentItem[];
  categories: CategoryCount[];
  storage: StorageStats;
  onDelete: (id: string) => void;
  onUpload: (files: FileList) => Promise<void>;
}

export default function DocumentManagementPage({
  documents,
  recentDocuments,
  categories,
  storage,
  onDelete,
  onUpload,
}: DocumentManagementPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      await onUpload(e.target.files);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Erro ao fazer upload dos arquivos');
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Documentos RH</h1>
        <label 
          className={`inline-flex items-center ${
            isUploading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
          } text-white px-4 py-2 rounded-lg cursor-pointer`}
          aria-label="Carregar Documento"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <UploadCloud className="w-5 h-5 mr-2" />
          )}
          {isUploading ? 'Carregando...' : 'Carregar Documento'}
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
            disabled={isUploading}
            accept=".pdf,.doc,.docx,.xls,.xlsx"
          />
        </label>
      </div>

      {uploadError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {uploadError}
        </div>
      )}

      {/* Table and Search */}
      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-1/3">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Pesquisar documentos..."
              className="w-full bg-transparent outline-none text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Pesquisar documentos"
            />
          </div>
          <button 
            className="flex items-center text-gray-600 hover:text-gray-800"
            aria-label="Aplicar filtros"
          >
            <Sliders className="w-5 h-5 mr-1" />
            Filtros
          </button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 text-sm border-b">
              <th className="py-2">Nome do Documento</th>
              <th>Categoría</th>
              <th>Tipo</th>
              <th>Tamanho</th>
              <th>Atualizado</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="py-3 text-gray-700 truncate max-w-xs">
                  {decodeFileName(doc.name)}
                </td>
                <td className="text-gray-700">{doc.category}</td>
                <td className="text-gray-700">{doc.type}</td>
                <td className="text-gray-700">{doc.size}</td>
                <td className="text-gray-700">{doc.updated}</td>
                <td className="py-3 text-right space-x-2">
                  <a
                    href={doc.url}
                    download={doc.name}
                    className="inline-block text-gray-500 hover:text-gray-700"
                    aria-label={`Baixar ${doc.name}`}
                  >
                    <DownloadIcon className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => onDelete(doc.id)}
                    aria-label={`Excluir ${doc.name}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Documentos Recentes
          </h3>
          <ul className="space-y-2 text-gray-700">
            {recentDocuments.map((doc) => (
              <li key={doc.id} className="flex justify-between">
                <span>{decodeFileName(doc.name)}</span>
                <span className="text-sm text-gray-500">{doc.updated}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Categorias</h3>
          <ul className="space-y-2 text-gray-700">
            {categories.map((cat) => (
              <li key={cat.name} className="flex justify-between">
                <span>{cat.name}</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded-full text-sm text-gray-600">
                  {cat.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Storage */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Armazenamento</h3>
          <div className="flex items-baseline justify-center bg-gray-100 rounded-lg py-8 mb-4">
            <span className="text-2xl font-semibold text-gray-800">
              {storage.total}
            </span>
            <span className="ml-2 text-gray-500">Espaço utilizado</span>
          </div>
          <ul className="space-y-1 text-gray-700">
            <li className="flex justify-between">
              <span>PDFs</span>
              <span>{storage.pdf}</span>
            </li>
            <li className="flex justify-between">
              <span>Documentos</span>
              <span>{storage.docs}</span>
            </li>
            <li className="flex justify-between">
              <span>Planilhas</span>
              <span>{storage.sheets}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
