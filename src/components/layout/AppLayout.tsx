import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen relative">
      <AppSidebar />

      {/* A classe 'watermark' aplica a marca d’água, mas o conteúdo fica acima */}
      <main className="pl-24 md:pl-28 pr-5 py-5 relative z-0">
        <div className="relative z-10 mx-auto max-w-7xl space-y-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
