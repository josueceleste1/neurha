// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
    MessageSquare,
    FileText,
    BarChart2,
    Settings,
    ChevronLeft,
    ChevronRight,
    Users,
    Home,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const STORAGE_KEY = "sidebar-is-open";

const links = [
    { name: "Início", href: "/", icon: Home },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Agentes", href: "/agents", icon: Users },
    { name: "Documentos", href: "/documents", icon: FileText },
    { name: "Análises", href: "/analytics", icon: BarChart2 },
    { name: "Configurações", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
            setIsOpen(saved === "true");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, isOpen ? "true" : "false");
    }, [isOpen]);

    return (
        <aside
            className={clsx(
                "h-screen bg-gradient-to-b from-[#1A002A] to-[#38126D] text-white flex flex-col p-2 space-y-6 shadow-md transition-all duration-200",
                isOpen ? "w-64" : "w-20"
            )}
        >
            {/* Botão de toggle */}
            <button
                onClick={() => setIsOpen((o) => !o)}
                className="self-end p-2 rounded hover:bg-white/10"
                title={isOpen ? "Fechar menu" : "Abrir menu"}
            >
                {isOpen ? (
                    <ChevronLeft className="w-8 h-8" />
                ) : (
                    <ChevronRight className="w-8 h-8" />
                )}
            </button>

            {/* Logo no topo */}
            {isOpen && (
                <div className="flex mb-4">
                    <Link href="/" className="block w-full">
                        <Image
                            src="/logo-neurha-4.png"
                            alt="NeuRHa AI Logo"
                            width={240}
                            height={70}
                            priority
                        />
                    </Link>
                </div>
            )}

            {/* Navegação */}
            <nav className="flex flex-col gap-3 flex-1 px-2">
                {links.map(({ name, href, icon: Icon }) => {
                    const isActive = pathname === href || pathname.startsWith(`${href}/`);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200",
                                isActive
                                    ? "bg-white/15 text-white shadow-lg border-l-4 border-purple-300"
                                    : "text-gray-300 hover:bg-white/5 hover:text-white hover:border-l-4 hover:border-purple-300/50"
                            )}
                        >
                            <span className={clsx(
                                "transition-transform",
                                isActive ? "transform scale-110" : ""
                            )}>
                                <Icon className="h-5 w-5" />
                            </span>
                            {isOpen && <span className="font-medium">{name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Rodapé com perfil
            <div className="p-4 border-t border-purple-800/40 bg-black/20">
                <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-xl font-semibold shadow-lg">
                        N
                    </div>
                    {isOpen && (
                        <div className="text-sm">
                            <div className="font-medium">Admin</div>
                            <div className="text-purple-200">NeuRHa AI</div>
                        </div>
                    )}
                </div>
            </div> */}
        </aside>
    );
}
