import { useEffect, useMemo, useState } from "react";
import type { Paciente } from "@/types/paciente";
import { getPacientes, createPaciente, updatePaciente, deletePaciente } from "@/services/pacientes";
import AppHeader from "@/components/layout/AppHeader";
import PacienteFormModal from "./PacienteFormModal";
import { XMarkIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import Button from "@/ui/Button";

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
  const [items, setItems] = useState<Paciente[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [qRaw, setQRaw] = useState("");
  const q = useDebouncedValue(qRaw, 300);

  const [chips, setChips] = useState<Chip[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Paciente | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  async function load() {
    setLoading(true);
    try {
      const res = await getPacientes({ page, pageSize, q });
      setItems(res.items);
      setTotal(res.total);
      if (page > Math.ceil(res.total / res.pageSize) && res.total > 0) setPage(1);
    } finally {
      setLoading(false);
    }
  }

  // dispara quando muda página, pageSize ou busca
  useEffect(() => { load(); }, [page, pageSize, q]);

  const startItem = total ? (page - 1) * pageSize + 1 : 0;
  const endItem = total ? Math.min(page * pageSize, total) : 0;

  function removeChip(id: string) { setChips(prev => prev.filter(c => c.id !== id)); }
  function clearChips() { setChips([]); }

  return (
    <div className="space-y-5">
      <AppHeader
        title="Pacientes"
        searchValue={qRaw}
        onSearchChange={(v) => { setQRaw(v); setPage(1); }} // reset p/ 1 ao trocar busca
        pageSize={pageSize}
        onPageSizeChange={(n) => { setPageSize(n); setPage(1); }}
        onNew={() => { setEditing(null); setOpen(true); }}
      />

      {chips.length > 0 && (
        <div className="bg-white rounded-2xl shadow-card px-4 py-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-genesis-inkSoft mr-1">Filtrar por:</span>
          {chips.map(c => <FilterChip key={c.id} chip={c} onRemove={removeChip} />)}
          <button onClick={clearChips} className="ml-auto text-sm text-genesis-primary underline">
            Limpar
          </button>
        </div>
      )}

      {/* Tabela (desktop) */}
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
              {loading && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Carregando…</td></tr>
              )}
              {!loading && items.map(p => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 pl-4 font-medium">{p.nome}</td>
                  <td className="p-3">{p.cpf}</td>
                  <td className="p-3">{p.email ?? "-"}</td>
                  <td className="p-3">{p.dataNascimento ? new Date(p.dataNascimento).toLocaleDateString() : "-"}</td>
                  <td className="p-3 pr-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconLeft={<PencilSquareIcon className="h-4 w-4" />}
                      className="mr-2"
                      onClick={() => { setEditing(p); setOpen(true); }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      iconLeft={<TrashIcon className="h-4 w-4" />}
                      isLoading={deletingId === p.id}
                      onClick={async () => {
                        if (!confirm("Excluir paciente?")) return;
                        try {
                          setDeletingId(p.id);
                          await deletePaciente(p.id);
                          await load();
                        } finally {
                          setDeletingId(null);
                        }
                      }}
                    >
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Nenhum paciente encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer da tabela */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 border-t">
          <div className="text-sm text-gray-600">
            Exibindo <b>{startItem}</b>–<b>{endItem}</b> de <b>{total}</b>
          </div>
          <div className="flex gap-1">
            <button
              className="px-3 py-1 rounded-lg border disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >Anterior</button>
            {Array.from({ length: pageCount }).map((_, i) => {
              const n = i + 1, active = n === page;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`px-3 py-1 rounded-lg border ${active ? "bg-genesis-primary text-white border-genesis-primary" : ""}`}
                >
                  {n}
                </button>
              );
            })}
            <button
              className="px-3 py-1 rounded-lg border disabled:opacity-40"
              disabled={page >= pageCount}
              onClick={() => setPage(p => Math.min(pageCount, p + 1))}
            >Próxima</button>
          </div>
        </div>
      </div>

      {/* Cards (mobile) */}
      <div className="md:hidden space-y-3">
        {loading && <div className="bg-white rounded-2xl shadow-card p-3 text-center text-gray-500">Carregando…</div>}
        {!loading && items.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-card p-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{p.nome}</div>
                <div className="text-xs text-gray-500">CPF: {p.cpf}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setEditing(p); setOpen(true); }}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  isLoading={deletingId === p.id}
                  onClick={async () => {
                    if (!confirm("Excluir?")) return;
                    try {
                      setDeletingId(p.id);
                      await deletePaciente(p.id);
                      await load();
                    } finally {
                      setDeletingId(null);
                    }
                  }}
                >
                  Excluir
                </Button>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <div className="text-gray-700">E-mail: {p.email ?? "-"}</div>
              <div className="text-gray-700">Nascimento: {p.dataNascimento ? new Date(p.dataNascimento).toLocaleDateString() : "-"}</div>
            </div>
          </div>
        ))}

        {/* Paginação também no mobile */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-xs text-gray-600 pl-1">
            {startItem}–{endItem} de {total}
          </div>
          <div className="flex gap-1">
            <button
              className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >Anterior</button>
            <button
              className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40"
              disabled={page >= pageCount}
              onClick={() => setPage(p => Math.min(pageCount, p + 1))}
            >Próxima</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <PacienteFormModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={editing}
        onSaved={load}
        onSubmitCreate={async (payload) => { await createPaciente(payload); }}
        onSubmitUpdate={async (id, payload) => { await updatePaciente(id, payload); }}
      />
    </div>
  );
}
