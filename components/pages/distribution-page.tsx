"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis
} from "recharts";
import { AlertTriangle, Radar, Truck, type LucideIcon } from "lucide-react";

import { DetailPanel } from "@/components/common/detail-panel";
import { MiniBar } from "@/components/common/mini-bar";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusChip } from "@/components/common/status-chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardData } from "@/lib/mock-data";
import { formatChannelLabel } from "@/lib/utils";

type CoveragePriority = "Todos" | "Expandir" | "Defender" | "Riesgo" | "Optimizar";

type CoverageRow = {
  region: string;
  distributor: string;
  coverage: number;
  demand: number;
  penetration: number;
  stockRisk: number;
  priority: "Expandir" | "Defender" | "Riesgo" | "Optimizar";
  recommendation: string;
  channel: string;
  serviceLevel: number;
};

function getPriority(segment: string): CoverageRow["priority"] {
  if (segment === "Alto potencial / Baja penetracion") return "Expandir";
  if (segment === "Fuerte / Defender") return "Defender";
  if (segment === "En riesgo / Presion marginal") return "Riesgo";
  return "Optimizar";
}

export function DistributionIntelligencePage() {
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<CoveragePriority>("Todos");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const rows = useMemo<CoverageRow[]>(() => {
    return dashboardData.regions.map((region) => {
      const distributor = dashboardData.distributors.find((item) => item.region === region.region);
      return {
        region: region.region,
        distributor: distributor?.name ?? "Cobertura indirecta",
        coverage: distributor?.coverage ?? Math.min(86, region.penetrationIndex + 18),
        demand: region.demandIndex,
        penetration: region.penetrationIndex,
        stockRisk: region.stockRisk,
        priority: getPriority(region.segment),
        recommendation: region.recommendation,
        channel: formatChannelLabel(region.dominantChannel),
        serviceLevel: distributor?.serviceLevel ?? region.distributorHealth
      };
    });
  }, []);

  const filteredRows = useMemo(() => {
    const value = query.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesQuery =
        !value ||
        `${row.region} ${row.distributor} ${row.channel} ${row.recommendation}`.toLowerCase().includes(value);
      const matchesPriority = priority === "Todos" || row.priority === priority;
      return matchesQuery && matchesPriority;
    });
  }, [priority, query, rows]);

  const selected = rows.find((row) => row.region === selectedRegion) ?? null;
  const topPriorities = rows.filter((row) => row.priority === "Expandir" || row.priority === "Defender").slice(0, 4);
  const watchlist = rows.filter((row) => row.priority === "Riesgo" || row.stockRisk >= 28).slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Distribution"
        title="Distribution Coverage Table"
        description="Localiza cobertura, demanda y riesgo por region con detalle bajo demanda."
      />

      <section className="dashboard-grid">
        <div className="col-span-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MiniMetric title="Expandir" value="4" detail="Plazas con oportunidad" />
        <MiniMetric title="Defender" value="2" detail="Cobertura fuerte" />
        <MiniMetric title="Riesgo stock" value="3" detail="Seguimiento semanal" />
        <MiniMetric title="Service level" value="85" detail="Promedio operativo" />
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="col-span-12 xl:col-span-8">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <CardTitle>Distribution Coverage Table</CardTitle>
              <div className="flex flex-wrap gap-2">
                {["Todos", "Expandir", "Defender", "Riesgo", "Optimizar"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setPriority(option as CoveragePriority)}
                    className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition ${
                      priority === option
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <SearchInput value={query} onChange={setQuery} placeholder="Buscar region, distribuidor o cobertura..." />
          </CardHeader>
          <CardContent className="overflow-x-auto scroll-clean">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead>Cobertura</TableHead>
                  <TableHead>Demanda</TableHead>
                  <TableHead>Penetracion</TableHead>
                  <TableHead>Riesgo stock</TableHead>
                  <TableHead>Prioridad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.region} className="cursor-pointer" onClick={() => setSelectedRegion(row.region)}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{row.region}</p>
                        <p className="text-xs text-slate-500">{row.distributor}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <span>{row.coverage}</span>
                        <MiniBar value={row.coverage} tone={row.priority === "Riesgo" ? "amber" : "accent"} />
                      </div>
                    </TableCell>
                    <TableCell>{row.demand}</TableCell>
                    <TableCell>{row.penetration}</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <span>{row.stockRisk}</span>
                        <MiniBar value={row.stockRisk * 2.3} tone={row.stockRisk >= 30 ? "rose" : "amber"} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusChip label={row.priority} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </div>

        <div className="col-span-12 grid gap-4 xl:col-span-4">
          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <CardTitle>Penetracion vs demanda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 12, bottom: 10, left: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                    <XAxis type="number" dataKey="penetrationIndex" name="Penetracion" stroke="#8E9AB7" domain={[30, 80]} />
                    <YAxis type="number" dataKey="demandIndex" name="Demanda" stroke="#8E9AB7" domain={[65, 100]} />
                    <ZAxis type="number" dataKey="opportunityScore" range={[120, 620]} />
                    <Tooltip contentStyle={{ background: "#09101f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }} />
                    <ReferenceLine x={58} stroke="rgba(255,255,255,0.18)" />
                    <ReferenceLine y={82} stroke="rgba(255,255,255,0.18)" />
                    <Scatter data={dashboardData.regions} fill="#5AD7C4" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <CompactList
            title="Top priorities"
            tone="accent"
            icon={Truck}
            rows={topPriorities}
            onSelect={setSelectedRegion}
          />
          <CompactList
            title="Watchlist"
            tone="rose"
            icon={AlertTriangle}
            rows={watchlist}
            onSelect={setSelectedRegion}
          />
        </div>
      </section>

      <DetailPanel
        open={selected !== null}
        onClose={() => setSelectedRegion(null)}
        title={selected?.region ?? "Region"}
        subtitle={selected ? `${selected.channel} • ${selected.distributor}` : ""}
      >
        {selected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Cobertura" value={`${selected.coverage}`} />
              <Metric label="Demanda" value={`${selected.demand}`} />
              <Metric label="Penetracion" value={`${selected.penetration}`} />
              <Metric label="Service level" value={`${selected.serviceLevel}`} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Prioridad</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <p className="text-sm text-white">{selected.priority}</p>
                <StatusChip label={selected.priority} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Accion sugerida</p>
              <p className="mt-2 text-sm text-slate-200">{selected.recommendation}</p>
            </div>
          </div>
        ) : null}
      </DetailPanel>
    </div>
  );
}

function MiniMetric({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardContent className="space-y-3 p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{title}</p>
        <p className="font-display text-3xl text-white">{value}</p>
        <p className="text-sm text-slate-400">{detail}</p>
      </CardContent>
    </Card>
  );
}

function CompactList({
  title,
  icon: Icon,
  tone,
  rows,
  onSelect
}: {
  title: string;
  icon: LucideIcon;
  tone: "accent" | "rose";
  rows: CoverageRow[];
  onSelect: (region: string) => void;
}) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <div className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] ${tone === "accent" ? "text-accent" : "text-rose-200"}`}>
          <Icon className="h-4 w-4" />
          {title}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row) => (
          <button
            key={row.region}
            onClick={() => onSelect(row.region)}
            className="w-full rounded-2xl border border-white/10 bg-[#09101F] p-4 text-left transition hover:border-white/20"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-white">{row.region}</p>
              <Radar className="h-4 w-4 text-slate-500" />
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
              {row.channel} • cobertura {row.coverage}
            </p>
            <p className="mt-3 text-sm text-slate-300">{row.recommendation}</p>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl text-white">{value}</p>
    </div>
  );
}
