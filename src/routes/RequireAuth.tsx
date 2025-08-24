import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function RequireAuth() {
  const { isAuthenticated, isReady } = useAuth();
  const location = useLocation();

  // enquanto não hidratar o auth, não decide rota (evita redirect indevido)
  if (!isReady) {
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        Carregando…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
