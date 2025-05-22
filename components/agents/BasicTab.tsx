import React from "react";
import Switch from "@/components/ui/Switch";
import type { BasicTabProps } from "@/types/agents";

const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";
const inputClasses =
  "mt-1 w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 transition-all";
const helperTextClasses = "mt-1.5 text-xs text-gray-500";

const BasicTab: React.FC<BasicTabProps> = ({
  name,
  onNameChange,
  description,
  onDescriptionChange,
  tags,
  onTagsChange,
  status,
  onStatusChange,
}) => (
  <div className="space-y-6">
    <h2 className="text-lg font-medium text-gray-800">Informações Básicas do Agente</h2>

    <div>
      <label className={labelClasses}>Nome do Agente</label>
      <input
        type="text"
        value={name}
        onChange={e => onNameChange(e.target.value)}
        required
        placeholder="Ex: Agente de Vendas"
        className={inputClasses}
      />
    </div>

    <div>
      <label className={labelClasses}>Descrição</label>
      <textarea
        rows={4}
        value={description}
        onChange={e => onDescriptionChange(e.target.value)}
        placeholder="Descreva o propósito e funcionalidades deste agente..."
        className={inputClasses}
      />
    </div>

    <div>
      <label className={labelClasses}>Tags</label>
      <input
        type="text"
        value={tags}
        onChange={e => onTagsChange(e.target.value)}
        placeholder="vendas, suporte, atendimento"
        className={inputClasses}
      />
      <p className={helperTextClasses}>Separe as tags por vírgulas</p>
    </div>

    <div>
      <label className={labelClasses}>Status</label>
      <div className="inline-flex items-center space-x-3 mt-1">
        <Switch
          checked={status === "active"}
          onCheckedChange={checked => onStatusChange(checked ? "active" : "inactive")}
        />
        <span
          className={`text-sm font-medium px-2.5 py-1 rounded-full ${
            status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
          }`}
        >
          {status === "active" ? "Ativo" : "Inativo"}
        </span>
      </div>
    </div>
  </div>
);

export default BasicTab;
