// src/layout/LayoutShell.tsx
import { useState } from "react";
import { Sidebar } from "@/ui/Sidebar";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-4 border-b bg-white shadow-sm">
          {/* Botão hambúrguer só no mobile */}
          <button
            className="lg:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Abrir menu</span>
            {/* três barras simples */}
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-gray-800"></span>
              <span className="block w-6 h-0.5 bg-gray-800"></span>
              <span className="block w-6 h-0.5 bg-gray-800"></span>
            </div>
          </button>

          <h1 className="font-semibold text-gray-800">Genesis</h1>
        </header>

        {/* Área scrollável do conteúdo */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
