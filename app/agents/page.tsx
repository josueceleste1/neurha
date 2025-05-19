// app/agents/page.tsx
"use client";

import React from "react";
import Header from "@/components/ui/Header";
import AgentList from "@/components/agents/AgentList";
import { Users } from "lucide-react";

const AgentsPage = () => {
  const userName = "Josué Celeste";
  const handleLogout = () => console.log("Logout");

  return (
    <div className="flex h-screen overflow-hidden">
      <main className="flex-1 bg-gray-100 dark:bg-gradient-to-br from-[#4C1D95] via-[#7E22CE] to-[#1E1B4B] text-white overflow-y-auto">
        <Header
          title="Gerenciamento de Agentes"
          icon={<Users className="w-6 h-6 text-purple-300" />}
          userName={userName}
          onLogout={handleLogout}
        />
        <section className="p-6">
          <AgentList />
        </section>
      </main>
    </div>
  );
};

export default AgentsPage;
