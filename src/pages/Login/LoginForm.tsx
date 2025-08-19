import { useForm } from "react-hook-form";
import type { LoginRequest } from "@/types/auth";
import { api } from "@/services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import LogoGenesis from "@/assets/logo-genesis.png";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";

export function LoginForm() {
  const { register, handleSubmit } = useForm<LoginRequest>();
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data: LoginRequest) => {
    try {
      const payload = { username: data.email, password: data.password };
      const response = await api.post("/Auth/login", payload);
      const { token } = response.data;

      login(token);
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data || "Erro ao fazer login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Empilha no mobile, duas colunas do md pra cima */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl rounded-lg shadow-lg overflow-hidden bg-white">
        {/* Lado esquerdo - branding */}
        <div className="w-full md:w-1/2 bg-[#142734] text-white p-8 md:p-12 flex flex-col items-center md:items-start justify-center">
          <img
            src={LogoGenesis}
            alt="Logo Genesis"
            className="h-16 md:h-20 w-auto mb-6 object-contain"
          />
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center md:text-left">
            Bem-vindo à Genesis!
          </h2>
          <p className="text-sm md:text-base text-center md:text-left max-w-md">
            Sua jornada para a excelência em saúde começa aqui. Faça login e tenha
            acesso a um mundo de soluções para o gerenciamento de exames médicos com
            agilidade e segurança.
          </p>
        </div>

        {/* Lado direito - formulário */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-[#142734] text-center md:text-left">
            Entrar na Conta
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Digite seu email"
                  className="w-full focus:outline-none text-black text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Senha</label>
              <div className="flex items-center border border-gray-300 rounded px-3 py-2 bg-white">
                <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Digite sua senha"
                  className="w-full focus:outline-none text-black text-base"
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm text-center md:text-left">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#142734] text-white py-3 rounded hover:bg-[#0f1f29] text-base md:text-lg"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}