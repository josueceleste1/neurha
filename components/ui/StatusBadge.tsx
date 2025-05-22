// components/agents/StatusBadge.tsx
import React from "react";
import { AgentStatus } from "@/types/agents";
import type { StatusBadgeProps } from "@/types/ui";

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isActive = status === "Ativo";
  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
