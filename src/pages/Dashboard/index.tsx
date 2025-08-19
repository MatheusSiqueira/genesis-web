import { useMemo, useState } from "react";
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
} from "@heroicons/react/24/outline";

// ===== Mock (troque depois por dados reais da API) =====
const useDashboardData = () => {
  return useMemo(
    () => ({
      kpis: {
        pacientes: { total: 1243, delta: +18 },
        exames: { total: 4870, delta: +132 },
        medicos: { total: 27, delta: -1 },
      },
      examesMensais: [
        { m: "Jan", v: 220 },
        { m: "Fev", v: 260 },
        { m: "Mar", v: 280 },
        { m: "Abr", v: 245 },
        { m: "Mai", v: 310 },
        { m: "Jun", v: 330 },
        { m: "Jul", v: 355 },
        { m: "Ago", v: 372 },
        { m: "Set", v: 340 },
        { m: "Out", v: 390 },
        { m: "Nov", v: 405 },
        { m: "Dez", v: 430 },
      ],
      topExames: [
        { nome: "Hemograma", qtd: 1240 },
        { nome: "Glicose", qtd: 990 },
        { nome: "Colesterol", qtd: 870 },
        { nome: "Ureia", qtd: 640 },
        { nome: "Creatinina", qtd: 540 },
      ],
      ultimosEventos: [
        { id: "E-9341", paciente: "Maria L.", exame: "Hemograma", data: "Hoje 10:12", status: "Concluído" },
        { id: "E-9338", paciente: "Diego F.", exame: "Glicose", data: "Hoje 09:37", status: "Em análise" },
        { id: "E-9329", paciente: "Ana P.", exame: "TSH", data: "Ontem 17:05", status: "Coletado" },
        { id: "E-9321", paciente: "João M.", exame: "PCR", data: "Ontem 15:22", status: "Concluído" },
      ],
    }),
    []
  );
};

// ===== Componentes visuais reutilizáveis =====
function Trend({ delta }: { delta: number }) {
  const isUp = delta >= 0;
  const Icon = isUp ? ArrowUpRightIcon : ArrowDownRightIcon;
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${
      isUp ? "text-emerald-600" : "text-rose-600"
    }`}>
      <Icon className="h-4 w-4" />
      {isUp ? "+" : ""}
      {delta}
    </span>
  );
}

function KpiCard({
  title,
  value,
  delta,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  delta: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5 flex items-start gap-4">
      <div className="h-12 w-12 rounded-xl bg-genesis-primary50/15 flex items-center justify-center">
        <Icon className="h-6 w-6 text-genesis-primary50" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">{title}</p>
          <Trend delta={delta} />
        </div>
        <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  // Gera um pequeno sparkline como SVG sem libs externas
  const w = 140;
  const h = 44;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const norm = (v: number) => (h - 6) - ((v - min) / Math.max(1, max - min)) * (h - 12);
  const step = w / Math.max(1, values.length - 1);
  const d = values.map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${norm(v)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12 overflow-visible">
      <defs>
        <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopOpacity="0.25" />
          <stop offset="100%" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" strokeWidth="2" />
    </svg>
  );
}

function AreaChart({ series }: { series: { label: string; data: { m: string; v: number }[] } }) {
  const w = 520;
  const h = 220;
  const padding = 28;
  const values = series.data.map((x) => x.v);
  const max = Math.max(...values) * 1.1;
  const min = 0;
  const X = (i: number) => padding + (i * (w - padding * 2)) / (series.data.length - 1);
  const Y = (v: number) => padding + (h - padding * 2) * (1 - (v - min) / (max - min));
  const line = series.data.map((p, i) => `${i === 0 ? "M" : "L"}${X(i)},${Y(p.v)}`).join(" ");
  const area = `${line} L${X(series.data.length - 1)},${Y(min)} L${X(0)},${Y(min)} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[220px]">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopOpacity="0.2" />
          <stop offset="100%" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* grid horizontal */}
      {Array.from({ length: 4 }).map((_, i) => (
        <line
          key={i}
          x1={padding}
          x2={w - padding}
          y1={padding + (i * (h - padding * 2)) / 3}
          y2={padding + (i * (h - padding * 2)) / 3}
          strokeOpacity={0.1}
        />
      ))}
      <path d={area} fill="url(#grad)" />
      <path d={line} fill="none" strokeWidth="2" />
      {/* eixos */}
      <line x1={padding} x2={w - padding} y1={h - padding} y2={h - padding} strokeOpacity={0.2} />
      {/* labels X */}
      {series.data.map((p, i) => (
        <text key={p.m} x={X(i)} y={h - padding + 18} textAnchor="middle" fontSize="10">
          {p.m}
        </text>
      ))}
    </svg>
  );
}

function BarList({ items }: { items: { nome: string; qtd: number }[] }) {
  const total = Math.max(...items.map((i) => i.qtd));
  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div key={i.nome} className="">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{i.nome}</span>
            <span className="font-medium">{i.qtd}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full"
              style={{ width: `${(i.qtd / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { kpis, examesMensais, topExames, ultimosEventos } = useDashboardData();
  const [periodo, setPeriodo] = useState("ultimos-30");

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-slate-500">Visão geral do laboratório</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2"
          >
            <option value="ultimos-7">Últimos 7 dias</option>
            <option value="ultimos-30">Últimos 30 dias</option>
            <option value="ano">Este ano</option>
          </select>
          <button className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm shadow hover:brightness-95">
            Exportar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <KpiCard title="Pacientes" value={kpis.pacientes.total} delta={kpis.pacientes.delta} icon={UserGroupIcon} />
        <KpiCard title="Exames" value={kpis.exames.total} delta={kpis.exames.delta} icon={ClipboardDocumentListIcon} />
        <KpiCard title="Médicos" value={kpis.medicos.total} delta={kpis.medicos.delta} icon={UserIcon} />
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Exames por mês</h3>
            <span className="text-sm text-slate-500">{periodo === "ano" ? "2025" : "últimos meses"}</span>
          </div>
          <AreaChart series={{ label: "Exames", data: examesMensais }} />
        </div>

        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5">
          <h3 className="font-semibold mb-3">Top exames</h3>
          <BarList items={topExames} />
          <div className="mt-4">
            <Sparkline values={examesMensais.map((x) => x.v)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Últimas movimentações</h3>
            <button className="text-sm underline-offset-2 hover:underline">Ver todas</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Paciente</th>
                  <th className="py-2 pr-4">Exame</th>
                  <th className="py-2 pr-4">Data</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {ultimosEventos.map((e) => (
                  <tr key={e.id} className="border-t border-slate-100">
                    <td className="py-2 pr-4 font-medium">{e.id}</td>
                    <td className="py-2 pr-4">{e.paciente}</td>
                    <td className="py-2 pr-4">{e.exame}</td>
                    <td className="py-2 pr-4">{e.data}</td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        e.status === "Concluído"
                          ? "bg-emerald-50 text-emerald-700"
                          : e.status === "Em análise"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5">
          <h3 className="font-semibold mb-3">Ações rápidas</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">Novo paciente</button>
            <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">Novo exame</button>
            <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">Importar CSV</button>
            <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">Gerar relatório</button>
          </div>
        </div>
      </div>
    </div>
  );
}
