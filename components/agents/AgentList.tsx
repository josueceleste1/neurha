import React, { useState, useEffect } from "react";
import {
  Edit,
  Trash,
  MessageSquare,
  Database,
  Search,
  PlusCircle,
} from "lucide-react";
import Switch from "@/components/ui/Switch";
import Toast from "@/components/ui/Toast";
import NewAgentModal from "./NewAgentModal";

interface Agent {
  id: string;
  name: string;
  status: "active" | "inactive";
  documentsCount: number;
  createdAt: string; 
}

const NEST_API_URL = "http://localhost:3001/api/v1";

const AgentList: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch(`${NEST_API_URL}/agents`);
        const data = await res.json();
        setAgents(Array.isArray(data) ? data : []);
      } catch {
        setToast({ title: "Erro", description: "Não foi possível carregar os agentes." });
      }
    }
    fetchAgents();
  }, [showModal]);

  const showToast = (title: string, description: string) => setToast({ title, description });

  const filteredAgents = agents.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formata apenas a data de criação (dd/mm/aaaa)
  const formatDate = (dt?: string): string => {
    if (!dt) return "-";
    const date = new Date(dt);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const toggleAgentStatus = (id: string) => {
    setAgents(prev =>
      prev.map(agent => {
        if (agent.id === id) {
          const newStatus = agent.status === "active" ? "inactive" : "active";
          showToast(
            `Agente ${newStatus === "active" ? "ativado" : "desativado"}`,
            `O agente ${agent.name} foi ${newStatus === "active" ? "ativado" : "desativado"} com sucesso.`
          );
          return { ...agent, status: newStatus };
        }
        return agent;
      })
    );
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-md border border-gray-200">
      {toast && (
        <Toast title={toast.title} description={toast.description} onClose={() => setToast(null)} />
      )}

      {agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Nenhum agente encontrado</h1>
            <p className="text-gray-500">Crie um novo agente para começar</p>
          </div>
          <PlusCircle className="w-12 h-12 text-gray-300" />
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            Criar Agente
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Gestão de Agentes</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              <PlusCircle className="w-4 h-4" />
              Novo Agente
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar agentes..."
              className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-2 py-3 text-center">Status</th>
                  <th className="px-2 py-3 text-center">Documentos</th>
                  <th className="px-2 py-3 text-center">Criado em</th>
                  <th className="px-3 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredAgents.map(agent => {
                  const isActive = agent.status === "active";
                  return (
                    <tr key={agent.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium text-gray-900 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                        {agent.name}
                      </td>
                      <td className="px-2 py-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <Switch checked={isActive} onCheckedChange={() => toggleAgentStatus(agent.id)} />
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {isActive ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-4 text-gray-700 text-center">
                        <Database className="w-4 h-4 inline-block text-gray-500 mr-1" />
                        {agent.documentsCount}
                      </td>
                      <td className="px-2 py-4 text-sm text-gray-600 text-center">
                        {formatDate(agent.createdAt)}
                      </td>
                      <td className="px-3 py-4 text-center">
                        <button className="text-purple-600 hover:text-purple-800 mr-3">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <NewAgentModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default AgentList;
