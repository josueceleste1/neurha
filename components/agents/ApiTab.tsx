import React, { useState } from 'react';
import { Server, Copy as CopyIcon, Eye, EyeOff } from 'lucide-react';
import Switch from '@/components/ui/Switch';

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
}) => {
  const [copied, setCopied] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [expandedExample, setExpandedExample] = useState(false);

  const handleCopy = async () => {
    if (!apiToken) return;
    await navigator.clipboard.writeText(apiToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4">
          {/* Header: Ícone, Título e Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-1.5 rounded-md ${isApiActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Server className={`w-4 h-4 ${isApiActive ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-800">API REST</span>
                <p className="text-xs text-gray-500">
                  {isApiActive ? 'Ativa' : 'Inativa'}
                </p>
              </div>
            </div>
            <Switch
              checked={isApiActive}
              onCheckedChange={onApiToggle}
              disabled={!apiToken}
            />
          </div>

          {/* Token Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Token de API</label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                readOnly
                value={apiToken}
                placeholder="Gerado automaticamente"
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
              />
              <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                {apiToken && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    title="Copiar Token"
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowToken(prev => !prev)}
                  title={showToken ? 'Ocultar Token' : 'Mostrar Token'}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {copied && (
              <p className="text-xs text-green-600 flex items-center space-x-1">
                <span>Token copiado!</span>
              </p>
            )}
            <button
              type="button"
              onClick={onGenerateToken}
              className="mt-1 inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium hover:bg-gray-50"
            >
              Gerar Novo Token
            </button>
            <p className="text-xs text-gray-500">
              Use este token para autenticar requisições à API REST do seu agente.
            </p>
          </div>
        </div>
        {/* Seção Collapsível de Exemplo */}
        <div className="border-t border-gray-100 mb-2">
          <button
            type="button"
            className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 flex items-center justify-between"
            onClick={() => setExpandedExample(prev => !prev)}
          >
            <span className="text-sm font-medium text-gray-800">Exemplo de Requisição</span>
            <span className="text-xs text-gray-500">{expandedExample ? '−' : '+'}</span>
          </button>
          {expandedExample && (
            <div className="p-3 space-y-3">
              <div className="bg-gray-900 rounded-md p-3 text-xs text-gray-300 font-mono overflow-x-auto max-h-36">
                <pre>{`GET https://api.seu-servico.com/agent/data HTTP/1.1
                      Authorization: Bearer ${apiToken}
                      Content-Type: application/json`}</pre>
              </div>
              <span className="text-sm font-medium">Exemplo de Payload</span>
              <div className="bg-gray-900 rounded-md p-3 text-xs text-gray-300 font-mono overflow-x-auto max-h-36">
                <pre>{`{
                  "status": "success",
                  "data": {
                    "agentId": "agent_123",
                    "metrics": {
                      "uptime": 123456,
                      "requests": 789
                    }
                  }
                }`}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTab;
