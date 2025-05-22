"use client";

import React, { FC, useState, useEffect } from "react";
import {
  UploadCloud,
  Search,
  Sliders,
  Download as DownloadIcon,
  Trash2,
  FileText,
  PlusCircle,
  Edit,
  FileUp,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { decodeFileName } from "@/utils/decodeFileName";
import Header from "@/components/ui/Header";
import { toast } from 'sonner';
import ReactPaginate from 'react-paginate';
import UploadModal from '@/components/documents/UploadModal';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getFileType, formatFileSize } from '@/utils/fileUtils';
import type { DocumentItem, CategoryCount, StorageStats } from '@/types/documents';

const NEST_API_URL = "http://localhost:3001/api/v1";


const DocumentsPage: FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [recentDocs, setRecentDocs] = useState<DocumentItem[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; docId: string | null }>({ show: false, docId: null });
  const [editModal, setEditModal] = useState<{ show: boolean; doc: DocumentItem | null }>({ show: false, doc: null });
  const [newName, setNewName] = useState("");
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({ name: '', category: '', description: '', file: null as File | null });
  const itemsPerPage = 5;

  const userName = "Josué Celeste";
  const handleLogout = () => console.log("Logout");

  const loadData = async () => {
    console.log("Iniciando loadData");
    setLoading(true);
    try {
      const res = await fetch(`${NEST_API_URL}/documents`, { credentials: "include" });
      console.log("Resposta da API:", res);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      console.log("Dados recebidos:", data);
      setDocuments(Array.isArray(data) ? data : []);
      setRecentDocs(Array.isArray(data.recent) ? data.recent : []);
      setCategories(Array.isArray(data.categories) ? data.categories : []);
    } catch (err) {
      console.error("Error loading documents", err);
      toast.error('Erro ao carregar documentos');
    } finally {
      setLoading(false);
      console.log("Finalizou loadData");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch("/api/documents/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast.success('Documento(s) carregado(s) com sucesso');
      await loadData();
    } catch (err) {
      console.error("Upload failed", err);
      toast.error('Erro ao fazer upload do(s) documento(s)');
    }
  };

  const handleUploadCustom = async (formData: FormData) => {
    console.log("Enviando para API NestJS /documents/upload", Array.from(formData.entries()));
    try {
      const res = await fetch(`${NEST_API_URL}/documents/upload`, { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast.success('Documento carregado com sucesso');
      await loadData();
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error('Erro ao fazer upload do documento');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${NEST_API_URL}/documents/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include"
      });

      let errorMessage = 'Erro ao deletar documento';

      try {
        const data = await res.json();
        if (!res.ok) {
          errorMessage = data.error || errorMessage;
          throw new Error(errorMessage);
        }
      } catch (parseError) {
        if (!res.ok) {
          throw new Error(errorMessage);
        }
      }

      toast.success('Documento deletado com sucesso');
      setDocuments(documents.filter(doc => doc.id !== id));
      if (paginatedDocs.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      setDeleteModal({ show: false, docId: null });
    } catch (err) {
      console.error("Delete failed:", err);
      const message = err instanceof Error ? err.message : 'Erro ao deletar documento';
      toast.error(message);
    }
  };

  const handleEdit = async (id: string, newName: string) => {
    try {
      const res = await fetch(`${NEST_API_URL}/documents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName }),
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao renomear documento');
      }

      toast.success('Documento renomeado com sucesso');
      await loadData();
      setEditModal({ show: false, doc: null });
      setNewName("");
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error(err instanceof Error ? err.message : 'Erro ao renomear documento');
    }
  };

  const filtered = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedDocs = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Funções utilitárias para cálculo dos totalizadores
  function parseSize(sizeStr: string): number {
    if (!sizeStr) return 0;
    const [value, unit] = sizeStr.split(' ');
    const num = parseFloat(value);
    switch ((unit || '').toUpperCase()) {
      case 'BYTES': return num;
      case 'KB': return num * 1024;
      case 'MB': return num * 1024 * 1024;
      case 'GB': return num * 1024 * 1024 * 1024;
      default: return 0;
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Cálculo dos totalizadores
  const totalBytes = documents.reduce((acc, doc) => acc + parseSize(doc.size), 0);
  const pdfBytes = documents.filter(doc => doc.type === 'application/pdf').reduce((acc, doc) => acc + parseSize(doc.size), 0);
  const docsBytes = documents.filter(doc => ['application/msword', 'text/plain'].includes(doc.type)).reduce((acc, doc) => acc + parseSize(doc.size), 0);
  const sheetsBytes = documents.filter(doc => ['application/vnd.ms-excel', 'text/csv'].includes(doc.type)).reduce((acc, doc) => acc + parseSize(doc.size), 0);

  const storage = {
    total: formatFileSize(totalBytes),
    pdf: formatFileSize(pdfBytes),
    docs: formatFileSize(docsBytes),
    sheets: formatFileSize(sheetsBytes),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4C1D95] via-[#7E22CE] to-[#1E1B4B]">
      <Header
        title="Documentos"
        icon={<FileText className="w-6 h-6 text-purple-300" />}
        userName={userName}
        onLogout={handleLogout}
      />

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all animate-scaleIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-red-50 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmar exclusão</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, docId: null })}
                className="px-4 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 hover:text-gray-900 hover:shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteModal.docId && handleDelete(deleteModal.docId)}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Document Modal */}
      {editModal.show && editModal.doc && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all animate-scaleIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-purple-50 rounded-full">
                <Edit className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Editar documento</h3>
            </div>
            <div className="mb-6">
              <label htmlFor="newName" className="block text-sm font-medium text-gray-700 mb-2">
                Novo nome do documento
              </label>
              <input
                type="text"
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Digite o novo nome"
                className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base font-medium placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditModal({ show: false, doc: null });
                  setNewName("");
                }}
                className="px-4 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 hover:text-gray-900 hover:shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
              >
                Cancelar
              </button>
              <button
                onClick={() => editModal.doc && handleEdit(editModal.doc.id, newName)}
                disabled={!editModal.doc}
                className="px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600 hover:shadow-lg transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de upload customizado */}
      <UploadModal
        open={uploadModal}
        onClose={() => setUploadModal(false)}
        onSubmit={handleUploadCustom}
        uploadData={uploadData}
        setUploadData={setUploadData}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-1 border-t-4 border-[#7E22CE] min-h-[90px]">
            <span className="text-xs text-gray-500">Total</span>
            <h3 className="text-xl font-bold text-gray-900">{storage.total}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Armazenamento utilizado</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-1 border-t-4 border-[#A21CAF] min-h-[90px]">
            <span className="text-xs text-gray-500">PDFs</span>
            <h3 className="text-xl font-bold text-gray-900">{storage.pdf}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Documentos PDF</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-1 border-t-4 border-[#C026D3] min-h-[90px]">
            <span className="text-xs text-gray-500">Documentos</span>
            <h3 className="text-xl font-bold text-gray-900">{storage.docs}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Arquivos DOC, DOCX, TXT</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-1 border-t-4 border-[#818CF8] min-h-[90px]">
            <span className="text-xs text-gray-500">Planilhas</span>
            <h3 className="text-xl font-bold text-gray-900">{storage.sheets}</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Arquivos XLS, XLSX, CSV</p>
          </div>
        </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Carregando documentos...
            </div>
          ) : (
            <div className="w-full p-6 bg-white rounded-xl shadow-md border border-gray-200 mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Gerenciar Documentos</h2>
                <label
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                  onClick={() => setUploadModal(true)}
                >
                  <UploadCloud className="w-4 h-4" />
                  Carregar Documento
                </label>
              </div>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Buscar documentos..."
                  className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-4 py-3 text-left">Nome</th>
                      <th className="px-2 py-3 text-center">Categoria</th>
                      <th className="px-2 py-3 text-center">Tamanho</th>
                      <th className="px-2 py-3 text-center">Atualizado</th>
                      <th className="px-3 py-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {paginatedDocs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <FileUp className="w-8 h-8 text-purple-300 mb-2" />
                            <span className="text-lg font-semibold text-gray-900">Nenhum documento encontrado</span>
                            <span className="text-gray-500 text-sm">
                              {searchTerm ? 'Nenhum documento corresponde à sua busca.' : 'Comece adicionando seu primeiro documento.'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedDocs.map((doc) => (
                        <tr key={doc.id || Math.random()} className="hover:bg-gray-50">
                          <td className="px-4 py-4 font-medium text-gray-900 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-600" />
                            <span className="truncate max-w-[220px] block">{decodeFileName(doc.name || "")}</span>
                          </td>
                          <td className="px-2 py-4 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800">
                              {doc.category || "Geral"}
                            </span>
                          </td>
                          <td className="px-2 py-4 text-gray-700 text-center">{doc.size || ""}</td>
                          <td className="px-2 py-4 text-sm text-gray-600 text-center">{doc.updated || ""}</td>
                          <td className="px-3 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <a
                                href={`${NEST_API_URL}/documents/${doc.id}/download`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800"
                                title="Baixar"
                              >
                                <DownloadIcon className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => {
                                  setEditModal({ show: true, doc });
                                  setNewName(decodeFileName(doc.name || ""));
                                }}
                                className="text-blue-600 hover:text-blue-800"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteModal({ show: true, docId: doc.id })}
                                className="text-red-600 hover:text-red-800"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-6 pb-4">
                <ReactPaginate
                  previousLabel={<span className="px-2 py-1">Anterior</span>}
                  nextLabel={<span className="px-2 py-1">Próxima</span>}
                  breakLabel={"..."}
                  pageCount={totalPages}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  onPageChange={(selected) => setCurrentPage(selected.selected + 1)}
                  forcePage={currentPage - 1}
                  containerClassName="flex items-center gap-1"
                  pageClassName=""
                  pageLinkClassName="px-3 py-1.5 rounded border border-gray-200 bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors text-sm"
                  previousClassName=""
                  previousLinkClassName="px-3 py-1.5 rounded border border-gray-200 bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors text-sm"
                  nextClassName=""
                  nextLinkClassName="px-3 py-1.5 rounded border border-gray-200 bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors text-sm"
                  breakClassName=""
                  breakLinkClassName="px-3 py-1.5 rounded border border-gray-200 bg-white text-gray-700"
                  activeClassName=""
                  activeLinkClassName="!bg-purple-600 !text-white border-purple-600"
                  disabledClassName="opacity-50 cursor-not-allowed"
                />
              </div>
            </div>
          )}
      </main>
    </div>
  );
};

export default DocumentsPage;
