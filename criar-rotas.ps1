# Corrigido: criar-rotas.ps1

$folders = @(
    "src/routes",
    "src/pages/Login",
    "src/pages/Dashboard"
)

$files = @{
    "src/routes/index.tsx" = @"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
"@;

    "src/pages/Login/index.tsx" = @"
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500">
      <LoginForm />
    </div>
  );
}
"@;

    "src/pages/Login/LoginForm.tsx" = @"
export default function LoginForm() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h2>
      <form>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
"@;

    "src/pages/Dashboard/index.tsx" = @"
export default function Dashboard() {
  return (
    <div className="flex justify-center items-center min-h-screen text-2xl font-bold">
      Você está logado! 🎉
    </div>
  );
}
"@;

    "src/main.tsx" = @"
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AppRoutes } from './routes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
"@;

    "src/App.tsx" = @"
export default function App() {
  return <h1>Genesis Web</h1>;
}
"@
}

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
    }
}

foreach ($file in $files.Keys) {
    $fullPath = $file -replace "/", "\"  # Windows path format
    Set-Content -Path $fullPath -Value $files[$file] -Encoding UTF8
}

Write-Host "\n✅ Estrutura criada com sucesso!" -ForegroundColor Green