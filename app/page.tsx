// app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-screen overflow-x-hidden">
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#4C1D95] via-[#7E22CE] to-[#1E1B4B] text-white pl-10">
        <div className="flex flex-col md:flex-row w-full max-w-7xl items-center justify-between px-16 gap-16">
          <div className="flex flex-col items-start text-left max-w-xl">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight text-[#E0D9F8]">
              Bem-vindo ao <br />
              <span className="text-[#C4B5FD]">NeuRHa AI</span>
            </h1>
            <p className="text-lg md:text-2xl text-[#DDD6FE] mb-10">
                Aumente a produtividade de qualquer setor com nossa plataforma de IA conversacional. Crie fluxos automatizados, responda dúvidas 24/7, e ofereça uma experiência personalizada para clientes e colaboradores.
            </p>
            <Link href="/chat">
              <button className="bg-[#A855F7] hover:bg-[#9333EA] text-white font-semibold px-10 py-4 rounded-xl transition text-lg md:text-xl">
                Iniciar Chat
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
