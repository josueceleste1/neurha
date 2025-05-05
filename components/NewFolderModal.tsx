"use client";

import React, { FC } from "react";
import { X } from "lucide-react";

interface NewFolderModalProps {
  isOpen: boolean;
  folderName: string;
  onChange: (name: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const NewFolderModal: FC<NewFolderModalProps> = ({
  isOpen,
  folderName,
  onChange,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-xl w-80">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Nova Pasta</h3>
          <button onClick={onCancel}>
            <X />
          </button>
        </div>
        <input
          type="text"
          value={folderName}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nome da pasta"
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 text-black"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white"
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewFolderModal;
