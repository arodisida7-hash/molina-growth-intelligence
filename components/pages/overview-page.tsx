"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, BellRing, ChartColumnIncreasing, DatabaseZap, Sparkles } from "lucide-react";

import { DetailPanel } from "@/components/common/detail-panel";
import { MiniBar } from "@/components/common/mini-bar";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusChip } from "@/components/common/status-chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardData } from "@/lib/mock-data";
import { formatChannelLabel, formatCompactCurrency, formatPercent } from "@/lib/utils";

type OpportunityRow = {
  id: string;
  region: string;
  product: string;
  channel: string;
  opportunityScore: number;
  marginPotential: number;
  status: string;
  action: string;
  impactRange: string;
  rationale: string[];
};

export function OverviewPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Todos" | "Alta prioridad" | "Watchlist">("Todos");
  const [selectedKpi, setSelectedKpi] = useState<null | "revenue" | "margin" | "marketing" | "growth">(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);

  const opportunityRows = useMemo<OpportunityRow[]>(() => {
    return dashboardData.opportunities.map((item) => {
      const region = dashboardData.regions.find((regionItem) => regionItem.region === item.region);
      const status = item.type === "Riesgo" ? "Watchlist" : item.score >= 85 ? "Alta prioridad" : "Seguimiento";

      return {
        id: item.id,
        region: item.region,
        product: item.product,
        channel: formatChannelLabel(item.channel),
        opportunityScore: item.score,
        marginPotential: region?.marginPotential ?? 0,
        status,
        action: item.action,
        impactRange: item.impactRange,
        rationale: item.rationale
      };
    });
  }, []);

  const filteredRows = useMemo(() => {
    const value = query.trim().toLowerCase();

    return opportunityRows.filter((row) => {
      const matchesQuery =
        !value ||
        `${row.region} ${row.product} ${row.channel} ${row.action}`.toLowerCase().includes(value);
      const matchesStatus = statusFilter === "Todos" || row.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [opportunityRows, query, statusFilter]);

  const topPriorities = filteredRows.filter((row) => row.status === "Alta prioridad").slice(0, 3);
  const selectedOpportunity =
    opportunityRows.find((row) => row.id === selectedOpportunityId) ?? topPriorities[0] ?? filteredRows[0] ?? opportunityRows[0];
  const watchlist = dashboardData.alerts.slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Executive Overview"
        description="Oportunidades priorizadas, impacto esperado y lectura comercial accionable."
      />

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="gap-4 border-b border-white/10 pb-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <CardTitle className="text-3xl">Top Commercial Opportunities</CardTitle>
              <div className="flex flex-wrap gap-2">
                {["Todos", "Alta prioridad", "Watchlist"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setStatusFilter(option as "Todos" | "Alta prioridad" | "Watchlist")}
                    className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition ${
                      statusFilter === option
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
              placeholder="Buscar producto, region, campana u oportunidad..."
              className="max-w-full"
            />
          </CardHeader>
          <CardContent className="grid gap-3 pt-6">
            {topPriorities.map((item) => {
              const active = selectedOpportunity.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedOpportunityId(item.id)}
                  className={`group relative overflow-hidden rounded-[28px] border p-5 text-left transition duration-300 ${
                    active
                      ? "border-accent/30 bg-gradient-to-br from-[#0B1528] via-[#0A1021] to-[#10243B] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                      : "border-white/10 bg-[#09101F] hover:-translate-y-1 hover:border-white/20"
                  }`}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-70" />
                  <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-medium text-white">{item.region}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{item.product}</p>
                        </div>
                        <div className="shrink-0">
                          <StatusChip label={item.status} />
                        </div>
                      </div>
                      <p className="clamp-2 text-sm leading-7 text-slate-300">{item.action}</p>
                      <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent">
                        Abrir decision canvas
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                      <MetricChip label="Canal" value={item.channel} />
                      <MetricChip label="Impacto" value={item.impactRange} />
                      <ScoreTile value={item.opportunityScore} />
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <DecisionCanvas selectedOpportunity={selectedOpportunity} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Revenue YTD" value={formatCompactCurrency(dashboardData.kpis.revenueYtd)} delta={dashboardData.kpis.growth} onClick={() => setSelectedKpi("revenue")} />
        <KpiCard title="Gross Margin" value={formatPercent(dashboardData.kpis.grossMargin)} delta={0.8} onClick={() => setSelectedKpi("margin")} />
        <KpiCard title="Growth" value={formatPercent(dashboardData.kpis.growth)} delta={2.4} onClick={() => setSelectedKpi("growth")} />
        <KpiCard title="Marketing Index" value={`${dashboardData.kpis.marketingEfficiency}`} delta={4.1} onClick={() => setSelectedKpi("marketing")} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="border-b border-white/10 pb-5">
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Opportunity Table</CardTitle>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{filteredRows.length} rows</p>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto scroll-clean pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Impacto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => {
                  const active = selectedOpportunity.id === row.id;

                  return (
                    <TableRow
                      key={row.id}
                      className={`cursor-pointer transition ${active ? "bg-accent/10" : ""}`}
                      onClick={() => setSelectedOpportunityId(row.id)}
                    >
                      <TableCell className="font-medium text-white">{row.region}</TableCell>
                      <TableCell>{row.product}</TableCell>
                      <TableCell>{row.channel}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <span>{row.opportunityScore}</span>
                          <MiniBar value={row.opportunityScore} tone={row.status === "Watchlist" ? "rose" : "accent"} />
                        </div>
                      </TableCell>
                      <TableCell>{row.impactRange}</TableCell>
                      <TableCell>
                        <StatusChip label={row.status} />
                      </TableCell>
                      <TableCell className="max-w-[320px] text-slate-300">{row.action}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <CardTitle>Estimated Business Impact</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <ImpactTile value={dashboardData.impactPotential.salesLift} label="Revenue uplift" detail="Expansión regional acelerada" />
              <ImpactTile value={dashboardData.impactPotential.marginLift} label="Margin optimization" detail="Mejor mezcla de portafolio" />
              <ImpactTile value={dashboardData.impactPotential.marketingLift} label="Marketing efficiency" detail="Inversión mejor reasignada" />
            </CardContent>
          </Card>

          <Card className="surface-highlight border-white/10 bg-white/[0.04]">
            <CardHeader>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
                <Sparkles className="h-4 w-4" />
                Weekly Brief
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <BriefItem label="Opportunity" value={dashboardData.executiveBrief.bullets[0]} />
              <BriefItem label="Margin" value={dashboardData.executiveBrief.bullets[2]} />
              <BriefItem label="Action" value={dashboardData.recommendedActions[0]} />
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-200">
                <BellRing className="h-4 w-4" />
                Watchlist
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {watchlist.map((item) => (
                <button
                  key={item.title}
                  onClick={() => setStatusFilter("Watchlist")}
                  className="w-full rounded-2xl border border-white/10 bg-[#09101F] p-4 text-left transition hover:border-white/20"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-white">{item.title}</p>
                    <StatusChip label={item.level} />
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <DatabaseZap className="h-4 w-4" />
              Connected enterprise data sources
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {dashboardData.connectedSources.map((source) => (
              <CompactSourceRow key={source.name} name={source.name} category={source.category} />
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle>Commercial Context</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Channel mix</p>
              {dashboardData.channelMix.map((item) => (
                <MetricListRow key={item.channel} label={formatChannelLabel(item.channel)} value={`${item.value}%`} barValue={item.value} />
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Margin by family</p>
              {dashboardData.products.slice(0, 5).map((item) => (
                <MetricListRow
                  key={item.family}
                  label={item.family}
                  value={formatPercent(item.grossMargin)}
                  barValue={Math.round(item.grossMargin)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <DetailPanel
        open={selectedKpi !== null}
        onClose={() => setSelectedKpi(null)}
        title={
          selectedKpi === "revenue"
            ? "Revenue"
            : selectedKpi === "margin"
              ? "Margin"
              : selectedKpi === "marketing"
                ? "Marketing"
                : "Growth"
        }
        subtitle="Drivers ejecutivos"
      >
        <div className="space-y-4">
          <PanelMetric label="Revenue YTD" value={formatCompactCurrency(dashboardData.kpis.revenueYtd)} />
          <PanelMetric label="Growth" value={formatPercent(dashboardData.kpis.growth)} />
          <PanelMetric label="Gross Margin" value={formatPercent(dashboardData.kpis.grossMargin)} />
          <PanelMetric label="Marketing Index" value={`${dashboardData.kpis.marketingEfficiency}`} />
          <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Quick read</p>
            <p className="mt-2 text-sm text-slate-300">
              {selectedKpi === "revenue" && "Crecimiento concentrado en lineas naturales y regiones con baja penetracion."}
              {selectedKpi === "margin" && "La presion de margen se concentra en familias defensivas."}
              {selectedKpi === "marketing" && "Recetas y premium concentran el mejor retorno."}
              {selectedKpi === "growth" && "Monterrey, Queretaro y Cancun lideran el retorno incremental."}
            </p>
          </div>
        </div>
      </DetailPanel>
    </div>
  );
}

function CompactSourceRow({ name, category }: { name: string; category?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#09101F] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-white">{name}</p>
      {category ? <p className="mt-2 text-sm text-slate-400">{category}</p> : null}
    </div>
  );
}

function MetricListRow({ label, value, barValue }: { label: string; value: string; barValue: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#09101F] px-4 py-3">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="text-white">{value}</span>
      </div>
      <MiniBar value={barValue} className="mt-3" />
    </div>
  );
}

function DecisionCanvas({ selectedOpportunity }: { selectedOpportunity: OpportunityRow }) {
  return (
    <Card className="surface-highlight border-white/10 bg-gradient-to-br from-[#0B1528] via-[#0A1021] to-[#10243B]">
      <CardHeader className="border-b border-white/10 pb-5">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
          <ChartColumnIncreasing className="h-4 w-4" />
          Decision canvas
        </div>
        <CardTitle className="text-3xl text-white">{selectedOpportunity.region}</CardTitle>
        <p className="text-sm text-slate-400">
          {selectedOpportunity.product} • {selectedOpportunity.channel}
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3">
          <PanelMetric label="Score" value={`${selectedOpportunity.opportunityScore}`} />
          <PanelMetric label="Margen" value={`${selectedOpportunity.marginPotential}`} />
          <PanelMetric label="Impacto" value={selectedOpportunity.impactRange} />
          <div className="rounded-2xl border border-white/10 bg-[#09101F] px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Estado</p>
            <div className="mt-3">
              <StatusChip label={selectedOpportunity.status} />
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-accent/20 bg-accent/10 p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Next move</p>
          <p className="mt-3 text-base leading-7 text-slate-100">{selectedOpportunity.action}</p>
        </div>
        <div className="space-y-3">
          {selectedOpportunity.rationale.map((item, index) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Signal {index + 1}</p>
              <p className="mt-2 text-sm text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ImpactTile({ value, label, detail }: { value: string; label: string; detail: string }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#09101F] p-5">
      <p className="font-display text-4xl tracking-tight text-white">{value}</p>
      <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-3 text-sm text-slate-400">{detail}</p>
    </div>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm text-white">{value}</p>
    </div>
  );
}

function ScoreTile({ value }: { value: number }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Score</p>
        <div className="inline-flex items-center gap-1 text-sm text-white">
          {value}
          <ArrowUpRight className="h-4 w-4 text-emerald-300" />
        </div>
      </div>
      <MiniBar value={value} className="mt-3" />
    </div>
  );
}

function BriefItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#09101F] px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-accent">{label}</p>
      <p className="mt-2 text-sm text-slate-200">{value}</p>
    </div>
  );
}

function KpiCard({
  title,
  value,
  delta,
  onClick
}: {
  title: string;
  value: string;
  delta: number;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="text-left">
      <Card className="border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-white/20">
        <CardContent className="space-y-3 p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{title}</p>
          <div className="flex items-center justify-between gap-4">
            <p className="font-display text-3xl tracking-tight text-white">{value}</p>
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
              <ArrowUpRight className="h-4 w-4" />
              {delta.toFixed(1)}
            </div>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}

function PanelMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#09101F] px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl text-white">{value}</p>
    </div>
  );
}
