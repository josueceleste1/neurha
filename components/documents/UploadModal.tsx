import React from "react";
import { UploadCloud, X } from "lucide-react";
import type { UploadModalProps } from "@/types/documents";

const UploadModal: React.FC<UploadModalProps> = ({ open, onClose, onSubmit, uploadData, setUploadData }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Fechar"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-purple-50 rounded-full">
            <UploadCloud className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Carregar Documento</h2>
            <p className="text-sm text-gray-500 mt-0.5">Adicione um novo documento à base de documentos de RH.</p>
          </div>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!uploadData.file) return;
            const formData = new FormData();
            formData.append('files', uploadData.file);
            formData.append('name', uploadData.name);
            formData.append('category', uploadData.category);
            formData.append('description', uploadData.description);

            // Log dos dados do formulário
            console.log('Dados do documento:', {
              nome: uploadData.name,
              categoria: uploadData.category,
              descrição: uploadData.description,
              arquivo: {
                nome: uploadData.file.name,
                tipo: uploadData.file.type,
                tamanho: `${(uploadData.file.size / 1024).toFixed(2)} KB`
              }
            });

            await onSubmit(formData);
            setUploadData({ name: '', category: '', description: '', file: null });
            onClose();
          }}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Documento</label>
            <input
              className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base font-medium placeholder:text-gray-400"
              placeholder="Digite o nome do documento"
              value={uploadData.name}
              onChange={e => setUploadData({ ...uploadData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria</label>
            <input
              className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base font-medium placeholder:text-gray-400"
              placeholder="Ex: Onboarding, Políticas"
              value={uploadData.category}
              onChange={e => setUploadData({ ...uploadData, category: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
            <textarea
              className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base font-medium placeholder:text-gray-400 min-h-[100px] resize-y"
              placeholder="Breve descrição do documento"
              value={uploadData.description}
              onChange={e => setUploadData({ ...uploadData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Arquivo</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-500 transition-colors">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none"
                  >
                    <span>Selecione um arquivo</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                      onChange={e => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                      required
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500">
                  Formatos aceitos: PDF, DOC, DOCX, XLS, XLSX, CSV, TXT
                </p>
              </div>
            </div>
            {uploadData.file && (
              <div className="mt-2 text-sm text-gray-700 text-center">
                <span className="font-medium">Arquivo selecionado:</span> {uploadData.file.name}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm"
            >
              Carregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal; 