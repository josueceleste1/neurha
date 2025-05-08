
export interface FileItem {
    id: string;
    name: string;
    size?: string;
    url: string;
  }
  
export interface FolderFilesModalProps {
  isOpen: boolean;
  folderName: string;
  files: FileItem[];
  onClose: () => void;
  onRename: (fileId: string, newName: string) => void;
  onDelete: (fileId: string) => void;
  onAdd: (files: FileList) => void;
}

export interface NewFolderModalProps {
  isOpen: boolean;
  folderName: string;
  onChange: (name: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface FolderItem {
  id: string;
  name: string;
  files: FileItem[];
}
