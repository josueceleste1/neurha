import React, { useState } from 'react';
import {
  Shield, 
  AlertCircle, 
  CheckCircle, 
  Copy, 
  Eye, 
  EyeOff, 
  Settings, 
  Zap, 
  Clock, 
  Globe, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  Bell,
  Monitor,
  Smartphone,
  Tablet,
  Code,
  ExternalLink,
  Download,
  Play,
  Pause,
  RefreshCw,
  Server,
  Database,
  Layers
} from 'lucide-react';
import type { WebhookTabProps, AgentData } from '@/types/agents';

const Switch = ({ checked, onCheckedChange, disabled = false }: { checked: boolean, onCheckedChange: (checked: boolean) => void, disabled?: boolean }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={(e) => {
      e.stopPropagation();
      if (!disabled) onCheckedChange(!checked);
    }}
    disabled={disabled}
    className={`
      relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300
      ${checked 
        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/25' 
        : 'bg-gray-300 hover:bg-gray-400'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
    `}
  >
    <span
      className={`
        inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-all duration-300
        ${checked ? 'translate-x-6' : 'translate-x-1'}
      `}
    />
  </button>
);

const WebhookTab: React.FC<WebhookTabProps & { agent: AgentData }> = ({
  webhookUrl,
  isWebhookActive,
  onWebhookUrlChange,
  onWebhookToggle,
  agent,
}) => {
  const [showUrl, setShowUrl] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedSection, setExpandedSection] =
    useState<'events' | 'examples' | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('success'); // idle, testing, success, error
  const [lastTestResult, setLastTestResult] = useState({
    timestamp: '23/05/2025 14:30:45',
    success: true,
    responseTime: 127,
    message: 'Webhook respondeu corretamente'
  });
  const [selectedPreview, setSelectedPreview] = useState('desktop');
  const [eventFilters, setEventFilters] = useState({
    agent_triggered: true,
    processing_started: true,
    processing_completed: true,
    error_detected: true,
    timeout: false
  });

  const [webhookCode] = useState(`curl -X POST "https://api.exemplo.com/webhook" \\
  -H "Content-Type: application/json" \\
  -H "X-Webhook-Secret: your-secret-key" \\
  -d '{
    "event": "agent_triggered",
    "timestamp": "2024-05-22T15:30:45Z",
    "agent_id": "agent_123",
    "data": {
      "request_id": "req_456",
      "user_id": "user_789",
      "input": "Análise iniciada",
      "status": "processing"
    }
  }'`);

  const isValidUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isUrlValid = webhookUrl ? isValidUrl(webhookUrl) : true;

  const handleCopyUrl = async () => {
    if (!webhookUrl) return;
    await navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(webhookCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl || !isUrlValid) return;
    
    setIsConnecting(true);
    setConnectionStatus('testing');
    
    // Simular teste de conexão
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setConnectionStatus(success ? 'success' : 'error');
      setLastTestResult({
        timestamp: new Date().toLocaleString('pt-BR'),
        success,
        responseTime: Math.floor(Math.random() * 300) + 50,
        message: success ? 'Webhook respondeu corretamente' : 'Falha na conexão ou timeout'
      });
      setIsConnecting(false);
    }, 2000);
  };

  const downloadExample = () => {
    const exampleContent = `#!/bin/bash
# Exemplo de teste de webhook
${webhookCode}`;
    
    const blob = new Blob([exampleContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'webhook-example.sh';
    a.click();
    URL.revokeObjectURL(url);
  };

  const webhookEvents = [
    { id: 'agent_triggered', name: 'Agente Acionado', description: 'Quando o agente é iniciado', icon: Play },
    { id: 'processing_started', name: 'Processamento Iniciado', description: 'Início do processamento', icon: RefreshCw },
    { id: 'processing_completed', name: 'Processamento Concluído', description: 'Processamento finalizado', icon: CheckCircle },
    { id: 'error_detected', name: 'Erro Detectado', description: 'Quando ocorre um erro', icon: AlertCircle },
    { id: 'timeout', name: 'Timeout', description: 'Quando atinge o limite de tempo', icon: Clock }
  ];

  const previewDevices = [
    { id: 'desktop', name: 'Desktop', icon: Monitor, width: '100%' },
    { id: 'tablet', name: 'Tablet', icon: Tablet, width: '768px' },
    { id: 'mobile', name: 'Mobile', icon: Smartphone, width: '375px' }
  ];

  const getStatusColor = () => {
    if (!isWebhookActive) return 'text-gray-400';
    if (connectionStatus === 'success') return 'text-green-500';
    if (connectionStatus === 'error') return 'text-red-500';
    if (connectionStatus === 'testing') return 'text-yellow-500';
    return 'text-blue-500';
  };

  const getStatusIcon = () => {
    if (connectionStatus === 'testing') return <Activity className="w-6 h-6 animate-pulse" />;
    if (connectionStatus === 'success') return <CheckCircle className="w-6 h-6" />;
    if (connectionStatus === 'error') return <AlertCircle className="w-6 h-6" />;
    if (isWebhookActive) return <Zap className="w-6 h-6" />;
    return <Bell className="w-6 h-6" />;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-200/50 rounded-xl shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`
                p-3 rounded-xl transition-all duration-300
                ${isWebhookActive 
                  ? connectionStatus === 'success' 
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100 shadow-sm' 
                    : connectionStatus === 'error'
                    ? 'bg-gradient-to-br from-red-100 to-rose-100 shadow-sm'
                    : 'bg-gradient-to-br from-blue-100 to-indigo-100 shadow-sm'
                  : 'bg-gray-100'
                }
              `}>
                <div className={getStatusColor()}>
                  {getStatusIcon()}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Webhook Configuration</h2>
                <div className="flex items-center space-x-2">
                  <div className={`
                    flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                    ${isWebhookActive 
                      ? connectionStatus === 'success'
                        ? 'bg-green-100 text-green-700'
                        : connectionStatus === 'error'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <Layers className="w-3 h-3" />
                    <span>
                      {isWebhookActive 
                        ? connectionStatus === 'success' 
                          ? 'Conectado'
                          : connectionStatus === 'error'
                          ? 'Com Erro'
                          : connectionStatus === 'testing'
                          ? 'Testando'
                          : 'Ativo'
                        : 'Inativo'
                      }
                    </span>
                  </div>
                  {isWebhookActive && connectionStatus === 'success' && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Globe className="w-3 h-3" />
                      <span>Pronto para receber eventos</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Switch
              checked={isWebhookActive}
              onCheckedChange={onWebhookToggle}
              disabled={!webhookUrl || !isUrlValid}
            />
          </div>
        </div>
      </div>

      {/* Webhook Configuration Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Endpoint Configuration</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={downloadExample}
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Exemplo</span>
              </button>
              <button
                onClick={handleCopyUrl}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Copy className="w-4 h-4" />
                <span>Copiar URL</span>
              </button>
            </div>
          </div>

          {/* URL Configuration */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              URL do Endpoint
              <span className="text-red-500 ml-1">*</span>
            </label>
            
            <div className="relative group">
              <input
                type={showUrl ? 'text' : 'password'}
                value={webhookUrl}
                onChange={(e) => onWebhookUrlChange(e.target.value)}
                placeholder="https://api.exemplo.com/webhook"
                className={`w-full rounded-xl border-2 px-4 py-3 text-sm pr-20 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 group-hover:border-gray-400
                  ${webhookUrl && !isUrlValid 
                    ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100' 
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                {webhookUrl && (
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    title="Copiar URL"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowUrl(!showUrl)}
                  title={showUrl ? 'Ocultar URL' : 'Mostrar URL'}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  {showUrl ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Feedback Messages */}
            <div className="space-y-2">
              {copied && (
                <div className="flex items-center space-x-2 text-green-600 animate-fade-in">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">URL copiada com sucesso!</span>
                </div>
              )}
              
              {webhookUrl && !isUrlValid && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">A URL deve usar protocolo HTTPS</span>
                </div>
              )}
            </div>

            {/* Test Connection Button */}
            {webhookUrl && isUrlValid && (
              <button
                onClick={handleTestWebhook}
                disabled={isConnecting}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {isConnecting ? (
                  <Activity className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {isConnecting ? 'Testando Conexão...' : 'Testar Webhook'}
                </span>
              </button>
            )}

            {/* Last Test Result */}
            {lastTestResult && (
              <div className={`p-4 rounded-xl border-2 ${
                lastTestResult.success 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {lastTestResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">{lastTestResult.message}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{lastTestResult.responseTime}ms</span>
                    </div>
                    <span className="text-gray-500">{lastTestResult.timestamp}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Como configurar:</p>
                <p>Configure seu endpoint para receber requisições POST com o payload JSON. Certifique-se de responder com status HTTP 200 OK.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Visualização do Payload</h3>
            </div>
            <div className="flex items-center space-x-2">
              {previewDevices.map((device) => {
                const IconComponent = device.icon;
                return (
                  <button
                    key={device.id}
                    onClick={() => setSelectedPreview(device.id)}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                      ${selectedPreview === device.id
                        ? 'bg-purple-100 text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{device.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300 text-sm font-medium">Exemplo de Request</span>
                <button
                  onClick={handleCopyCode}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                {webhookCode}
              </pre>
            </div>
            {copied && (
              <div className="mt-3 flex items-center space-x-2 text-sm text-green-600 animate-fade-in">
                <CheckCircle className="w-4 h-4" />
                <span>Código copiado para a área de transferência!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Filters */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <button
          type="button"
          className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between transition-colors duration-200"
          onClick={() => setExpandedSection(expandedSection === 'events' ? null : 'events')}
        >
          <div className="flex items-center space-x-3">
            <Settings className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-900">Filtros de Eventos</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {Object.values(eventFilters).filter(Boolean).length} ativo(s)
            </span>
          </div>
          {expandedSection === 'events' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        {expandedSection === 'events' && (
          <div className="border-t border-gray-100 p-6">
            <div className="grid gap-4">
              {webhookEvents.map((event) => {
                const IconComponent = event.icon;
                return (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`w-5 h-5 ${eventFilters[event.id as keyof typeof eventFilters] ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="font-medium text-gray-900">{event.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-8 mt-1">{event.description}</p>
                    </div>
                    <Switch
                      checked={eventFilters[event.id as keyof typeof eventFilters]}
                      onCheckedChange={(checked) => setEventFilters(prev => ({
                        ...prev,
                        [event.id]: checked
                      }))}
                    />
                  </div>
                );
              })}            </div>
          </div>
        )}
      </div>

      {/* Integration Examples */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <button
          type="button"
          className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between transition-colors duration-200"
          onClick={() => setExpandedSection(expandedSection === 'examples' ? null : 'examples' as any)}        >
          <div className="flex items-center space-x-3">
            <ExternalLink className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-gray-900">Exemplos de Integração</span>
          </div>
          {expandedSection === 'examples' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        {expandedSection === 'examples' && (
          <div className="border-t border-gray-100 p-6 space-y-6">
            
            {/* Node.js Express */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Code className="w-4 h-4" />
                <span>Node.js Express</span>
              </h4>
              <p className="text-sm text-gray-600 mb-3">Exemplo de servidor para receber webhooks:</p>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono">
{`const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  const { event, timestamp, agent_id, data } = req.body;
  
  console.log('Webhook recebido:', {
    event,
    timestamp,
    agent_id,
    data
  });
  
  // Processar o evento aqui
  switch(event) {
    case 'agent_triggered':
      // Lógica para agente acionado
      break;
    case 'processing_completed':
      // Lógica para processamento concluído
      break;
  }
  
  res.status(200).json({ received: true });
});

app.listen(3000, () => {
  console.log('Webhook server rodando na porta 3000');
});`}
                </pre>
              </div>
            </div>

            {/* Python Flask */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Database className="w-4 h-4" />
                <span>Python Flask</span>
              </h4>
              <p className="text-sm text-gray-600 mb-3">Exemplo usando Flask para Python:</p>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono">
{`from flask import Flask, request, jsonify
import json

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.get_json()
    
    event = data.get('event')
    timestamp = data.get('timestamp')
    agent_id = data.get('agent_id')
    event_data = data.get('data')
    
    print(f"Webhook recebido: {event}")
    print(f"Dados: {json.dumps(data, indent=2)}")
    
    # Processar evento
    if event == 'agent_triggered':
        # Lógica para agente acionado
        pass
    elif event == 'processing_completed':
        # Lógica para processamento concluído  
        pass
    
    return jsonify({"received": True}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)`}
                </pre>
              </div>
            </div>

            {/* PHP */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>PHP</span>
              </h4>
              <p className="text-sm text-gray-600 mb-3">Exemplo simples em PHP:</p>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono">
{`<?php
header('Content-Type: application/json');

// Receber dados do webhook
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($data) {
    $event = $data['event'];
    $timestamp = $data['timestamp'];
    $agent_id = $data['agent_id'];
    $event_data = $data['data'];
    
    // Log do evento
    error_log("Webhook recebido: " . $event);
    error_log("Dados: " . json_encode($data, JSON_PRETTY_PRINT));
    
    // Processar evento
    switch ($event) {
        case 'agent_triggered':
            // Lógica para agente acionado
            break;
        case 'processing_completed':
            // Lógica para processamento concluído
            break;
    }
    
    // Responder com sucesso
    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid payload']);
}
?>`}
                </pre>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Requirements */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-200 rounded-lg">
            <Shield className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Requisitos Técnicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-blue-800">HTTPS obrigatório</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-blue-800">Resposta 200 OK</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-blue-800">Timeout máximo 30s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookTab;