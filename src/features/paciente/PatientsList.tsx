// src/features/paciente/PatientsList.tsx
import type { Paciente } from "@/types/paciente";
import type { PageResult } from "@/services/pacientes";

type Props = {
  pageResult: PageResult<Paciente>;
  onEdit: (p: Paciente) => void;
  onDelete: (id: Paciente["id"]) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export default function PatientsList({
  pageResult,
  onEdit,
  onDelete,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const { items, total, page, pageSize } = pageResult;

  return (
    <div>
      {/* sua tabela/cards aqui */}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Nascimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.cpf}</td>
              <td>{p.email}</td>
              <td>{p.dataNascimento}</td>
              <td>
                <button onClick={() => onEdit(p)}>Editar</button>
                <button onClick={() => onDelete(p.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação simples */}
      <div>
        <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Anterior
        </button>
        <span>
          Página {page} de {Math.ceil(total / pageSize)}
        </span>
        <button
          disabled={page >= Math.ceil(total / pageSize)}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
        </button>

        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} / pág
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
