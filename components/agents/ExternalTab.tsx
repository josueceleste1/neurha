import React, { useState } from 'react';
import {
  Plug as PlugIcon,
  Slack,
  MessageSquare,
  Twitter,
  Zap,
} from 'lucide-react';

const integrations = [
  { name: 'Slack', icon: Slack, bg: '#4A154B' },
  { name: 'WhatsApp', icon: MessageSquare, bg: '#25D366' },
  { name: 'Twitter', icon: Twitter, bg: '#1DA1F2' },
  { name: 'Zapier', icon: Zap, bg: '#FF4A00' },
];

// Configurações necessárias por conector
const configOptions: Record<string, { name: string; label: string; type: 'text' | 'password' }[]> = {
  Slack: [
    { name: 'clientId', label: 'Client ID', type: 'text' },
    { name: 'clientSecret', label: 'Client Secret', type: 'password' },
    { name: 'signingSecret', label: 'Signing Secret', type: 'password' },
    { name: 'defaultChannel', label: 'Canal Padrão', type: 'text' },
  ],
  WhatsApp: [
    { name: 'phoneNumberId', label: 'Phone Number ID', type: 'text' },
    { name: 'accessToken', label: 'Access Token', type: 'password' },
    { name: 'webhookUrl', label: 'Webhook URL', type: 'text' },
  ],
  Twitter: [
    { name: 'apiKey', label: 'API Key', type: 'text' },
    { name: 'apiSecretKey', label: 'API Secret Key', type: 'password' },
    { name: 'accessToken', label: 'Access Token', type: 'text' },
    { name: 'accessTokenSecret', label: 'Access Token Secret', type: 'password' },
  ],
  Zapier: [
    { name: 'webhookUrl', label: 'Zapier Webhook URL', type: 'text' },
  ],
};

const ExternalTab: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, Record<string, string>>>(() => {
    const initial: Record<string, Record<string, string>> = {};
    integrations.forEach(({ name }) => {
      initial[name] = {};
      configOptions[name].forEach(opt => {
        initial[name][opt.name] = '';
      });
    });
    return initial;
  });

  const handleSelect = (name: string) => {
    setSelected(prev => (prev === name ? null : name));
  };

  const handleConfigChange = (connector: string, field: string, value: string) => {
    setConfigValues(prev => ({
      ...prev,
      [connector]: { ...prev[connector], [field]: value },
    }));
  };

  const handleSave = () => {
    if (selected) {
      console.log(`Config saved for ${selected}`, configValues[selected]);
      // Aqui você pode chamar API para salvar as configurações
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center mb-4">
            <PlugIcon className="w-5 h-5 text-gray-700" />
            <h2 className="ml-2 text-sm font-medium text-gray-800">Integrações Externas</h2>
          </div>

          {/* Grid de Connectors */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {integrations.map(({ name, icon: Icon, bg }) => (
              <button
                key={name}
                type="button"
                onClick={() => handleSelect(name)}
                className={`flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md transition-colors duration-200
                  ${selected === name ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
              >
                <div
                  className="flex items-center justify-center w-7 h-7 rounded"
                  style={{ backgroundColor: bg }}
                >
                  <Icon size={14} className="text-white" />
                </div>
                <span className="text-sm text-gray-700">{name}</span>
              </button>
            ))}
          </div>

          {/* Painel de Configuração */}
          {selected && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-3">
                Configurar {selected}
              </h3>
              <div className="space-y-3">
                {configOptions[selected].map(opt => (
                  <div key={opt.name} className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">
                      {opt.label}
                    </label>
                    <input
                      type={opt.type}
                      value={configValues[selected][opt.name]}
                      onChange={e => handleConfigChange(selected, opt.name, e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleSave}
                  className="mt-2 inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition"
                >
                  Salvar Configurações
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExternalTab;
