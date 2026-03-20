"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ShieldCheck, Truck, Waypoints } from "lucide-react";

import { DetailPanel } from "@/components/common/detail-panel";
import { MiniBar } from "@/components/common/mini-bar";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusChip } from "@/components/common/status-chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardData } from "@/lib/mock-data";
import { formatChannelLabel } from "@/lib/utils";

type CoverageFilter = "Todas" | "Expandir" | "Defender" | "Riesgo" | "Optimizar";

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
  const [filter, setFilter] = useState<CoverageFilter>("Todas");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const rows = useMemo<CoverageRow[]>(
    () =>
      dashboardData.regions.map((region) => {
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
      }),
    []
  );

  const filteredRows = useMemo(() => {
    const value = query.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesQuery =
        !value || `${row.region} ${row.distributor} ${row.channel} ${row.recommendation}`.toLowerCase().includes(value);
      const matchesFilter = filter === "Todas" || row.priority === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, query, rows]);

  const selected = selectedRegion ? rows.find((row) => row.region === selectedRegion) ?? null : null;
  const avgCoverage = Math.round(rows.reduce((sum, row) => sum + row.coverage, 0) / rows.length);
  const avgService = Math.round(rows.reduce((sum, row) => sum + row.serviceLevel, 0) / rows.length);
  const topPriorities = rows.filter((row) => row.priority === "Expandir" || row.priority === "Defender").slice(0, 4);
  const watchlist = rows.filter((row) => row.priority === "Riesgo").slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Distribución"
        title="Cobertura comercial"
        description="Dónde ampliar cobertura, qué plaza defender y qué riesgo operativo atender primero."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Regiones listas para expandir" value={`${rows.filter((row) => row.priority === "Expandir").length}`} detail="Con demanda superior a cobertura" icon={Waypoints} />
        <MetricCard title="Regiones para defender" value={`${rows.filter((row) => row.priority === "Defender").length}`} detail="Con tracción saludable" icon={ShieldCheck} />
        <MetricCard title="Cobertura promedio" value={`${avgCoverage}`} detail="Índice promedio" icon={Truck} />
        <MetricCard title="Riesgo de stock" value={`${watchlist.length}`} detail="Plazas con atención inmediata" icon={AlertTriangle} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="gap-4 border-b border-white/10 pb-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <CardTitle>Tabla de cobertura</CardTitle>
              <div className="flex flex-wrap gap-2">
                {["Todas", "Expandir", "Defender", "Riesgo", "Optimizar"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFilter(option as CoverageFilter)}
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
            <SearchInput value={query} onChange={setQuery} placeholder="Buscar región, distribuidor o canal..." className="xl:max-w-[420px]" />
          </CardHeader>
          <CardContent className="overflow-x-auto scroll-clean pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Región</TableHead>
                  <TableHead>Distribuidor</TableHead>
                  <TableHead>Cobertura</TableHead>
                  <TableHead>Demanda</TableHead>
                  <TableHead>Penetración</TableHead>
                  <TableHead>Riesgo stock</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.region} className="cursor-pointer" onClick={() => setSelectedRegion(row.region)}>
                    <TableCell className="font-medium text-white">{row.region}</TableCell>
                    <TableCell>{row.distributor}</TableCell>
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
                        <MiniBar value={row.stockRisk * 2.2} tone={row.stockRisk >= 30 ? "rose" : "amber"} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusChip label={row.priority} />
                    </TableCell>
                    <TableCell className="max-w-[320px] text-slate-300">{row.recommendation}</TableCell>
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
                  key={row.region}
                  onClick={() => setSelectedRegion(row.region)}
                  className="w-full rounded-2xl border border-white/10 bg-[#09101F] p-4 text-left transition hover:border-white/20"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-white">{row.region}</p>
                    <StatusChip label={row.priority} />
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">{row.channel}</p>
                  <p className="mt-3 text-sm text-slate-300">{row.recommendation}</p>
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
                  key={row.region}
                  onClick={() => setSelectedRegion(row.region)}
                  className="w-full rounded-2xl border border-white/10 bg-[#09101F] p-4 text-left transition hover:border-white/20"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-white">{row.region}</p>
                    <StatusChip label={row.priority} />
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">Riesgo stock {row.stockRisk}</p>
                  <p className="mt-3 text-sm text-slate-300">{row.recommendation}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <CardTitle>Segmentos</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <SegmentRow label="Expandir" value={rows.filter((row) => row.priority === "Expandir").length} />
              <SegmentRow label="Defender" value={rows.filter((row) => row.priority === "Defender").length} />
              <SegmentRow label="Riesgo" value={rows.filter((row) => row.priority === "Riesgo").length} />
              <SegmentRow label="Optimizar" value={rows.filter((row) => row.priority === "Optimizar").length} />
              <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Nivel de servicio promedio</p>
                <p className="mt-2 text-lg text-white">{avgService}/100</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <DetailPanel
        open={selected !== null}
        onClose={() => setSelectedRegion(null)}
        title={selected?.region ?? "Región"}
        subtitle={selected ? `${selected.channel} • ${selected.distributor}` : ""}
      >
        {selected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Cobertura" value={`${selected.coverage}`} />
              <Metric label="Demanda" value={`${selected.demand}`} />
              <Metric label="Penetración" value={`${selected.penetration}`} />
              <Metric label="Nivel de servicio" value={`${selected.serviceLevel}`} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Prioridad</p>
              <div className="mt-3">
                <StatusChip label={selected.priority} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Acción sugerida</p>
              <p className="mt-2 text-sm text-slate-200">{selected.recommendation}</p>
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
  icon: typeof Truck;
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

function SegmentRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#09101F] px-4 py-3">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}
