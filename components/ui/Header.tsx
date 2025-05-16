"use client";

import React, { FC, ReactNode, useState, useRef, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { HeaderProps } from "@/types/layout";

const Header: FC<HeaderProps> = ({ title, icon, userName, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/10 z-50">
      <div className="flex items-center gap-3 text-white">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none text-white"
          aria-label="Abrir menu de usuário"
        >
          <User className="w-5 h-5" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg text-white">
            <div className="px-4 py-2 text-sm">{userName}</div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/20 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
