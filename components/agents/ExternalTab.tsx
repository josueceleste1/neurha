import React from "react";
import { Plug as PlugIcon, Slack, MessageSquare, Twitter, Zap } from "lucide-react";

const ExternalTab: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-lg font-medium text-gray-800">Integrações Externas</h2>
    <div className="p-4 border rounded-lg">
      <h3 className="flex items-center gap-2 font-medium text-gray-700">
        <PlugIcon size={18} /> Integrações Externas
      </h3>
      <p className="mt-2 text-sm text-gray-600">Conecte o agente a plataformas externas:</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-center w-7 h-7 bg-[#4A154B] text-white rounded">
            <Slack size={14} />
          </div>
          <span className="text-sm">Slack</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-center w-7 h-7 bg-[#25D366] text-white rounded">
            <MessageSquare size={14} />
          </div>
          <span className="text-sm">WhatsApp</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-center w-7 h-7 bg-[#1DA1F2] text-white rounded">
            <Twitter size={14} />
          </div>
          <span className="text-sm">Twitter</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-center w-7 h-7 bg-[#FF4A00] text-white rounded">
            <Zap size={14} />
          </div>
          <span className="text-sm">Zapier</span>
        </button>
      </div>
    </div>
  </div>
);

export default ExternalTab;
