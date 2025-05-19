import React from "react";
import {
    Webhook,
    Server,
    Code as CodeIcon,
    Plug as PlugIcon,
    Slack,
    MessageSquare,
    Twitter,
    Zap,
} from "lucide-react"; 
import Switch from "@/components/ui/Switch";

interface IntegrationTabProps {
    webhookUrl: string;
    isWebhookActive: boolean;
    onWebhookUrlChange(url: string): void;
    onWebhookToggle(active: boolean): void;
    apiToken: string;
    isApiActive: boolean;
    onGenerateToken(): void;
    onApiToggle(active: boolean): void;
    widgetCode: string;
    isWidgetActive: boolean;
    onWidgetToggle(active: boolean): void;
    onCopyWidgetCode(): void;
}

const IntegrationTab: React.FC<IntegrationTabProps> = ({
    webhookUrl,
    isWebhookActive,
    onWebhookUrlChange,
    onWebhookToggle,
    apiToken,
    isApiActive,
    onGenerateToken,
    onApiToggle,
    widgetCode,
    isWidgetActive,
    onWidgetToggle,
    onCopyWidgetCode,
}) => (
    <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-800">Métodos de Acesso</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Webhook */}
            <div className="p-4 border rounded-lg">
                <h3 className="flex items-center gap-2 font-medium text-gray-700">
                    <Webhook size={18} /> Webhook
                </h3>
                <label className="block text-sm text-gray-600 mt-2">URL de Webhook</label>
                <input
                    type="url"
                    value={webhookUrl}
                    onChange={e => onWebhookUrlChange(e.target.value)}
                    placeholder="https://seu-site.com/webhook"
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                    Receba notificações quando seu agente for acionado ou envie dados para sistemas externos.
                </p>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-medium text-gray-700">Ativar Webhook</span>
                    <Switch checked={isWebhookActive} onCheckedChange={onWebhookToggle} />
                </div>
            </div>

            {/* API REST */}
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

            {/* Widget */}
            <div className="p-4 border rounded-lg">
                <h3 className="flex items-center gap-2 font-medium text-gray-700">
                    <CodeIcon size={18} /> Widget
                </h3>
                <label className="block text-sm text-gray-600 mt-2">Código do Widget</label>
                <textarea
                    readOnly
                    value={widgetCode}
                    rows={3}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm font-mono bg-gray-50"
                />
                <button
                    type="button"
                    onClick={onCopyWidgetCode}
                    className="mt-2 px-3 py-2 bg-white border rounded-md text-sm font-medium hover:bg-gray-50"
                >
                    Copiar Código
                </button>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-medium text-gray-700">Ativar Widget</span>
                    <Switch checked={isWidgetActive} onCheckedChange={onWidgetToggle} />
                </div>
            </div>

            {/* Integrações Externas */}
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
    </div>
);
export default IntegrationTab;
