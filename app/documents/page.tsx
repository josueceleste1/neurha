"use client";

import React, { FC, useState, useEffect, useCallback, DragEvent } from "react";
import Header from "@/components/ui/Header";
import NewFolderModal from "@/components/documents/NewFolderModal";
import FolderFilesModal from "@/components/documents/FolderFilesModal";
import { decodeFileName } from "@/utils/decodeFileName";
import { FileItem, FolderItem } from "@/types/files";

import {
  Folder as FolderIcon,
  FileText,
  PlusCircle,
  X,
  Edit2,
  Trash2,
  Upload as UploadIcon,
} from "lucide-react";


const DocumentsPage: FC = () => {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [uploadFolderId, setUploadFolderId] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  const loadFolders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents");
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: FolderItem[] = await res.json();
      setFolders(data);
    } catch (err) {
      console.error("Error loading folders", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  const handleSaveFolder = useCallback(async () => {
    const name = newFolderName.trim();
    if (!name) return;
    const url = editingFolderId ? `/api/documents/${editingFolderId}` : "/api/documents";
    const method = editingFolderId ? "PATCH" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await loadFolders();
    } catch (err) {
      console.error("Save folder failed", err);
    } finally {
      setNewFolderName("");
      setIsModalOpen(false);
      setEditingFolderId(null);
    }
  }, [newFolderName, editingFolderId, loadFolders]);

  const handleDeleteFolder = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        await loadFolders();
        if (currentFolderId === id) setCurrentFolderId(null);
      } catch (err) {
        console.error("Delete folder failed", err);
      }
    },
    [currentFolderId, loadFolders]
  );

  const uploadFilesToFolder = useCallback(
    async (folderId: string, files: FileList) => {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append("files", f));
      try {
        const res = await fetch(`/api/documents/${folderId}/upload`, {
          method: "POST",
          body: form,
        });
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        await loadFolders();
      } catch (err) {
        console.error("Falha no upload", err);
      }
    },
    [loadFolders]
  );

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || !uploadFolderId) return;
      await uploadFilesToFolder(uploadFolderId, files);
      e.target.value = "";
      setUploadFolderId(null);
    },
    [uploadFolderId, uploadFilesToFolder]
  );

  const handleDeleteFile = useCallback(
    async (fileId: string) => {
      if (!currentFolderId) return;
      try {
        const res = await fetch(
          `/api/documents/${currentFolderId}/files/${fileId}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        await loadFolders();
      } catch (err) {
        console.error("Delete file failed", err);
      }
    },
    [currentFolderId, loadFolders]
  );

  const handleRenameFile = useCallback(
    (fileId: string, newName: string) => {
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === currentFolderId
            ? {
              ...folder,
              files: folder.files.map((file) =>
                file.id === fileId ? { ...file, name: newName } : file
              ),
            }
            : folder
        )
      );
    },
    [currentFolderId]
  );

  const currentFolder = folders.find((f) => f.id === currentFolderId) || null;

  return (
    <div className="flex h-screen overflow-x-hidden">
      <main className="flex-1 flex flex-col bg-gradient-to-br from-[#4C1D95] via-[#7E22CE] to-[#1E1B4B] text-white">
        <Header
          title="Documentos"
          icon={<FolderIcon className="w-6 h-6 text-purple-300" />}
          userName="Josué Celeste "
          onLogout={() => console.log("Logout")}
        />

        <div className="px-6 py-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
          >
            Nova Pasta
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-white">Carregando...</div>
        ) : (
          <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="relative bg-white/10 border border-white/20 p-4 rounded-xl shadow hover:shadow-lg cursor-pointer"
                onClick={() => setCurrentFolderId(folder.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e: DragEvent) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const data = e.dataTransfer.getData("application/json");
                  if (data) {
                    try {
                      const { fileId, sourceId } = JSON.parse(data);
                    } catch { }
                  }
                }}
              >
                <div className="absolute top-2 right-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <label title="Upload" className="cursor-pointer" onClick={() => setUploadFolderId(folder.id)}>
                    <UploadIcon className="w-5 h-5 text-white/80 hover:text-white" />
                    <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                  </label>
                  <button
                    title="Editar"
                    onClick={() => {
                      setEditingFolderId(folder.id);
                      setNewFolderName(folder.name);
                      setIsModalOpen(true);
                    }}
                  >
                    <Edit2 className="w-5 h-5 text-white/80 hover:text-white" />
                  </button>
                  <button title="Excluir" onClick={() => handleDeleteFolder(folder.id)}>
                    <Trash2 className="w-5 h-5 text-white/80 hover:text-white" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <FolderIcon className="w-5 h-5 text-purple-300" />
                  <span className="text-white font-medium truncate">{folder.name}</span>
                </div>

                <div className="space-y-2">
                  {folder.files.slice(0, 3).map((file) => (
                    <div
                      key={file.id}
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData(
                          "application/json",
                          JSON.stringify({ fileId: file.id, sourceId: folder.id })
                        )
                      }
                      className="flex items-center gap-2 bg-white/5 p-2 rounded-lg"
                    >
                      <FileText className="w-4 h-4 text-purple-300" />
                      <a href={file.url} download={decodeFileName(file.name || (file as any).originalName)} className="text-white/80 text-xs truncate hover:underline">
                        {decodeFileName(file.name || (file as any).originalName)}
                      </a>
                    </div>
                  ))}
                  {folder.files.length > 3 && (
                    <div className="text-white/60 text-xs">+{folder.files.length - 3} mais</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <FolderFilesModal
          isOpen={!!currentFolder}
          folderName={currentFolder?.name || ""}
          files={
            currentFolder?.files.map((f) => ({
              id: f.id,
              name: f.name ?? (f as any).originalName,
              size: f.size || "0 KB",
              url: f.url,
            })) || []
          }
          onClose={() => setCurrentFolderId(null)}
          onDelete={handleDeleteFile}
          onRename={handleRenameFile}
          onAdd={(fileList) => {
            if (currentFolderId) {
              uploadFilesToFolder(currentFolderId, fileList);
            }
          }}
        />

        <NewFolderModal
          isOpen={isModalOpen}
          folderName={newFolderName}
          onChange={setNewFolderName}
          onConfirm={handleSaveFolder}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingFolderId(null);
          }}
        />
      </main>
    </div>
  );
};

export default DocumentsPage;
