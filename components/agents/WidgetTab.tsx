import React, { useState } from 'react';
import { Code as CodeIcon, Copy as CopyIcon } from 'lucide-react';
import Switch from '@/components/ui/Switch';

export interface WidgetTabProps {
  widgetCode: string;
  isWidgetActive: boolean;
  onCopyWidgetCode(): void;
  onWidgetToggle(active: boolean): void;
}

const WidgetTab: React.FC<WidgetTabProps> = ({
  widgetCode,
  isWidgetActive,
  onCopyWidgetCode,
  onWidgetToggle,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!widgetCode) return;
    await navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopyWidgetCode();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4">
          {/* Header: Ícone, Título e Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-1.5 rounded-md ${isWidgetActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                <CodeIcon className={`w-4 h-4 ${isWidgetActive ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-800">Widget</span>
                <p className="text-xs text-gray-500">{isWidgetActive ? 'Ativo' : 'Inativo'}</p>
              </div>
            </div>
            <Switch
              checked={isWidgetActive}
              onCheckedChange={onWidgetToggle}
              disabled={!widgetCode}
            />
          </div>

          {/* Código do Widget */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Código do Widget</label>
            <div className="relative">
              <textarea
                readOnly
                value={widgetCode}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleCopy}
                title="Copiar Código"
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
              >
                <CopyIcon className="w-4 h-4" />
              </button>
            </div>
            {copied && (
              <p className="text-xs text-green-600">Código copiado!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetTab;
