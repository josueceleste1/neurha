import type { SelectHTMLAttributes, ReactNode } from "react";
import type { AgentStatus } from "./agents";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Arrays de opções para exibição. Se fornecido, renderiza automaticamente <option>. */
  options?: { value: string; label: string }[];
  /** Se preferir passar manualmente <option> como children. */
  children?: ReactNode;
  /** Classe Tailwind opcional para customização. */
  className?: string;
}

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Se true, o switch fica desabilitado */
  disabled?: boolean;
}

export interface ToastProps {
  title: string;
  description: string;
  onClose: () => void;
}

export interface StatusBadgeProps {
  status: AgentStatus;
}
