// src/components/ui/Select.tsx
"use client";

import React, {
  forwardRef,
  SelectHTMLAttributes,
  ReactNode
} from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * Arrays de opções para exibição. Se fornecido, renderiza automaticamente <option>.
   */
  options?: { value: string; label: string }[];
  /**
   * Se preferir passar manualmente <option> como children.
   */
  children?: ReactNode;
  /**
   * Classe Tailwind opcional para customização.
   */
  className?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, children, className = "", ...props }, ref) => {
    return (
      <div className={`relative inline-block text-left ${className}`}>
        <select
          ref={ref}
          {...props}
          className="
            w-full
            bg-white
            text-black
            border border-gray-300
            rounded-md
            p-2
            focus:outline-none focus:ring-2 focus:ring-purple-500
          "
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
