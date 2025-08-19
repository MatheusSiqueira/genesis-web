// Layout.tsx (ou App.tsx)
import AppSidebar from "@/components/layout/AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Marca d’água deve estar ATRÁS e sem eventos */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-5
                   bg-[url('/assets/logo-genesis.png')] bg-no-repeat bg-center bg-contain"
        aria-hidden
      />

      <AppSidebar />

      <main
        className="
          relative z-10
          pl-24    /* espaço pro sidebar (16 + margens) */
          pr-5 pt-5 pb-5
          max-w-[1400px]
        "
      >
        {children}
      </main>
    </div>
  );
}
