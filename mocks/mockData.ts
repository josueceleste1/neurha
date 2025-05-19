// mocks/mockData.ts

export interface TestEntity {
  id: string;
  name: string;
}

export const MOCK_USERS: TestEntity[] = [
  { id: "u1", name: "João Silva" },
  { id: "u2", name: "Maria Oliveira" },
  { id: "u3", name: "Carlos Santos" },
  { id: "u4", name: "Fernanda Costa" },
  { id: "u5", name: "Rafael Gomes" },
];

export const MOCK_TEAMS: TestEntity[] = [
  { id: "t1", name: "Equipe de Vendas" },
  { id: "t2", name: "Suporte" },
  { id: "t3", name: "Marketing" },
  { id: "t4", name: "Desenvolvimento" },
  { id: "t5", name: "UX/UI" },
];
