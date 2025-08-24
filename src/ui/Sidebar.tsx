// src/ui/Sidebar.tsx
import { XMarkIcon } from "@heroicons/react/24/outline";

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Overlay (só no mobile) */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={[
          // z-30 → sempre abaixo da modal (que está z-50)
          "fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white shadow-xl",
          "rounded-none", // retangular
          "transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-hidden={!open}
      >
        <div className="lg:hidden h-14 flex items-center justify-between px-4 border-b border-white/10">
          <span className="font-semibold">Menu</span>
          <button onClick={onClose}>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <a className="block px-3 py-2 hover:bg-white/10" href="/dashboard">Dashboard</a>
          <a className="block px-3 py-2 hover:bg-white/10" href="/pacientes">Pacientes</a>
        </nav>
      </aside>
    </>
  );
}
