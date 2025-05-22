import React, { useState } from 'react';
import { Shield, AlertCircle, CheckCircle, Copy, Eye, EyeOff } from 'lucide-react';

// Tipagem das props do Switch
interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, disabled = false }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={(e) => {
      e.stopPropagation();
      if (!disabled) onCheckedChange(!checked);
    }}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 
      ${checked ? 'bg-purple-600' : 'bg-gray-300'} 
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 
        ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
    />
  </button>
);

export interface WebhookTabProps {
  webhookUrl: string;
  isWebhookActive: boolean;
  onWebhookUrlChange: (url: string) => void;
  onWebhookToggle: (active: boolean) => void;
}

const WebhookTab: React.FC<WebhookTabProps> = ({
  webhookUrl,
  isWebhookActive,
  onWebhookUrlChange,
  onWebhookToggle,
}) => {
  const [showUrl, setShowUrl] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'events' | 'payload' | null>(null);

  const isValidUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isUrlValid = webhookUrl ? isValidUrl(webhookUrl) : true;

  const handleCopyUrl = async (): Promise<void> => {
    if (!webhookUrl) return;
    await navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const webhookEvents = [
    'Agente Acionado',
    'Processamento Iniciado',
    'Processamento Concluído',
    'Erro Detectado',
    'Timeout',
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4">
          {/* Status e Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-1.5 rounded-md ${isWebhookActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                {isWebhookActive ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div>
                <span className="text-sm font-medium">Status do Webhook</span>
                <p className="text-xs text-gray-500">
                  {isWebhookActive ? 'Ativo' : 'Inativo'}
                </p>
              </div>
            </div>
            <Switch
              checked={isWebhookActive}
              onCheckedChange={onWebhookToggle}
              disabled={!webhookUrl || !isUrlValid}
            />
          </div>

          {/* Input de URL */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              URL do Endpoint <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showUrl ? 'text' : 'password'}
                value={webhookUrl}
                onChange={(e) => onWebhookUrlChange(e.target.value)}
                placeholder="https://api.exemplo.com/webhook"
                className={`w-full rounded-md border px-3 py-2 text-sm pr-16 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                  ${webhookUrl && !isUrlValid ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                {webhookUrl && (
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    title="Copiar URL"
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowUrl((prev) => !prev)}
                  title={showUrl ? 'Ocultar URL' : 'Mostrar URL'}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  {showUrl ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {copied && (
              <p className="text-xs text-green-600 flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>URL copiada!</span>
              </p>
            )}
            {webhookUrl && !isUrlValid && (
              <p className="text-xs text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>URL deve usar HTTPS</span>
              </p>
            )}
          </div>
        </div>
        {/* Seções Colapsáveis */}
        <div className="border-t border-gray-100">
          {expandedSection === 'events' && (
            <div className="p-3 space-y-2">
              {webhookEvents.map((event, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-sm">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span className="text-gray-700">{event}</span>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            className="w-full p-3 text-left hover:bg-gray-50"
            onClick={() => setExpandedSection(expandedSection === 'payload' ? null : 'payload')}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Exemplo de Payload</span>
              <span className="text-xs text-gray-500">
                {expandedSection === 'payload' ? '−' : '+'}
              </span>
            </div>
          </button>
          {expandedSection === 'payload' && (
            <div className="p-3">
              <div className="bg-gray-900 rounded-md p-3 text-xs text-gray-300 font-mono overflow-auto max-h-32">
                <pre>{`{
                        "event": "agent_triggered",
                        "timestamp": "2024-05-22T15:30:45Z",
                        "agent_id": "agent_123",
                        "data": {
                          "request_id": "req_456",
                          "user_id": "user_789",
                          "input": "Análise iniciada",
                          "status": "processing"
                        }
                      }`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Requisitos */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Shield className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="font-medium text-purple-900 mb-1">Requisitos</p>
            <p className="text-purple-700">
              HTTPS obrigatório • Resposta 200 OK • Timeout 30s
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookTab;
