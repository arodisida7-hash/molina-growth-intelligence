"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BriefcaseBusiness, CircleDollarSign, Gauge, MapPinned } from "lucide-react";

import { MiniBar } from "@/components/common/mini-bar";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusChip } from "@/components/common/status-chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardData } from "@/lib/mock-data";
import { formatChannelLabel, formatCompactCurrency, formatPercent } from "@/lib/utils";

type DecisionFilter = "Todas" | "Prioridad alta" | "Riesgo";

type DecisionRow = {
  id: string;
  region: string;
  product: string;
  channel: string;
  score: number;
  status: "Prioridad alta" | "Riesgo" | "Seguimiento";
  impact: string;
  action: string;
  why: string[];
};

function getDecisionStatus(score: number, type: "Oportunidad" | "Riesgo"): DecisionRow["status"] {
  if (type === "Riesgo") return "Riesgo";
  if (score >= 85) return "Prioridad alta";
  return "Seguimiento";
}

export function OverviewPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DecisionFilter>("Todas");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const decisionRows = useMemo<DecisionRow[]>(
    () =>
      dashboardData.opportunities
        .map((item) => ({
          id: item.id,
          region: item.region,
          product: item.product,
          channel: formatChannelLabel(item.channel),
          score: item.score,
          status: getDecisionStatus(item.score, item.type),
          impact: item.impactRange,
          action: item.action,
          why: item.rationale
        }))
        .sort((left, right) => right.score - left.score),
    []
  );

  const filteredRows = useMemo(() => {
    const value = query.trim().toLowerCase();

    return decisionRows.filter((row) => {
      const matchesQuery =
        !value ||
        `${row.region} ${row.product} ${row.channel} ${row.action}`.toLowerCase().includes(value);
      const matchesFilter = filter === "Todas" || row.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [decisionRows, filter, query]);

  const selected = selectedId ? filteredRows.find((row) => row.id === selectedId) ?? null : filteredRows[0] ?? null;
  const topDecisions = filteredRows.slice(0, 3);
  const riskRows = filteredRows.filter((row) => row.status === "Riesgo").slice(0, 3);
  const regionsReady = dashboardData.regions.filter((region) => region.opportunityScore >= 80).length;
  const revenueAtRisk = dashboardData.opportunities
    .filter((item) => item.type === "Riesgo")
    .map((item) => item.impactRange)
    .join(" • ");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Resumen ejecutivo"
        title="Decisiones comerciales prioritarias"
        description="Qué revisar esta semana, dónde actuar y qué impacto podría generar."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ExecutiveKpi
          icon={CircleDollarSign}
          title="Ingresos en oportunidad"
          value={dashboardData.impactPotential.salesLift}
          detail={revenueAtRisk ? `Riesgo visible: ${revenueAtRisk}` : "Sin riesgo crítico esta semana"}
        />
        <ExecutiveKpi
          icon={Gauge}
          title="Salud de margen"
          value={formatPercent(dashboardData.kpis.grossMargin)}
          detail="Promedio del portafolio"
        />
        <ExecutiveKpi
          icon={MapPinned}
          title="Regiones listas para escalar"
          value={`${regionsReady}`}
          detail="Con demanda y margen arriba del umbral"
        />
        <ExecutiveKpi
          icon={BriefcaseBusiness}
          title="Eficiencia de marketing"
          value={`${dashboardData.kpis.marketingEfficiency}`}
          detail="Índice comercial ponderado"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="gap-4 border-b border-white/10 pb-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <CardTitle className="text-2xl">Top decisiones esta semana</CardTitle>
                <p className="mt-1 text-sm text-slate-400">Tres frentes que dirección debería revisar primero.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Todas", "Prioridad alta", "Riesgo"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFilter(option as DecisionFilter)}
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
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Buscar región, producto, canal u oportunidad..."
              className="max-w-full"
            />
          </CardHeader>
          <CardContent className="grid gap-3 pt-6">
            {topDecisions.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-[#09101F] px-5 py-10 text-center text-sm text-slate-400">
                Sin coincidencias para la búsqueda actual.
              </div>
            ) : null}
            {topDecisions.map((row) => {
              const active = selected?.id === row.id;

              return (
                <button
                  key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  className={`rounded-3xl border p-5 text-left transition ${
                    active
                      ? "border-accent/30 bg-gradient-to-br from-[#0B1528] via-[#0A1021] to-[#10243B]"
                      : "border-white/10 bg-[#09101F] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-white">
                        {row.region} — {row.product}
                      </p>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{row.channel}</p>
                    </div>
                    <StatusChip label={row.status} />
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_120px_120px]">
                    <p className="text-sm leading-6 text-slate-300">{row.action}</p>
                    <DecisionMetric label="Impacto" value={row.impact} />
                    <DecisionMetric label="Score" value={`${row.score}`} />
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <CardTitle>Impacto potencial estimado</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <ImpactTile label="Mejora de ingresos" value={dashboardData.impactPotential.salesLift} />
              <ImpactTile label="Optimización de margen" value={dashboardData.impactPotential.marginLift} />
              <ImpactTile label="Ganancia de eficiencia" value={dashboardData.impactPotential.marketingLift} />
              <p className="text-xs text-slate-500">{dashboardData.impactPotential.note}</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <CardTitle>Fuentes conectadas</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {dashboardData.connectedSources.map((source) => (
                <div key={source.name} className="rounded-full border border-white/10 bg-[#09101F] px-3 py-2 text-xs uppercase tracking-[0.16em] text-slate-300">
                  {source.name}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="border-b border-white/10 pb-5">
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Tabla de oportunidades</CardTitle>
              <div className="rounded-full border border-white/10 bg-[#09101F] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-slate-400">
                {filteredRows.length} filas
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto scroll-clean pt-6">
            {filteredRows.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-[#09101F] px-5 py-10 text-center text-sm text-slate-400">
                No hay oportunidades que coincidan con la región o criterio buscado.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Región</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Impacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acción sugerida</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((row) => (
                    <TableRow key={row.id} className="cursor-pointer" onClick={() => setSelectedId(row.id)}>
                      <TableCell className="font-medium text-white">{row.region}</TableCell>
                      <TableCell>{row.product}</TableCell>
                      <TableCell>{row.channel}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <span>{row.score}</span>
                          <MiniBar value={row.score} tone={row.status === "Riesgo" ? "rose" : "accent"} />
                        </div>
                      </TableCell>
                      <TableCell>{row.impact}</TableCell>
                      <TableCell>
                        <StatusChip label={row.status} />
                      </TableCell>
                      <TableCell className="max-w-[340px] text-slate-300">{row.action}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="border-b border-white/10 pb-5">
            <CardTitle>Detalle ejecutivo</CardTitle>
            {selected ? <p className="text-sm text-slate-400">{selected.region} • {selected.product} • {selected.channel}</p> : null}
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {selected ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <DecisionMetric label="Score" value={`${selected.score}`} />
                  <DecisionMetric label="Impacto" value={selected.impact} />
                </div>
                <div className="rounded-3xl border border-accent/20 bg-accent/10 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-accent">Acción sugerida</p>
                  <p className="mt-3 text-sm leading-7 text-slate-100">{selected.action}</p>
                </div>
                <div className="space-y-3">
                  {selected.why.map((item, index) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-[#09101F] px-4 py-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Señal {index + 1}</p>
                      <p className="mt-2 text-sm text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-[#09101F] px-5 py-10 text-center text-sm text-slate-400">
                Ajusta la búsqueda o selecciona una fila para ver el detalle.
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle>Vigilancia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {riskRows.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-[#09101F] px-5 py-8 text-center text-sm text-slate-400">
                Sin riesgos visibles para los filtros actuales.
              </div>
            ) : null}
            {riskRows.map((row) => (
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

        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle>Tendencia de ingreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.months} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="month" stroke="#8E9AB7" tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#8E9AB7"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${Math.round(Number(value) / 1000000)}M`}
                  />
                  <Tooltip
                    contentStyle={{ background: "#09101f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }}
                    formatter={(value) => [formatCompactCurrency(Number(value)), "Ingresos"]}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#5AD7C4" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ExecutiveKpi({
  icon: Icon,
  title,
  value,
  detail
}: {
  icon: typeof CircleDollarSign;
  title: string;
  value: string;
  detail: string;
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

function ImpactTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#09101F] p-5">
      <p className="font-display text-3xl tracking-tight text-white">{value}</p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
    </div>
  );
}

function DecisionMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#09101F] px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg text-white">{value}</p>
    </div>
  );
}
