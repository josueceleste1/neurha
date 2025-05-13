// types/agents.ts

export type AgentStatus = "Ativo" | "Inativo";

export interface Agent {
  name: string;
  status: AgentStatus;
  documents: number;
  updatedAt: string;
}
