// types/agents.ts

export type AgentStatus = "Ativo" | "Inativo";

export interface Agent {
  name: string;
  status: AgentStatus;
  documents: number;
  updatedAt: string;
}

export interface MyDocument { id: string; name: string; }

export interface AgentData {
  id: string;
  name: string;
  description?: string;
  tags?: string;
  status?: "active" | "inactive";
  documentIds?: string[];
}

export interface AgentFormProps {
  onCancel: () => void;
  myDocuments: MyDocument[];
  mode?: "create" | "edit";
  agent?: AgentData | null;
  onSave?: () => void;
}

export interface ToastData { title: string; description: string; }

export interface ApiTabProps {
  apiToken: string;
  isApiActive: boolean;
  onGenerateToken(): void;
  onApiToggle(active: boolean): void;
}

export interface BasicTabProps {
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  tags: string;
  onTagsChange: (value: string) => void;
  status: "active" | "inactive";
  onStatusChange: (value: "active" | "inactive") => void;
}

export interface EditAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: AgentData | null;
  myDocuments?: MyDocument[];
  onSaved?: () => void;
}

export interface IngestionTabProps {
  cron: string;
  onCronChange: (value: string) => void;
  chunkSize: string;
  onChunkSizeChange: (value: string) => void;
  chunkOverlap: string;
  onChunkOverlapChange: (value: string) => void;
  embeddingModel: string;
  onEmbeddingModelChange: (value: string) => void;
}

export interface KnowledgeTabProps {
  onFilesChange: (files: FileList | null) => void;
  sourceUrl: string;
  onSourceUrlChange: (value: string) => void;
  onAddUrl: () => void;
  myDocuments: MyDocument[];
  selectedDocs: string[];
  onSelectedDocsChange: (docs: string[]) => void;
  onConnectSharePoint: () => void;
  onConnectGoogleDrive: () => void;
}

export interface ModelOption {
  value: string;
  label: string;
}

export interface ModelTabProps {
  provider: "openai" | "anthropic" | "ollama" | "grok" | "gemini" | "custom";
  onProviderChange: (key: ModelTabProps['provider']) => void;
  specificModel: string;
  onSpecificModelChange: (value: string) => void;
  temperature: number;
  onTemperatureChange: (value: number) => void;
  topK: string;
  onTopKChange: (value: string) => void;
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
  vectorDb: "chroma" | "supabase" | "pinecone" | "qdrant" | "weaviate";
  onVectorDbChange: (key: ModelTabProps['vectorDb']) => void;
  apiKey: string;
  onApiKeyChange: (value: string) => void;
}

export interface NewAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  myDocuments?: MyDocument[];
}

export interface PermissionsTabOption {
  id: string;
  name: string;
}

export interface PermissionsTabProps {
  userSearch: string;
  onUserSearchChange: (value: string) => void;
  onAddUser: () => void;
  selectedUsers: string[];
  onRemoveUser: (userId: string) => void;
  users: PermissionsTabOption[];

  teamSearch: string;
  onTeamSearchChange: (value: string) => void;
  onAddTeam: () => void;
  selectedTeams: string[];
  onRemoveTeam: (teamId: string) => void;
  teams: PermissionsTabOption[];
}

export interface WidgetTabProps {
  widgetCode: string;
  isWidgetActive: boolean;
  onCopyWidgetCode(): void;
  onWidgetToggle(active: boolean): void;
}

export interface WebhookTabProps {
  webhookUrl: string;
  isWebhookActive: boolean;
  onWebhookUrlChange: (url: string) => void;
  onWebhookToggle: (active: boolean) => void;
}

export interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: AgentData | null;
}

export interface AgentListItem {
  id: string;
  name: string;
  status: "active" | "inactive";
  documentsCount: number;
  createdAt: string;
}
