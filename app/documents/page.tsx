// app/documents/page.tsx
"use client";

import React, { useState, useCallback, DragEvent } from "react";
import Header from "@/components/Header";
import NewFolderModal from "@/components/NewFolderModal";
import FolderFilesModal from "@/components/FolderFilesModal";
import {
  Folder as FolderIcon,
  FileText,
  PlusCircle,
  X,
  Edit2,
  Trash2,
  Upload as UploadIcon,
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  size?: string;
  url: string;
}

interface FolderItem {
  id: string;
  name: string;
  files: FileItem[];
}

export default function DocumentsPage() {
  const [folders, setFolders] = useState<FolderItem[]>([
    {
      id: crypto.randomUUID(),
      name: "Políticas de RH",
      files: [
        {
          id: crypto.randomUUID(),
          name: "Manual_de_ferias.pdf",
          size: "1.2 MB",
          url: "/downloads/Manual_de_ferias.pdf",
        },
        {
          id: crypto.randomUUID(),
          name: "Regras_ponto.pdf",
          size: "800 KB",
          url: "/downloads/Regras_ponto.pdf",
        },
        {
          id: crypto.randomUUID(),
          name: "Diretrizes_confidencial.pdf",
          size: "2.5 MB",
          url: "/downloads/Diretrizes_confidencial.pdf",
        },
        {
          id: crypto.randomUUID(),
          name: "Politica_de_seguranca.pdf",
          size: "3 MB",
          url: "/downloads/Politica_de_seguranca.pdf",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Benefícios",
      files: [
        {
          id: crypto.randomUUID(),
          name: "Vale-refeição.pdf",
          size: "1 MB",
          url: "/downloads/Vale-refeicao.pdf",
        },
        {
          id: crypto.randomUUID(),
          name: "Plano_saude.pdf",
          size: "1.8 MB",
          url: "/downloads/Plano_saude.pdf",
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Financeiro",
      files: [
        {
          id: crypto.randomUUID(),
          name: "Reembolso.pdf",
          size: "600 KB",
          url: "/downloads/Reembolso.pdf",
        },
      ],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingTarget, setEditingTarget] = useState<string | null>(null);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [filesModalFolder, setFilesModalFolder] = useState<string | null>(null);

  const handleMoveFile = useCallback(
    (fileId: string, sourceId: string, targetId: string) => {
      if (sourceId === targetId) return;
      setFolders((prev) => {
        let moving: FileItem | null = null;
        const without = prev.map((f) => {
          if (f.id === sourceId) {
            const remaining = f.files.filter((fi) => {
              if (fi.id === fileId) {
                moving = fi;
                return false;
              }
              return true;
            });
            return { ...f, files: remaining };
          }
          return f;
        });
        if (!moving) return prev;
        return without.map((f) =>
          f.id === targetId ? { ...f, files: [...f.files, moving!] } : f
        );
      });
    },
    []
  );

  const deleteFolder = useCallback(
    (id: string) => {
      setFolders((prev) => prev.filter((f) => f.id !== id));
      if (filesModalFolder === id) setFilesModalFolder(null);
    },
    [filesModalFolder]
  );

  const confirmAddFolder = useCallback(() => {
    const name = newFolderName.trim();
    if (!name) return;
    if (editingTarget) {
      setFolders((prev) =>
        prev.map((f) => (f.id === editingTarget ? { ...f, name } : f))
      );
    } else {
      setFolders((prev) => [
        ...prev,
        { id: crypto.randomUUID(), name, files: [] },
      ]);
    }
    setNewFolderName("");
    setIsModalOpen(false);
    setEditingTarget(null);
  }, [newFolderName, editingTarget]);

  const handleUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || !uploadTarget) return;
      const f = files[0];
      const blobUrl = URL.createObjectURL(f);
      const newFile: FileItem = {
        id: crypto.randomUUID(),
        name: f.name,
        size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
        url: blobUrl,
      };
      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === uploadTarget
            ? { ...folder, files: [...folder.files, newFile] }
            : folder
        )
      );
      e.target.value = "";
      setUploadTarget(null);
    },
    [uploadTarget]
  );

  const currentFolder =
    folders.find((f) => f.id === filesModalFolder) || null;

  const userName = "João Silva";
  const handleLogout = () => console.log("Logout");

  return (
    <div className="flex h-screen overflow-x-hidden">
      <main className="flex-1 flex flex-col bg-gradient-to-br from-[#4C1D95] via-[#7E22CE] to-[#1E1B4B] text-white overflow-auto">
        <Header
          title="Documentos"
          icon={<FolderIcon className="w-6 h-6 text-purple-300" />}
          userName={userName}
          onLogout={handleLogout}
        />

        <div className="px-10 py-4">
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="relative bg-white/10 border border-white/20 p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() => setFilesModalFolder(folder.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e: DragEvent) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const dropped = Array.from(e.dataTransfer.files || []);
                  if (dropped.length) {
                    const newFiles = dropped.map((file) => {
                      const url = URL.createObjectURL(file);
                      return {
                        id: crypto.randomUUID(),
                        name: file.name,
                        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                        url,
                      };
                    });
                    setFolders((prev) =>
                      prev.map((f) =>
                        f.id === folder.id
                          ? { ...f, files: [...f.files, ...newFiles] }
                          : f
                      )
                    );
                    return;
                  }
                  const data = e.dataTransfer.getData("application/json");
                  if (!data) return;
                  try {
                    const { fileId, sourceId } = JSON.parse(data);
                    handleMoveFile(fileId, sourceId, folder.id);
                  } catch {}
                }}
              >
                <div
                  className="absolute top-3 right-3 flex space-x-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <label
                    title="Upload na pasta"
                    className="cursor-pointer"
                    onClick={() => setUploadTarget(folder.id)}
                  >
                    <UploadIcon className="w-5 h-5 text-white/80 hover:text-white" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleUpload}
                    />
                  </label>
                  <button
                    title="Editar pasta"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTarget(folder.id);
                      setNewFolderName(folder.name);
                      setIsModalOpen(true);
                    }}
                  >
                    <Edit2 className="w-5 h-5 text-white/80 hover:text-white" />
                  </button>
                  <button
                    title="Excluir pasta"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Excluir pasta "${folder.name}"?`))
                        deleteFolder(folder.id);
                    }}
                  >
                    <Trash2 className="w-5 h-5 text-white/80 hover:text-white" />
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <FolderIcon className="w-5 h-5 text-purple-300" />
                  <span className="text-white/90 text-sm font-medium truncate">
                    {folder.name}
                  </span>
                </div>

                <div className="space-y-2">
                  {folder.files.slice(0, 3).map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 bg-white/5 p-2 rounded-lg"
                    >
                      <FileText className="w-4 h-4 text-purple-300" />
                      <a
                        href={file.url}
                        download={file.name}
                        className="text-white/80 text-xs truncate hover:underline"
                      >
                        {file.name}
                      </a>
                    </div>
                  ))}
                  {folder.files.length > 3 && (
                    <div className="text-white/60 text-xs">
                      +{folder.files.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-2 z-50">
            {fabOpen && (
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setFabOpen(false);
                  }}
                  className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white shadow-lg"
                  title="Nova Pasta"
                >
                  <PlusCircle />
                </button>
                <span className="text-white font-medium text-sm">
                  Nova Pasta
                </span>
              </div>
            )}
            <button
              onClick={() => setFabOpen((o) => !o)}
              className="w-14 h-14 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl"
              title="Menu"
            >
              {fabOpen ? <X /> : <PlusCircle />}
            </button>
          </div>

          <NewFolderModal
            isOpen={isModalOpen}
            folderName={newFolderName}
            onChange={setNewFolderName}
            onConfirm={confirmAddFolder}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingTarget(null);
            }}
          />

          <FolderFilesModal
            isOpen={Boolean(currentFolder)}
            folderName={currentFolder?.name || ""}
            files={
              currentFolder?.files.map((f) => ({
                id: f.id,
                name: f.name,
                size: f.size || "0 KB",
                url: f.url,
              })) || []
            }
            onClose={() => setFilesModalFolder(null)}
            onRename={(fileId, newName) => {
              setFolders((prev) =>
                prev.map((folder) =>
                  folder.id === filesModalFolder
                    ? {
                        ...folder,
                        files: folder.files.map((file) =>
                          file.id === fileId ? { ...file, name: newName } : file
                        ),
                      }
                    : folder
                )
              );
            }}
            onDelete={(fileId) => {
              setFolders((prev) =>
                prev.map((folder) =>
                  folder.id === filesModalFolder
                    ? {
                        ...folder,
                        files: folder.files.filter((f) => f.id !== fileId),
                      }
                    : folder
                )
              );
            }}
            onAdd={(fileList) => {
              const newFiles = Array.from(fileList).map((f) => {
                const url = URL.createObjectURL(f);
                return {
                  id: crypto.randomUUID(),
                  name: f.name,
                  size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
                  url,
                };
              });
              setFolders((prev) =>
                prev.map((folder) =>
                  folder.id === filesModalFolder
                    ? { ...folder, files: [...folder.files, ...newFiles] }
                    : folder
                )
              );
            }}
          />
        </div>
      </main>
    </div>
  );
}
