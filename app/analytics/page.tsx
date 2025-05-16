// app/analytics/page.tsx
"use client";

import React, { FC } from "react";
import Header from "@/components/ui/Header";
import {
  ChartBar,
  Users,
  Clock,
  PieChart as PieIcon,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  Briefcase,
  Heart,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart as RePieChart,
  Pie,
} from "recharts";

// Dados de exemplo
const interactionsData = [
  { date: "2025-04-01", interactions: 120 },
  { date: "2025-04-02", interactions: 98 },
  { date: "2025-04-03", interactions: 150 },
  // ... até data atual
];
const userSatisfactionData = [
  { name: "1⭐", value: 10 },
  { name: "2⭐", value: 20 },
  { name: "3⭐", value: 40 },
  { name: "4⭐", value: 70 },
  { name: "5⭐", value: 160 },
];

// Função de cálculo de avaliação média
function avgRating(data: { name: string; value: number }[]): string {
  const totalCount = data.reduce((sum, d) => sum + d.value, 0);
  const totalRating = data.reduce((sum, d) => {
    const stars = parseInt(d.name);
    return sum + stars * d.value;
  }, 0);
  return (totalRating / totalCount).toFixed(1);
}

const AnalyticsPage: FC = () => {
  const userName = "João Silva";
  const handleLogout = () => console.log("Logout");

  return (
    <div className="flex h-screen overflow-x-hidden">
      <main className="flex-1 flex flex-col bg-gradient-to-br from-[#4C1D95] via-[#7E22CE] to-[#1E1B4B] text-white">
        <Header
          title="Análises"
          icon={<ChartBar className="w-6 h-6 text-purple-300" />}
          userName={userName}
          onLogout={handleLogout}
        />

        {/* Container com scroll apenas vertical */}
        <div className="flex-1 overflow-auto">
          <div className="p-10 space-y-12">
            {/* 1. Métricas de uso do assistente (LLM) */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                📊 Métricas de uso do assistente (LLM)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white/10 p-6 rounded-xl shadow-md flex flex-col">
                  <span className="text-sm text-white/70 flex items-center gap-2">
                    <ChartBar className="w-5 h-5" />Número total de interações
                  </span>
                  <span className="text-3xl font-bold">
                    {interactionsData.reduce((sum, d) => sum + d.interactions, 0)}
                  </span>
                </div>
                <div className="bg-white/10 p-6 rounded-xl shadow-md flex flex-col">
                  <span className="text-sm text-white/70 flex items-center gap-2">
                    <Users className="w-5 h-5" />Usuários ativos únicos
                  </span>
                  <span className="text-3xl font-bold">128</span>
                </div>
                <div className="bg-white/10 p-6 rounded-xl shadow-md flex flex-col">
                  <span className="text-sm text-white/70 flex items-center gap-2">
                    <Clock className="w-5 h-5" />Horários de pico
                  </span>
                  <span className="text-3xl font-bold">14h - 15h</span>
                </div>
              </div>
              <div className="bg-white/10 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">Interações por Dia</h3>
                <div className="w-full h-64">
                  <ResponsiveContainer>
                    <LineChart data={interactionsData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" tick={{ fill: "white" }} />
                      <YAxis tick={{ fill: "white" }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1E1B4B", border: "none" }}
                        itemStyle={{ color: "white" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="interactions"
                        stroke="#7E22CE"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* 2. Efetividade das respostas */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                📄 Efetividade das respostas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/10 p-6 rounded-xl shadow-md flex flex-col">
                  <span className="text-sm text-white/70 flex items-center gap-2">
                    <PieIcon className="w-5 h-5" />Taxa de resolução automática
                  </span>
                  <span className="text-3xl font-bold">85%</span>
                </div>
                <div className="bg-white/10 p-6 rounded-xl shadow-md flex flex-col">
                  <span className="text-sm text-white/70 flex items-center gap-2">
                    <Heart className="w-5 h-5" />Avaliação média de satisfação
                  </span>
                  <span className="text-3xl font-bold">
                    {avgRating(userSatisfactionData)}
                  </span>
                </div>
                <div className="bg-white/10 p-6 rounded-xl shadow-md flex flex-col">
                  <span className="text-sm text-white/70 flex items-center gap-2">
                    <Clock className="w-5 h-5" />Tempo médio de resposta
                  </span>
                  <span className="text-3xl font-bold">1.2s</span>
                </div>
              </div>
            </section>

            {/* 3. Base de conhecimento e tipos de perguntas */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                📚 Base de conhecimento e tipos de perguntas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/10 p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />Assuntos mais perguntados
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Férias",
                      "Benefícios",
                      "Folha",
                      "Ponto",
                      "Plano de Saúde",
                    ].map((topic) => (
                      <span
                        key={topic}
                        className="bg-purple-700/50 text-white px-3 py-1 rounded text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />Documentos mais referenciados
                  </h3>
                  <div className="w-full h-48">
                    <ResponsiveContainer>
                      <RePieChart>
                        {[
                          { name: "Política A", value: 30 },
                          { name: "Manual B", value: 70 },
                          { name: "Procedimento C", value: 50 },
                        ].map((entry, idx) => (
                          <Pie
                            key={entry.name}
                            data={[entry]}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={80}
                            fill={
                              ["#7E22CE", "#4C1D95", "#1E1B4B"][idx % 3]
                            }
                          />
                        ))}
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Qualidade e manutenção da base */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                🧠 Qualidade e manutenção da base
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/10 p-6 rounded-xl shadow-md flex flex-col">
                  <span className="text-sm text-white/70 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />Taxa de falhas
                  </span>
                  <span className="text-3xl font-bold">5%</span>
                </div>
                <div className="bg-white/10 p-6 rounded-xl shadow-md flex flex-col">
                  <span className="text-sm text-white/70 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />Sugestões de novos documentos
                  </span>
                  <span className="text-3xl font-bold">12</span>
                </div>
              </div>
            </section>

            {/* 5. Métricas organizacionais opcionais */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">
                💼 Métricas organizacionais opcionais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/10 p-6 rounded-xl shadow-md flex flex-col">
                  <span className="text-sm text-white/70 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />Impacto por setor
                  </span>
                  <span className="text-3xl font-bold">TI: 40%, RH: 30%</span>
                </div>
                <div className="bg-white/10 p-6 rounded-xl shadow-md flex flex-col">
                  <span className="text-sm text-white/70 flex items-center gap-2">
                    <Clock className="w-5 h-5" />Economia de tempo
                  </span>
                  <span className="text-3xl font-bold">50h/mês</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
