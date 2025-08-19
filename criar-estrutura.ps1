# Caminho base (ajuste se necessário)
$rootPath = ".\src"

# Lista de diretórios para criar
$dirs = @(
    "$rootPath\assets",
    "$rootPath\components",
    "$rootPath\features\paciente\components",
    "$rootPath\features\paciente\pages",
    "$rootPath\features\paciente\services",
    "$rootPath\features\paciente",
    "$rootPath\features\medico\components",
    "$rootPath\features\medico\pages",
    "$rootPath\features\medico\services",
    "$rootPath\features\medico",
    "$rootPath\features\auth\pages",
    "$rootPath\hooks",
    "$rootPath\layout",
    "$rootPath\routes",
    "$rootPath\services",
    "$rootPath\styles",
    "$rootPath\utils"
)

# Criar diretórios
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
        Write-Host "Criado: $dir"
    }
}

# Criar arquivos básicos
$arquivos = @{
    "$rootPath\App.tsx" = @"
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
"@

    "$rootPath\main.tsx" = @"
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/tailwind.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"@

    "$rootPath\routes\index.tsx" = @"
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import Dashboard from '../layout/Dashboard';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  );
}
"@

    "$rootPath\features\auth\pages\LoginPage.tsx" = @"
export default function LoginPage() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-2xl font-bold'>Login</h1>
    </div>
  );
}
"@

    "$rootPath\layout\Dashboard.tsx" = @"
export default function Dashboard() {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
    </div>
  );
}
"@

    "$rootPath\styles\tailwind.css" = @"
@tailwind base;
@tailwind components;
@tailwind utilities;
"@

}

# Criar arquivos
foreach ($arquivo in $arquivos.Keys) {
    Set-Content -Path $arquivo -Value $arquivos[$arquivo]
    Write-Host "Arquivo criado: $arquivo"
}

Write-Host "`n✅ Estrutura de pastas e arquivos criada com sucesso!"
