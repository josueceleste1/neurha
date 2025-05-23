import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Copy as CopyIcon, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Code,
  Terminal,
  Shield,
  Activity,
  ChevronDown,
  ChevronUp,
  Globe,
  Key,
  Zap
} from 'lucide-react';

// Mock Switch component
const Switch = ({ checked, onCheckedChange, disabled }) => (
  <button
    onClick={() => !disabled && onCheckedChange(!checked)}
    disabled={disabled}
    className={`
      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
      ${checked ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gray-300'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    <span
      className={`
        inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-lg
        ${checked ? 'translate-x-6' : 'translate-x-1'}
      `}
    />
  </button>
);

const ApiTab = () => {
  const [apiToken, setApiToken] = useState('sk-proj-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z');
  const [isApiActive, setIsApiActive] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [expandedExample, setExpandedExample] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(new Date());
  const [expandedSecurity, setExpandedSecurity] = useState(false);

  const handleCopy = async () => {
    if (!apiToken) return;
    await navigator.clipboard.writeText(apiToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleGenerateToken = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const newToken = 'sk-proj-' + Math.random().toString(36).substring(2, 50);
      setApiToken(newToken);
      setLastGenerated(new Date());
      setIsGenerating(false);
    }, 1500);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 border border-purple-200/50 rounded-xl shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`
                p-3 rounded-xl transition-all duration-300
                ${isApiActive 
                  ? 'bg-gradient-to-br from-green-100 to-emerald-100 shadow-sm' 
                  : 'bg-gray-100'
                }
              `}>
                <Server className={`
                  w-6 h-6 transition-colors duration-300
                  ${isApiActive ? 'text-green-600' : 'text-gray-400'}
                `} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">API REST</h2>
                <div className="flex items-center space-x-2">
                  <div className={`
                    flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                    ${isApiActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <Activity className="w-3 h-3" />
                    <span>{isApiActive ? 'Ativa' : 'Inativa'}</span>
                  </div>
                  {isApiActive && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Globe className="w-3 h-3" />
                      <span>Endpoint disponível</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Switch
              checked={isApiActive}
              onCheckedChange={setIsApiActive}
              disabled={!apiToken}
            />
          </div>
        </div>
      </div>

      {/* Token Management Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Key className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Token de Autenticação</h3>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chave de API
              </label>
              <div className="relative group">
                <input
                  type={showToken ? 'text' : 'password'}
                  readOnly
                  value={apiToken || 'Token não gerado'}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-24 text-sm font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                  {apiToken && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-all duration-200"
                      title="Copiar Token"
                    >
                      <CopyIcon className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowToken(prev => !prev)}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-all duration-200"
                    title={showToken ? 'Ocultar Token' : 'Mostrar Token'}
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {copied && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-green-600 animate-fade-in">
                  <CheckCircle className="w-4 h-4" />
                  <span>Token copiado para a área de transferência!</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleGenerateToken}
                  disabled={isGenerating}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'Gerando...' : 'Gerar Novo Token'}</span>
                </button>
                {apiToken && (
                  <div className="text-xs text-gray-500">
                    Último token gerado em {formatDate(lastGenerated)}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Importante:</p>
                  <p>Mantenha seu token de API seguro. Ele permite acesso completo aos dados do seu agente. Não compartilhe em repositórios públicos ou aplicações client-side.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <button
          type="button"
          className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between transition-colors duration-200"
          onClick={() => setExpandedSecurity(prev => !prev)}
        >
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Práticas de Segurança</span>
          </div>
          {expandedSecurity ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        {expandedSecurity && (
          <div className="border-t border-gray-100 p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Recomendações</span>
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Use HTTPS para todas as requisições</li>
                  <li>• Implemente rate limiting</li>
                  <li>• Monitore o uso da API</li>
                  <li>• Regenere tokens periodicamente</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Evite</span>
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Compartilhar tokens em código público</li>
                  <li>• Usar em aplicações frontend</li>
                  <li>• Armazenar em logs não seguros</li>
                  <li>• Reutilizar tokens entre ambientes</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* API Examples */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <button
          type="button"
          className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between transition-colors duration-200"
          onClick={() => setExpandedExample(prev => !prev)}
        >
          <div className="flex items-center space-x-3">
            <Code className="w-5 h-5 text-indigo-600" />
            <span className="font-medium text-gray-900">Exemplos de Integração</span>
          </div>
          {expandedExample ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        {expandedExample && (
          <div className="border-t border-gray-100">
            <div className="p-6 space-y-6">
              {/* HTTP Request Example */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Terminal className="w-4 h-4 text-gray-600" />
                  <h4 className="font-medium text-gray-900">Requisição HTTP</h4>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono">
{`GET https://api.seu-servico.com/v1/agent/data HTTP/1.1
Authorization: Bearer ${apiToken || 'your-api-token'}
Content-Type: application/json
User-Agent: YourApp/1.0`}
                  </pre>
                </div>
              </div>

              {/* cURL Example */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <h4 className="font-medium text-gray-900">Exemplo cURL</h4>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono">
{`curl -X GET "https://api.seu-servico.com/v1/agent/data" \\
  -H "Authorization: Bearer ${apiToken || 'your-api-token'}" \\
  -H "Content-Type: application/json"`}
                  </pre>
                </div>
              </div>

              {/* Response Example */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Exemplo de Resposta</h4>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono">
{`{
  "status": "success",
  "timestamp": "2025-05-23T10:30:00Z",
  "data": {
    "agentId": "agent_123",
    "name": "Meu Agente",
    "status": "active",
    "metrics": {
      "uptime": 1234567,
      "totalRequests": 789,
      "requestsToday": 42,
      "averageResponseTime": 150
    },
    "endpoints": [
      "/v1/agent/data",
      "/v1/agent/status",
      "/v1/agent/metrics"
    ]
  },
  "meta": {
    "version": "1.0",
    "rateLimit": {
      "remaining": 998,
      "resetTime": "2025-05-23T11:00:00Z"
    }
  }
}`}
                  </pre>
                </div>
              </div>

              {/* JavaScript Example */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Exemplo JavaScript</h4>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono">
{`const apiToken = '${apiToken || 'your-api-token'}';
const baseUrl = 'https://api.seu-servico.com/v1';

async function getAgentData() {
  try {
    const response = await fetch(\`\${baseUrl}/agent/data\`, {
      method: 'GET',
      headers: {
        'Authorization': \`Bearer \${apiToken}\`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching agent data:', error);
    throw error;
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTab;