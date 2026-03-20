"use client";

import { useMemo, useState } from "react";
import { ListChecks, Radar, ShieldAlert, Sparkles } from "lucide-react";

import { DetailPanel } from "@/components/common/detail-panel";
import { MiniBar } from "@/components/common/mini-bar";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusChip } from "@/components/common/status-chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardData } from "@/lib/mock-data";
import { OpportunityCard } from "@/lib/types";
import { formatChannelLabel } from "@/lib/utils";

type OpportunityFilter = "Todas" | "Oportunidad" | "Riesgo";

type OpportunityRow = OpportunityCard & {
  status: "Prioridad alta" | "Seguimiento" | "Riesgo";
  revenuePotential: string;
  marginPotential: number;
};

function getOpportunityStatus(score: number, type: "Oportunidad" | "Riesgo"): OpportunityRow["status"] {
  if (type === "Riesgo") return "Riesgo";
  if (score >= 85) return "Prioridad alta";
  return "Seguimiento";
}

export function AiOpportunityEnginePage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<OpportunityFilter>("Todas");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = useMemo<OpportunityRow[]>(
    () =>
      dashboardData.opportunities.map((item) => {
        const region = dashboardData.regions.find((regionItem) => regionItem.region === item.region);
        return {
          ...item,
          status: getOpportunityStatus(item.score, item.type),
          revenuePotential: item.impactRange,
          marginPotential: region?.marginPotential ?? 0
        };
      }),
    []
  );

  const filteredRows = useMemo(() => {
    const value = query.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesQuery =
        !value ||
        `${row.region} ${row.product} ${row.channel} ${row.title} ${row.action}`.toLowerCase().includes(value);
      const matchesFilter =
        filter === "Todas" ||
        (filter === "Oportunidad" && row.type === "Oportunidad") ||
        (filter === "Riesgo" && row.type === "Riesgo");
      return matchesQuery && matchesFilter;
    });
  }, [filter, query, rows]);

  const selected = selectedId ? rows.find((row) => row.id === selectedId) ?? null : null;
  const topPriorities = rows.filter((row) => row.status === "Prioridad alta").slice(0, 3);
  const watchlist = rows.filter((row) => row.status === "Riesgo").slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Motor de oportunidades"
        title="Oportunidades comerciales"
        description="Qué activar, qué vigilar y qué impacto podría generar cada frente comercial."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Oportunidades abiertas" value={`${rows.filter((row) => row.type === "Oportunidad").length}`} detail="Frentes listos para analizar" icon={Sparkles} />
        <MetricCard title="Prioridad alta" value={`${rows.filter((row) => row.status === "Prioridad alta").length}`} detail="Con mejor retorno esperado" icon={Radar} />
        <MetricCard title="Riesgos activos" value={`${watchlist.length}`} detail="Con efecto sobre margen o cobertura" icon={ShieldAlert} />
        <MetricCard title="Acciones sugeridas" value={`${dashboardData.recommendedActions.length}`} detail="Próximos pasos modelados" icon={ListChecks} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="gap-4 border-b border-white/10 pb-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <CardTitle>Tabla de oportunidades</CardTitle>
              <div className="flex flex-wrap gap-2">
                {["Todas", "Oportunidad", "Riesgo"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFilter(option as OpportunityFilter)}
                    className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition ${
                      filter === option
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <SearchInput value={query} onChange={setQuery} placeholder="Buscar región, producto o canal..." className="xl:max-w-[440px]" />
          </CardHeader>
          <CardContent className="overflow-x-auto scroll-clean pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Región</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Score de oportunidad</TableHead>
                  <TableHead>Potencial de ingresos</TableHead>
                  <TableHead>Potencial de margen</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acción sugerida</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.id} className="cursor-pointer" onClick={() => setSelectedId(row.id)}>
                    <TableCell className="font-medium text-white">{row.region}</TableCell>
                    <TableCell>{row.product}</TableCell>
                    <TableCell>{formatChannelLabel(row.channel)}</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <span>{row.score}</span>
                        <MiniBar value={row.score} tone={row.status === "Riesgo" ? "rose" : "accent"} />
                      </div>
                    </TableCell>
                    <TableCell>{row.revenuePotential}</TableCell>
                    <TableCell>{row.marginPotential}</TableCell>
                    <TableCell>
                      <StatusChip label={row.status} />
                    </TableCell>
                    <TableCell className="max-w-[320px] text-slate-300">{row.action}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <CardTitle>Top prioridades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topPriorities.map((row) => (
                <button
                  key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  className="w-full rounded-2xl border border-white/10 bg-[#09101F] p-4 text-left transition hover:border-white/20"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-white">{row.region}</p>
                    <StatusChip label={row.status} />
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                    {row.product} • {formatChannelLabel(row.channel)}
                  </p>
                  <p className="mt-3 text-sm text-slate-300">{row.action}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
            <CardTitle>Vigilancia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {watchlist.map((row) => (
                <button
                  key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  className="w-full rounded-2xl border border-white/10 bg-[#09101F] p-4 text-left transition hover:border-white/20"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-white">{row.region}</p>
                    <StatusChip label={row.status} />
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">{row.product}</p>
                  <p className="mt-3 text-sm text-slate-300">{row.action}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <DetailPanel
        open={selected !== null}
        onClose={() => setSelectedId(null)}
        title={selected?.title ?? "Oportunidad"}
        subtitle={selected ? `${selected.region} • ${selected.product} • ${formatChannelLabel(selected.channel)}` : ""}
      >
        {selected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Score" value={`${selected.score}`} />
              <Metric label="Confianza" value={`${selected.confidence}%`} />
              <Metric label="Potencial de ingresos" value={selected.revenuePotential} />
              <Metric label="Potencial de margen" value={`${selected.marginPotential}`} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Por qué importa</p>
              <p className="mt-2 text-sm text-slate-200">{selected.description}</p>
            </div>
            <div className="space-y-3">
              {selected.rationale.map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Señal {index + 1}</p>
                  <p className="mt-2 text-sm text-slate-200">{item}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Recomendación ejecutiva</p>
              <p className="mt-2 text-sm text-slate-200">{selected.action}</p>
            </div>
          </div>
        ) : null}
      </DetailPanel>
    </div>
  );
}

function MetricCard({
  title,
  value,
  detail,
  icon: Icon
}: {
  title: string;
  value: string;
  detail: string;
  icon: typeof Sparkles;
}) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
          <Icon className="h-4 w-4" />
          {title}
        </div>
        <p className="font-display text-3xl text-white">{value}</p>
        <p className="text-sm text-slate-400">{detail}</p>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg text-white">{value}</p>
    </div>
  );
}
