import React, { useState } from 'react';
import {
  Plug,
  Slack,
  MessageSquare,
  Twitter,
  Zap,
  Settings,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  Shield,
  Activity,
  Clock,
  Users,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  Save,
  TestTube,
  Sparkles,
  Globe,
  Key,
  Link as LinkIcon,
  Mail,
  Phone,
  Calendar,
  Database,
  Cloud
} from 'lucide-react';
import type { AgentData } from '@/types/agents';

const integrations = [
  { 
    name: 'Slack', 
    icon: Slack, 
    bg: 'linear-gradient(135deg, #4A154B 0%, #350d36 100%)',
    description: 'Conecte seu agente aos canais do Slack',
    status: 'connected',
    lastSync: '2 min atrás',
    users: 142
  },
  { 
    name: 'WhatsApp', 
    icon: MessageSquare, 
    bg: 'linear-gradient(135deg, #25D366 0%, #1ebe57 100%)',
    description: 'Integração com WhatsApp Business API',
    status: 'disconnected',
    lastSync: 'Nunca',
    users: 0
  },
  { 
    name: 'Twitter', 
    icon: Twitter, 
    bg: 'linear-gradient(135deg, #1DA1F2 0%, #0d8bd9 100%)',
    description: 'Responda menções e DMs automaticamente',
    status: 'error', 
    lastSync: '1 hora atrás',
    users: 28
  },
  { 
    name: 'Zapier', 
    icon: Zap, 
    bg: 'linear-gradient(135deg, #FF4A00 0%, #e63900 100%)',
    description: 'Conecte com 5000+ aplicativos',
    status: 'connected',
    lastSync: '5 min atrás',
    users: 89
  },
  {
    name: 'Email',
    icon: Mail,
    bg: 'linear-gradient(135deg, #EA4335 0%, #d33b2c 100%)',
    description: 'Responda emails automaticamente',
    status: 'disconnected',
    lastSync: 'Nunca',
    users: 0
  },
  {
    name: 'Telegram',
    icon: Phone,
    bg: 'linear-gradient(135deg, #0088cc 0%, #006bb3 100%)',
    description: 'Bot para grupos e chats do Telegram',
    status: 'connected',
    lastSync: '1 min atrás',
    users: 67
  },
  {
    name: 'Google Calendar',
    icon: Calendar,
    bg: 'linear-gradient(135deg, #4285F4 0%, #3367d6 100%)',
    description: 'Agende reuniões automaticamente',
    status: 'disconnected',
    lastSync: 'Nunca',
    users: 0
  },
  {
    name: 'Webhook',
    icon: Database,
    bg: 'linear-gradient(135deg, #6366F1 0%, #4f46e5 100%)',
    description: 'Integração customizada via webhooks',
    status: 'connected',
    lastSync: '30 seg atrás',
    users: 156
  }
];

const configOptions: Record<string, { name: string; label: string; type: 'text' | 'password' | 'url'; required: boolean; description?: string }[]> = {
  Slack: [
    { name: 'clientId', label: 'Client ID', type: 'text', required: true, description: 'Encontre em Slack API > OAuth & Permissions' },
    { name: 'clientSecret', label: 'Client Secret', type: 'password', required: true, description: 'Chave secreta da aplicação' },
    { name: 'signingSecret', label: 'Signing Secret', type: 'password', required: true, description: 'Para verificar requisições do Slack' },
    { name: 'defaultChannel', label: 'Canal Padrão', type: 'text', required: false, description: 'Canal onde o bot será ativo (ex: #general)' },
  ],
  WhatsApp: [
    { name: 'phoneNumberId', label: 'Phone Number ID', type: 'text', required: true, description: 'ID do número no WhatsApp Business' },
    { name: 'accessToken', label: 'Access Token', type: 'password', required: true, description: 'Token permanente da Meta' },
    { name: 'webhookUrl', label: 'Webhook URL', type: 'url', required: true, description: 'URL para receber mensagens' },
    { name: 'verifyToken', label: 'Verify Token', type: 'password', required: true, description: 'Token de verificação do webhook' },
  ],
  Twitter: [
    { name: 'apiKey', label: 'API Key', type: 'text', required: true, description: 'Chave da API do Twitter' },
    { name: 'apiSecretKey', label: 'API Secret Key', type: 'password', required: true, description: 'Chave secreta da API' },
    { name: 'accessToken', label: 'Access Token', type: 'text', required: true, description: 'Token de acesso do usuário' },
    { name: 'accessTokenSecret', label: 'Access Token Secret', type: 'password', required: true, description: 'Segredo do token de acesso' },
  ],
  Zapier: [
    { name: 'webhookUrl', label: 'Webhook URL', type: 'url', required: true, description: 'URL do webhook do Zapier' },
  ],
  Email: [
    { name: 'smtpHost', label: 'Servidor SMTP', type: 'text', required: true, description: 'Servidor de email (ex: smtp.gmail.com)' },
    { name: 'smtpPort', label: 'Porta SMTP', type: 'text', required: true, description: 'Porta do servidor (587 ou 465)' },
    { name: 'email', label: 'Email', type: 'text', required: true, description: 'Endereço de email' },
    { name: 'password', label: 'Senha/App Password', type: 'password', required: true, description: 'Senha ou senha de aplicativo' },
  ],
  Telegram: [
    { name: 'botToken', label: 'Bot Token', type: 'password', required: true, description: 'Token do @BotFather' },
    { name: 'webhookUrl', label: 'Webhook URL', type: 'url', required: false, description: 'URL para receber updates (opcional)' },
  ],
  'Google Calendar': [
    { name: 'clientId', label: 'Client ID', type: 'text', required: true, description: 'ID do cliente Google OAuth' },
    { name: 'clientSecret', label: 'Client Secret', type: 'password', required: true, description: 'Segredo do cliente Google' },
    { name: 'calendarId', label: 'Calendar ID', type: 'text', required: false, description: 'ID do calendário (deixe vazio para principal)' },
  ],
  Webhook: [
    { name: 'url', label: 'Webhook URL', type: 'url', required: true, description: 'URL que receberá os dados' },
    { name: 'secret', label: 'Secret Key', type: 'password', required: false, description: 'Chave secreta para autenticação' },
    { name: 'method', label: 'Método HTTP', type: 'text', required: false, description: 'GET, POST, PUT, etc. (padrão: POST)' },
  ]
};

const ExternalTab: React.FC<{ agent: AgentData }> = ({ agent }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, Record<string, string>>>(() => {
    const initial: Record<string, Record<string, string>> = {};
    integrations.forEach(({ name }) => {
      initial[name] = {};
      if (configOptions[name]) {
        configOptions[name].forEach(opt => {
          initial[name][opt.name] = '';
        });
      }
    });
    return initial;
  });
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [expandedStats, setExpandedStats] = useState(false);

  const handleSelect = (name: string) => {
    setSelected(prev => (prev === name ? null : name));
  };

  const handleConfigChange = (connector: string, field: string, value: string) => {
    setConfigValues(prev => ({
      ...prev,
      [connector]: { ...prev[connector], [field]: value },
    }));
  };

  const togglePasswordVisibility = (fieldKey: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldKey]: !prev[fieldKey]
    }));
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(`Config saved for ${selected}`, configValues[selected]);
      setSaving(false);
    }, 1500);
  };

  const handleTest = async () => {
    if (!selected) return;
    setTesting(true);
    
    // Simulate test connection
    setTimeout(() => {
      console.log(`Testing connection for ${selected}`);
      setTesting(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'disconnected': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'error': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'error': return 'Erro';
      case 'disconnected': return 'Desconectado';
      default: return 'Desconectado';
    }
  };

  const connectedIntegrations = integrations.filter(i => i.status === 'connected').length;
  const totalUsers = integrations.reduce((sum, i) => sum + i.users, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header with Stats */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200/50 rounded-xl shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 shadow-sm">
                <Plug className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Integrações Externas</h2>
                <p className="text-gray-600">Conecte seu agente com ferramentas externas</p>
              </div>
            </div>
            <button
              onClick={() => setExpandedStats(!expandedStats)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-lg hover:bg-white transition-all duration-200"
            >
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">Estatísticas</span>
              {expandedStats ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {expandedStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-indigo-100">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center space-x-3">
                  <LinkIcon className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Integrações Ativas</p>
                    <p className="text-lg font-semibold text-gray-900">{connectedIntegrations} de {integrations.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Usuários Conectados</p>
                    <p className="text-lg font-semibold text-gray-900">{totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-indigo-100">
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Status Geral</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {connectedIntegrations > integrations.length / 2 ? 'Excelente' : 'Parcial'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {integrations.map(({ name, icon: Icon, bg, description, status, lastSync, users }) => {
          const StatusIcon = getStatusIcon(status);
          return (
            <div
              key={name}
              className={`
                bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
                ${selected === name ? 'ring-2 ring-indigo-500 border-indigo-300' : ''}
              `}
              onClick={() => handleSelect(name)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl shadow-sm"
                    style={{ background: bg }}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{getStatusText(status)}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
                <p className="text-sm text-gray-600 mb-3">{description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{lastSync}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{users}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Panel */}
      {selected && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg shadow-sm"
                  style={{ background: integrations.find(i => i.name === selected)?.bg }}
                >
                  {React.createElement(integrations.find(i => i.name === selected)?.icon || Settings, { 
                    size: 18, 
                    className: "text-white" 
                  })}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Configurar {selected}</h3>
                  <p className="text-sm text-gray-600">Configure as credenciais e parâmetros</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={testing}
                  className="inline-flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
                >
                  <TestTube className={`w-4 h-4 ${testing ? 'animate-pulse' : ''}`} />
                  <span>{testing ? 'Testando...' : 'Testar'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
                  <span>{saving ? 'Salvando...' : 'Salvar'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {configOptions[selected] ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {configOptions[selected].map(opt => {
                  const fieldKey = `${selected}-${opt.name}`;
                  const showPassword = showPasswords[fieldKey];
                  
                  return (
                    <div key={opt.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          {opt.label}
                          {opt.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {opt.type === 'password' && (
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(fieldKey)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                      <input
                        type={opt.type === 'password' && !showPassword ? 'password' : 'text'}
                        value={configValues[selected][opt.name]}
                        onChange={e => handleConfigChange(selected, opt.name, e.target.value)}
                        placeholder={opt.type === 'url' ? 'https://...' : ''}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                      {opt.description && (
                        <p className="text-xs text-gray-500">{opt.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Configurações em breve para {selected}</p>
              </div>
            )}

            {/* Integration-specific help */}
            {selected && configOptions[selected] && (
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">Dicas para {selected}:</p>
                    {selected === 'Slack' && (
                      <ul className="space-y-1 text-sm">
                        <li>• Crie um app em <a href="https://api.slack.com/apps" className="underline" target="_blank" rel="noopener noreferrer">api.slack.com/apps</a></li>
                        <li>• Configure OAuth & Permissions e adicione os escopos necessários</li>
                        <li>• Use o canal #general como padrão ou crie um específico</li>
                      </ul>
                    )}
                    {selected === 'WhatsApp' && (
                      <ul className="space-y-1 text-sm">
                        <li>• Configure uma conta WhatsApp Business</li>
                        <li>• Use Meta for Developers para obter credenciais</li>
                        <li>• Configure webhooks para receber mensagens</li>
                      </ul>
                    )}
                    {selected === 'Twitter' && (
                      <ul className="space-y-1 text-sm">
                        <li>• Crie um app no Twitter Developer Portal</li>
                        <li>• Configure permissões de leitura e escrita</li>
                        <li>• Use Twitter API v2 para melhor performance</li>
                      </ul>
                    )}
                    {selected === 'Zapier' && (
                      <ul className="space-y-1 text-sm">
                        <li>• Crie um Zap no Zapier</li>
                        <li>• Use Webhooks by Zapier como trigger</li>
                        <li>• Configure a URL do webhook aqui</li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalTab;