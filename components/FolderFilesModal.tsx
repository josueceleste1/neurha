// components/FolderFilesModal.tsx
import React, { useState, DragEvent } from "react";
import {
  FileText,
  X,
  Edit2,
  Trash2,
  PlusCircle,
  Download as DownloadIcon,
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  size: string;
  url: string;
}

interface FolderFilesModalProps {
  isOpen: boolean;
  folderName: string;
  files: FileItem[];
  onClose: () => void;
  onRename: (fileId: string, newName: string) => void;
  onDelete: (fileId: string) => void;
  onAdd: (files: FileList) => void;
}

export default function FolderFilesModal({
  isOpen,
  folderName,
  files,
  onClose,
  onRename,
  onDelete,
  onAdd,
}: FolderFilesModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  function startEdit(fileId: string, currentName: string) {
    setEditingId(fileId);
    setDraftName(currentName.replace(/\.[^.]+$/, ""));
  }

  function confirmRename(file: FileItem) {
    const extMatch = file.name.match(/(\.[^.]+)$/);
    const newName = draftName.trim() + (extMatch ? extMatch[1] : "");
    onRename(file.id, newName);
    setEditingId(null);
  }

  function handleAdd(files: FileList) {
    onAdd(files);
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      handleAdd(e.target.files);
    }
    e.target.value = "";
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAdd(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`
          bg-[#5B21A4] rounded-2xl w-11/12 max-w-4xl h-[80vh] overflow-hidden shadow-2xl
          ${isDragging ? "border-4 border-dashed border-white/60" : ""}
        `}
      >
        {/* Header */}
        <div className="bg-white/10 border-b border-white/20 p-4 flex justify-between items-center">
          <h2 className="text-white text-2xl font-semibold truncate">
            {folderName}
          </h2>
          <div className="flex items-center space-x-4">
            <label
              title="Adicionar arquivos"
              className="cursor-pointer text-white/80 hover:text-white"
            >
              <PlusCircle className="w-6 h-6" />
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInputChange}
              />
            </label>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Grid of files */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-4rem)] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white/10 border border-white/20 rounded-lg p-2 flex flex-col items-start hover:bg-white/20 transition relative"
            >
              {/* Actions */}
              <div className="absolute top-2 right-2 flex space-x-1">
                <a
                  href={file.url}
                  download={file.name}
                  title="Baixar arquivo"
                  className="text-white/60 hover:text-white"
                >
                  <DownloadIcon className="w-4 h-4" />
                </a>
                <button onClick={() => startEdit(file.id, file.name)}>
                  <Edit2 className="w-4 h-4 text-white/60 hover:text-white" />
                </button>
                <button onClick={() => onDelete(file.id)}>
                  <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                </button>
              </div>

              {/* Icon */}
              <FileText className="w-5 h-5 text-purple-300 mb-1" />

              {/* Name / Edit input */}
              {editingId === file.id ? (
                <input
                  className="w-full max-w-full overflow-hidden truncate bg-transparent border-b border-white/50 text-white outline-none text-sm mb-1"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && confirmRename(file)}
                  onBlur={() => confirmRename(file)}
                  autoFocus
                />
              ) : (
                <span className="w-full max-w-full overflow-hidden truncate text-white text-sm mb-1">
                  {file.name}
                </span>
              )}

              {/* Size */}
              <span className="text-white/60 text-xs">{file.size}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
