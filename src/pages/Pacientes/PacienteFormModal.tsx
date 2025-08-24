import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Paciente } from "@/types/paciente";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Portal from "@/ui/Portal";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const schema = z.object({
  nome: z.string().min(3, "Informe um nome válido"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  dataNascimento: z.string().optional(), // ISO yyyy-MM-dd
});

export type PacienteFormData = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: Paciente | null;
  onSaved: () => void;
  onSubmitCreate: (payload: Omit<Paciente, "id">) => Promise<any>;
  onSubmitUpdate: (id: string, payload: Omit<Paciente, "id">) => Promise<any>;
};

export default function PacienteFormModal({
  open,
  onClose,
  initialData,
  onSaved,
  onSubmitCreate,
  onSubmitUpdate,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      cpf: "",
      email: "",
      dataNascimento: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nome: initialData.nome ?? "",
        cpf: initialData.cpf ?? "",
        email: initialData.email ?? "",
        dataNascimento: initialData.dataNascimento
          ? initialData.dataNascimento.substring(0, 10)
          : "",
      });
    } else {
      reset({
        nome: "",
        cpf: "",
        email: "",
        dataNascimento: "",
      });
    }
  }, [initialData, reset]);

  async function onSubmit(data: PacienteFormData) {
    const payload = {
      nome: data.nome.trim(),
      cpf: data.cpf.trim(),
      email: data.email?.trim() || undefined,
      dataNascimento: data.dataNascimento || undefined,
    };

    if (initialData?.id) {
      await onSubmitUpdate(initialData.id, payload);
    } else {
      await onSubmitCreate(payload);
    }
    onSaved();
    onClose();
  }

  // 🔒 trava o scroll do body enquanto a modal estiver aberta
  useLockBodyScroll(open);

  if (!open) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[10000] grid place-items-center p-4"
        aria-modal="true"
        role="dialog"
      >
        {/* Backdrop cobre TUDO */}
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />

        {/* Painel */}
        <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
          <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto p-5 md:p-6 pb-[env(safe-area-inset-bottom)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold">
                {initialData ? "Editar Paciente" : "Novo Paciente"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded hover:bg-gray-100"
                aria-label="Fechar"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Nome</label>
                  <input
                    {...register("nome")}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Nome completo"
                    autoFocus
                  />
                  {errors.nome && (
                    <p className="text-red-600 text-xs mt-1">{errors.nome.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">CPF</label>
                  <input
                    {...register("cpf")}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Somente números"
                  />
                  {errors.cpf && (
                    <p className="text-red-600 text-xs mt-1">{errors.cpf.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    E-mail (opcional)
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full border px-3 py-2 rounded"
                    placeholder="email@exemplo.com"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    {...register("dataNascimento")}
                    type="date"
                    className="w-full border px-3 py-2 rounded"
                  />
                  {errors.dataNascimento && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.dataNascimento.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded border hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded bg-gray-900 text-white hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Portal>
  );
}
