import { useEffect, useMemo, useState } from "react";
import type { Paciente } from "@/types/paciente";
import {
  getPacientes, createPaciente, updatePaciente, deletePaciente,
} from "@/services/pacientes";
import AppHeader from "@/components/layout/AppHeader";
import PacienteFormModal from "./PacienteFormModal";
import {
  XMarkIcon, PencilSquareIcon, TrashIcon,
} from "@heroicons/react/24/outline";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

type Chip = { id: string; label: string };

function FilterChip({ chip, onRemove }: { chip: Chip; onRemove: (id: string) => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl bg-genesis-chip text-genesis-ink px-3 py-1 text-sm">
      {chip.label}
      <button onClick={() => onRemove(chip.id)} className="hover:opacity-70">
        <XMarkIcon className="h-4 w-4" />
      </button>
    </span>
  );
}

export default function PacientesList() {
  const [data, setData] = useState<Paciente[]>([]);
  const [qRaw, setQRaw] = useState("");
  const q = useDebouncedValue(qRaw, 300); // só atualiza q depois de 300ms
  const [chips, setChips] = useState<Chip[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Paciente | null>(null);

  async function load() {
    const res = await getPacientes();
    setData(res ?? []);
  }
  useEffect(() => { load(); }, []);

  // ----- Busca (debounced) e filtro separados -----
  const term = useMemo(() => q.trim().toLowerCase(), [q]);

  const base = useMemo(() => {
    if (!term) return data;
    return data.filter(p =>
      p.nome?.toLowerCase().includes(term) ||
      p.cpf?.toLowerCase().includes(term) ||
      (p.email?.toLowerCase().includes(term) ?? false)
    );
  }, [data, term]);

  // ----- Cálculo de paginação para o resultado filtrado -----
  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(base.length / pageSize)),
    [base.length, pageSize]
  );

  // Se a página atual ficou inválida após uma busca/troca de pageSize, clamp para última válida
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const start = (page - 1) * pageSize;

  const filtered = useMemo(() => {
    return {
      items: base.slice(start, start + pageSize),
      total: base.length,
      pageCount,
      current: page,
    };
  }, [base, start, pageSize, page, pageCount]);

  const startItem = filtered.total ? (filtered.current - 1) * pageSize + 1 : 0;
  const endItem = filtered.total ? Math.min(filtered.current * pageSize, filtered.total) : 0;

  function removeChip(id: string) { setChips(prev => prev.filter(c => c.id !== id)); }
  function clearChips() { setChips([]); }

  return (
    <div className="space-y-5">
      <AppHeader
        title="Pacientes"
        searchValue={qRaw}
        onSearchChange={(v) => {
          // não resetamos a página aqui; o clamp garante coerência
          setQRaw(v);
        }}
        right={
          <select
            className="rounded-xl border px-3 py-2 bg-white"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              // sem reset: clamp cuidará se a página atual ficar inválida
            }}
          >
            {[5, 8, 10, 20, 50].map(n => <option key={n} value={n}>{n} / pág</option>)}
          </select>
        }
        onNew={() => { setEditing(null); setOpen(true); }}
      />

      {/* Chips de filtro + limpar */}
      {chips.length > 0 && (
        <div className="bg-white rounded-2xl shadow-card px-4 py-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-genesis-inkSoft mr-1">Filtrar por:</span>
          {chips.map(c => <FilterChip key={c.id} chip={c} onRemove={removeChip} />)}
          <button onClick={clearChips} className="ml-auto text-sm text-genesis-primary underline">
            Limpar
          </button>
        </div>
      )}

      {/* Conteúdo: tabela desktop, cards mobile */}
      <div className="hidden md:block bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-auto max-h-[65vh]">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-genesis-primary text-white">
                {["Nome", "CPF", "E-mail", "Nascimento", "Ações"].map((h, i) => (
                  <th
                    key={h}
                    className={`text-left p-3 font-medium ${i === 0 ? "pl-4" : ""} ${i === 4 ? "text-right pr-4" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.items.map(p => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 pl-4 font-medium">{p.nome}</td>
                  <td className="p-3">{p.cpf}</td>
                  <td className="p-3">{p.email ?? "-"}</td>
                  <td className="p-3">{p.dataNascimento ? new Date(p.dataNascimento).toLocaleDateString() : "-"}</td>
                  <td className="p-3 pr-4 text-right">
                    <button
                      onClick={() => { setEditing(p); setOpen(true); }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border mr-2 hover:bg-gray-50"
                    >
                      <PencilSquareIcon className="h-4 w-4" /> Editar
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("Excluir paciente?")) return;
                        await deletePaciente(p.id);
                        load();
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                      <TrashIcon className="h-4 w-4" /> Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.items.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Nenhum paciente encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer tabela */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 border-t">
          <div className="text-sm text-gray-600">
            Exibindo <b>{startItem}</b>–<b>{endItem}</b> de <b>{filtered.total}</b>
          </div>
          <div className="flex gap-1">
            <button
              className="px-3 py-1 rounded-lg border disabled:opacity-40"
              disabled={filtered.current <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >Anterior</button>
            {Array.from({ length: filtered.pageCount }).map((_, i) => {
              const n = i + 1, active = n === filtered.current;
              return (
                <button key={n} onClick={() => setPage(n)}
                  className={`px-3 py-1 rounded-lg border ${active ? "bg-genesis-primary text-white border-genesis-primary" : ""}`}>
                  {n}
                </button>
              );
            })}
            <button
              className="px-3 py-1 rounded-lg border disabled:opacity-40"
              disabled={filtered.current >= filtered.pageCount}
              onClick={() => setPage(p => Math.min(filtered.pageCount, p + 1))}
            >Próxima</button>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.items.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-card p-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{p.nome}</div>
                <div className="text-xs text-gray-500">CPF: {p.cpf}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-lg border text-sm" onClick={() => { setEditing(p); setOpen(true); }}>Editar</button>
                <button className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm" onClick={async () => { if (!confirm("Excluir?")) return; await deletePaciente(p.id); load(); }}>Excluir</button>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <div className="text-gray-700">E-mail: {p.email ?? "-"}</div>
              <div className="text-gray-700">Nascimento: {p.dataNascimento ? new Date(p.dataNascimento).toLocaleDateString() : "-"}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <PacienteFormModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={editing}
        onSaved={load}
        // Dica: se o seu PacienteFormModal exige Promise<void>, envolva os services:
        onSubmitCreate={async (payload) => { await createPaciente(payload); }}
        onSubmitUpdate={async (id, payload) => { await updatePaciente(id, payload); }}
      />
    </div>
  );
}
