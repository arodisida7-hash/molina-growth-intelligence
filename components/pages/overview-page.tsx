"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ArrowUpRight, BellRing, ChartColumnIncreasing, DatabaseZap, Search, Sparkles } from "lucide-react";

import { DetailPanel } from "@/components/common/detail-panel";
import { ImpactStat } from "@/components/common/impact-stat";
import { MiniBar } from "@/components/common/mini-bar";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { SourceChip } from "@/components/common/source-chip";
import { StatusChip } from "@/components/common/status-chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardData } from "@/lib/mock-data";
import { formatChannelLabel, formatCompactCurrency, formatPercent } from "@/lib/utils";

const channelColors = ["#5AD7C4", "#5E8BFF", "#F8B84E", "#F27EA9", "#93A6FF"];

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
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(dashboardData.opportunities[0]?.id ?? null);

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

  const selectedOpportunity = opportunityRows.find((row) => row.id === selectedOpportunityId) ?? filteredRows[0] ?? opportunityRows[0];
  const topPriorities = filteredRows.filter((row) => row.status === "Alta prioridad").slice(0, 3);
  const watchlist = dashboardData.alerts.slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Executive Overview"
        description="Prioridades, impacto y contexto en una sola vista."
        aside={
          <div className="flex flex-wrap gap-2">
            {["CRM", "SAP", "BI"].map((item) => (
              <div key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
                {item}
              </div>
            ))}
          </div>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent">Start here</p>
                <CardTitle className="mt-2 text-3xl">Top Commercial Opportunities</CardTitle>
              </div>
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
          <CardContent className="grid gap-3 xl:grid-cols-3">
            {topPriorities.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedOpportunityId(item.id)}
                className="rounded-3xl border border-white/10 bg-[#09101F] p-5 text-left transition hover:-translate-y-1 hover:border-white/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">{item.region}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{item.product}</p>
                  </div>
                  <StatusChip label={item.status} />
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{item.channel}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xl text-white">{item.opportunityScore}</span>
                      <ArrowUpRight className="h-4 w-4 text-emerald-300" />
                    </div>
                    <MiniBar value={item.opportunityScore} className="mt-2" />
                  </div>
                  <p className="text-sm text-slate-300">{item.action}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <CardTitle>Estimated Business Impact</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <button onClick={() => setSelectedKpi("revenue")} className="text-left">
                <ImpactStat value={dashboardData.impactPotential.salesLift} label="Revenue uplift" />
              </button>
              <button onClick={() => setSelectedKpi("margin")} className="text-left">
                <ImpactStat value={dashboardData.impactPotential.marginLift} label="Margin optimization" />
              </button>
              <button onClick={() => setSelectedKpi("marketing")} className="text-left">
                <ImpactStat value={dashboardData.impactPotential.marketingLift} label="Marketing efficiency" />
              </button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>Revenue Trend</CardTitle>
              <Search className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="h-[190px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData.months} margin={{ left: 0, right: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="month" stroke="#8E9AB7" tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#8E9AB7"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${Math.round(value / 1000000)}M`}
                    />
                    <Tooltip
                      contentStyle={{ background: "#09101f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }}
                      formatter={(value) => [formatCompactCurrency(Number(value)), "Revenue"]}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#5AD7C4" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Revenue YTD" value={formatCompactCurrency(dashboardData.kpis.revenueYtd)} delta={dashboardData.kpis.growth} onClick={() => setSelectedKpi("revenue")} />
        <KpiCard title="Gross Margin" value={formatPercent(dashboardData.kpis.grossMargin)} delta={0.8} onClick={() => setSelectedKpi("margin")} />
        <KpiCard title="Growth" value={formatPercent(dashboardData.kpis.growth)} delta={2.4} onClick={() => setSelectedKpi("growth")} />
        <KpiCard title="Marketing Index" value={`${dashboardData.kpis.marketingEfficiency}`} delta={4.1} onClick={() => setSelectedKpi("marketing")} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Opportunity Table</CardTitle>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{filteredRows.length} rows</p>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto scroll-clean">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Margen</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.id} className="cursor-pointer" onClick={() => setSelectedOpportunityId(row.id)}>
                    <TableCell className="font-medium text-white">{row.region}</TableCell>
                    <TableCell>{row.product}</TableCell>
                    <TableCell>{row.channel}</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <span>{row.opportunityScore}</span>
                        <MiniBar value={row.opportunityScore} tone={row.status === "Watchlist" ? "rose" : "accent"} />
                      </div>
                    </TableCell>
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
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {dashboardData.connectedSources.map((source) => (
              <SourceChip key={source.name} name={source.name} category={source.category} />
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle>Commercial Context</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dashboardData.channelMix} innerRadius={54} outerRadius={78} paddingAngle={4} dataKey="value">
                    {dashboardData.channelMix.map((item, index) => (
                      <Cell key={item.channel} fill={channelColors[index % channelColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#09101f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }}
                    formatter={(value) => [`${value}%`, "Mix"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.products.slice(0, 5)}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="family" stroke="#8E9AB7" tickLine={false} axisLine={false} angle={-18} height={64} textAnchor="end" />
                  <YAxis stroke="#8E9AB7" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#09101f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }}
                    formatter={(value) => [formatPercent(Number(value)), "Margen"]}
                  />
                  <Bar dataKey="grossMargin" radius={[10, 10, 0, 0]} fill="#5AD7C4" />
                </BarChart>
              </ResponsiveContainer>
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

      <DetailPanel
        open={Boolean(selectedOpportunity)}
        onClose={() => setSelectedOpportunityId(null)}
        title={selectedOpportunity?.product ?? "Opportunity"}
        subtitle={selectedOpportunity ? `${selectedOpportunity.region} • ${selectedOpportunity.channel}` : ""}
      >
        {selectedOpportunity ? (
          <div className="space-y-4">
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
            <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Accion</p>
              <p className="mt-2 text-sm text-slate-200">{selectedOpportunity.action}</p>
            </div>
            <div className="space-y-3">
              {selectedOpportunity.rationale.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </DetailPanel>
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
