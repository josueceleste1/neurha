import React from "react";
import { Webhook } from "lucide-react";
import Switch from "@/components/ui/Switch";

export interface WebhookTabProps {
  webhookUrl: string;
  isWebhookActive: boolean;
  onWebhookUrlChange(url: string): void;
  onWebhookToggle(active: boolean): void;
}

const WebhookTab: React.FC<WebhookTabProps> = ({
  webhookUrl,
  isWebhookActive,
  onWebhookUrlChange,
  onWebhookToggle,
}) => (
  <div className="space-y-6">
    <h2 className="text-lg font-medium text-gray-800">Webhook</h2>
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
  </div>
);

export default WebhookTab;
