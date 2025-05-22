import React from "react";
import { Code as CodeIcon } from "lucide-react";
import Switch from "@/components/ui/Switch";

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
}) => (
  <div className="space-y-6">
    <h2 className="text-lg font-medium text-gray-800">Widget</h2>
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
  </div>
);

export default WidgetTab;
