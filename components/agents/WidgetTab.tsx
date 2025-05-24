import React, { useState } from 'react';
import type { WidgetTabProps, AgentData } from '@/types/agents';
import { 
  Code,
  Copy,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle,
  AlertCircle,
  Settings,
  Palette,
  ChevronDown,
  ChevronUp,
  Eye,
  Globe,
  Layers,
  Zap,
  Box,
  ExternalLink,
  Download
} from 'lucide-react';

// Mock Switch component
const Switch = ({
  checked,
  onCheckedChange,
  disabled,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled: boolean;
}) => (
  <button
    onClick={() => !disabled && onCheckedChange(!checked)}
    disabled={disabled}
    className={`
      relative inline-flex h-6 w-11 items-center rounded-full transition-colors
      ${checked ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-300'}
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

const WidgetTab: React.FC<WidgetTabProps & { agent: AgentData }> = ({
  widgetCode,
  isWidgetActive,
  onCopyWidgetCode,
  onWidgetToggle,
  agent,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedCustomization, setExpandedCustomization] = useState(false);
  const [expandedExamples, setExpandedExamples] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState('desktop');
  const [widgetTheme, setWidgetTheme] = useState('light');
  const [widgetPosition, setWidgetPosition] = useState('bottom-right');

  const handleCopy = async () => {
    onCopyWidgetCode();
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const downloadHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exemplo Widget - Meu Agente</title>
</head>
<body>
    <h1>Minha Página com Widget</h1>
    <p>O widget aparecerá no canto inferior direito da página.</p>
    
    ${widgetCode}
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exemplo-widget.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewDevices = [
    { id: 'desktop', name: 'Desktop', icon: Monitor, width: '100%' },
    { id: 'tablet', name: 'Tablet', icon: Tablet, width: '768px' },
    { id: 'mobile', name: 'Mobile', icon: Smartphone, width: '375px' }
  ];

  const themeOptions = [
    { id: 'light', name: 'Claro', colors: 'bg-white border-gray-200' },
    { id: 'dark', name: 'Escuro', colors: 'bg-gray-900 border-gray-700' },
    { id: 'brand', name: 'Marca', colors: 'bg-gradient-to-br from-blue-500 to-purple-600' }
  ];

  const positionOptions = [
    { id: 'bottom-right', name: 'Inferior Direito', position: 'bottom: 20px; right: 20px;' },
    { id: 'bottom-left', name: 'Inferior Esquerdo', position: 'bottom: 20px; left: 20px;' },
    { id: 'top-right', name: 'Superior Direito', position: 'top: 20px; right: 20px;' },
    { id: 'center', name: 'Centralizado', position: 'top: 50%; left: 50%; transform: translate(-50%, -50%);' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 border border-blue-200/50 rounded-xl shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`
                p-3 rounded-xl transition-all duration-300
                ${isWidgetActive 
                  ? 'bg-gradient-to-br from-blue-100 to-indigo-100 shadow-sm' 
                  : 'bg-gray-100'
                }
              `}>
                <Code className={`
                  w-6 h-6 transition-colors duration-300
                  ${isWidgetActive ? 'text-blue-600' : 'text-gray-400'}
                `} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Widget Embarcado</h2>
                <div className="flex items-center space-x-2">
                  <div className={`
                    flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                    ${isWidgetActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <Layers className="w-3 h-3" />
                    <span>{isWidgetActive ? 'Ativo' : 'Inativo'}</span>
                  </div>
                  {isWidgetActive && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Globe className="w-3 h-3" />
                      <span>Pronto para integração</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Switch
              checked={isWidgetActive}
              onCheckedChange={onWidgetToggle}
              disabled={!widgetCode}
            />
          </div>
        </div>
      </div>

      {/* Widget Code Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Box className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Código de Integração</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={downloadHTML}
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Exemplo</span>
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Copy className="w-4 h-4" />
                <span>Copiar Código</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                {widgetCode}
              </pre>
            </div>
            {copied && (
              <div className="mt-3 flex items-center space-x-2 text-sm text-green-600 animate-fade-in">
                <CheckCircle className="w-4 h-4" />
                <span>Código copiado para a área de transferência!</span>
              </div>
            )}
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Como usar:</p>
                <p>Cole este código antes da tag <code className="bg-blue-100 px-1 rounded">&lt;/body&gt;</code> no HTML da sua página. O widget aparecerá automaticamente no canto inferior direito.</p>
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
              <h3 className="text-lg font-semibold text-gray-900">Visualização</h3>
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

          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 bg-gray-50">
            <div className="flex justify-center">
              <div 
                className="bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-300"
                style={{ 
                  width: previewDevices.find(d => d.id === selectedPreview)?.width,
                  maxWidth: '100%'
                }}
              >
                <div className="h-64 flex items-center justify-center relative">
                  <div className="text-gray-400 text-center">
                    <Globe className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Sua página web</p>
                  </div>
                  
                  {/* Widget Preview */}
                  <div className="absolute bottom-4 right-4">
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-200
                      ${widgetTheme === 'dark' ? 'bg-gray-800' : widgetTheme === 'brand' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-white border-2 border-gray-200'}
                    `}>
                      <Zap className={`w-6 h-6 ${widgetTheme === 'dark' ? 'text-white' : widgetTheme === 'brand' ? 'text-white' : 'text-blue-600'}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customization Options */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <button
          type="button"
          className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between transition-colors duration-200"
          onClick={() => setExpandedCustomization(prev => !prev)}
        >
          <div className="flex items-center space-x-3">
            <Settings className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-900">Opções de Personalização</span>
          </div>
          {expandedCustomization ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        {expandedCustomization && (
          <div className="border-t border-gray-100 p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Theme Selection */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>Tema</span>
                </h4>
                <div className="space-y-2">
                  {themeOptions.map((theme) => (
                    <label key={theme.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value={theme.id}
                        checked={widgetTheme === theme.id}
                        onChange={(e) => setWidgetTheme(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className={`w-6 h-6 rounded-full ${theme.colors}`}></div>
                      <span className="text-sm text-gray-700">{theme.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Position Selection */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <Box className="w-4 h-4" />
                  <span>Posição</span>
                </h4>
                <div className="space-y-2">
                  {positionOptions.map((position) => (
                    <label key={position.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="position"
                        value={position.id}
                        checked={widgetPosition === position.id}
                        onChange={(e) => setWidgetPosition(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{position.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Código Personalizado</h4>
              <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                <pre className="text-xs text-gray-300 font-mono">
{`<script>
  (function() {
    var widget = document.createElement('div');
    widget.style.cssText = 'position: fixed; ${positionOptions.find(p => p.id === widgetPosition)?.position} z-index: 9999;';
    widget.innerHTML = '<iframe src="https://widget.meuagente.com/chat/abc123?theme=${widgetTheme}" style="width: 350px; height: 500px; border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);"></iframe>';
    document.body.appendChild(widget);
  })();
</script>`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Integration Examples */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <button
          type="button"
          className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between transition-colors duration-200"
          onClick={() => setExpandedExamples(prev => !prev)}
        >
          <div className="flex items-center space-x-3">
            <ExternalLink className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-gray-900">Exemplos de Integração</span>
          </div>
          {expandedExamples ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
        {expandedExamples && (
          <div className="border-t border-gray-100 p-6 space-y-6">
            
            {/* WordPress */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">WordPress</h4>
              <p className="text-sm text-gray-600 mb-3">Adicione o código no arquivo <code className="bg-gray-100 px-1 rounded">functions.php</code> do seu tema:</p>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono">
{`function add_chat_widget() {
    ?>
    ${widgetCode}
    <?php
}
add_action('wp_footer', 'add_chat_widget');`}
                </pre>
              </div>
            </div>

            {/* React */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">React</h4>
              <p className="text-sm text-gray-600 mb-3">Use o useEffect para carregar o widget:</p>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono">
{`import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = \`
      (function() {
        var chatWidget = document.createElement('div');
        chatWidget.id = 'chat-widget-container';
        chatWidget.innerHTML = '<iframe src="https://widget.meuagente.com/chat/abc123" style="width: 350px; height: 500px; border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" title="Chat Assistant"></iframe>';
        document.body.appendChild(chatWidget);
      })();
    \`;
    document.body.appendChild(script);
    
    return () => {
      const widget = document.getElementById('chat-widget-container');
      if (widget) widget.remove();
    };
  }, []);

  return <div>Seu App</div>;
}`}
                </pre>
              </div>
            </div>

            {/* Shopify */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Shopify</h4>
              <p className="text-sm text-gray-600 mb-3">Adicione no arquivo <code className="bg-gray-100 px-1 rounded">theme.liquid</code> antes da tag <code className="bg-gray-100 px-1 rounded">&lt;/body&gt;</code>:</p>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300 font-mono">
{`<!-- Chat Widget -->
${widgetCode}
<!-- End Chat Widget -->`}
                </pre>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetTab;