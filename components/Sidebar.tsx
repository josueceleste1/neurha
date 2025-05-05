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
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const STORAGE_KEY = "sidebar-is-open";

const links = [
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Documentos", href: "/documents", icon: FileText },
    { name: "Análises", href: "/analytics", icon: BarChart2 },
    { name: "Configurações", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);

    // Carrega estado do localStorage ao montar
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
            setIsOpen(saved === "true");
        }
    }, []);

    // Persiste estado no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, isOpen ? "true" : "false");
    }, [isOpen]);

    return (
        <aside
            className={clsx(
                "h-screen bg-[#2D005F] text-white flex flex-col p-2 space-y-6 shadow-md transition-all duration-200",
                isOpen ? "w-64" : "w-16"
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

            {/* Logo no topo, agora envolta em Link para a home */}
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
            <nav className="flex flex-col gap-4 flex-1">
                {links.map(({ name, href, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={clsx(
                            "flex items-center",
                            isOpen
                                ? "gap-3 px-3 py-2 justify-start"
                                : "p-2 justify-center",
                            "rounded-lg transition-colors duration-150 font-semibold text-lg text-[#E0D9F8]",
                            pathname === href ? "bg-white/10" : "hover:bg-white/5"
                        )}
                    >
                        <Icon className="text-[#C4B5FD] w-6 h-6 transition-all" />
                        {isOpen && <span className="truncate">{name}</span>}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
