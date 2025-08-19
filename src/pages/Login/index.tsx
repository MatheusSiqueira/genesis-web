import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <main className="flex flex-1 items-center justify-center">
        <LoginForm />
      </main>

      <footer className="text-center text-xs text-gray-400 py-4 bg-gray-200">
        © {new Date().getFullYear()} Genesis | Todos os direitos reservados
      </footer>
    </div>
  );
}
