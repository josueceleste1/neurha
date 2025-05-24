import type React from "react";

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

export interface DocumentManagementPageProps {
  documents: DocumentItem[];
  recentDocuments: DocumentItem[];
  categories: CategoryCount[];
  storage: StorageStats;
  onDelete: (id: string) => void;
  onUpload: (files: FileList) => Promise<void>;
}

export interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  uploadData: {
    name: string;
    category: string;
    description: string;
    file: File | null;
    agentId: string;
  };
  setUploadData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      category: string;
      description: string;
      file: File | null;
      agentId: string;
    }>
  >;
  agents: { id: string; name: string }[];
}
