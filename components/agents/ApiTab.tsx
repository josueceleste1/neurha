import React from "react";
import { Server } from "lucide-react";
import Switch from "@/components/ui/Switch";

export interface ApiTabProps {
  apiToken: string;
  isApiActive: boolean;
  onGenerateToken(): void;
  onApiToggle(active: boolean): void;
}

const ApiTab: React.FC<ApiTabProps> = ({
  apiToken,
  isApiActive,
  onGenerateToken,
  onApiToggle,
}) => (
  <div className="space-y-6">
    <h2 className="text-lg font-medium text-gray-800">API REST</h2>
    <div className="p-4 border rounded-lg">
      <h3 className="flex items-center gap-2 font-medium text-gray-700">
        <Server size={18} /> API REST
      </h3>
      <label className="block text-sm text-gray-600 mt-2">Token de API</label>
      <div className="flex gap-2 mt-1">
        <input
          type="text"
          readOnly
          value={apiToken}
          placeholder="Gerado automaticamente"
          className="flex-1 rounded-md border px-3 py-2 text-sm bg-gray-50"
        />
        <button
          type="button"
          onClick={onGenerateToken}
          className="px-3 py-2 bg-white border rounded-md text-sm font-medium hover:bg-gray-50"
        >
          Gerar
        </button>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Use para se conectar programaticamente ao seu agente via API.
      </p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-sm font-medium text-gray-700">Ativar API</span>
        <Switch checked={isApiActive} onCheckedChange={onApiToggle} />
      </div>
    </div>
  </div>
);

export default ApiTab;
