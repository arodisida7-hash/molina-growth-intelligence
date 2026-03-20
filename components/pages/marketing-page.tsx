"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Megaphone, Target, TrendingUp, TriangleAlert } from "lucide-react";

import { DetailPanel } from "@/components/common/detail-panel";
import { MiniBar } from "@/components/common/mini-bar";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusChip } from "@/components/common/status-chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardData } from "@/lib/mock-data";
import { CampaignMetric } from "@/lib/types";
import { formatChannelLabel, formatCompactCurrency } from "@/lib/utils";

const campaignRegion: Record<string, string> = {
  "cmp-recetas": "Querétaro",
  "cmp-estacional": "CDMX",
  "cmp-premium": "Monterrey",
  "cmp-producto": "Guadalajara",
  "cmp-b2b": "Cancún"
};

type CampaignFilter = "Todas" | "Escalar" | "Vigilancia";
type SortKey = "spend" | "cac" | "roas";

type CampaignRow = CampaignMetric & {
  region: string;
  status: "Escalar" | "Vigilancia";
  impact: string;
};

function getCampaignStatus(roas: number, cac: number): CampaignRow["status"] {
  return roas >= 5 && cac < 220 ? "Escalar" : "Vigilancia";
}

export function MarketingIntelligencePage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CampaignFilter>("Todas");
  const [sortKey, setSortKey] = useState<SortKey>("roas");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = useMemo<CampaignRow[]>(
    () =>
      dashboardData.campaigns.map((campaign) => ({
        ...campaign,
        region: campaignRegion[campaign.id] ?? "CDMX",
        status: getCampaignStatus(campaign.roas, campaign.cac),
        impact: campaign.roas >= 5 ? "+$2.1M - +$3.4M" : "-$0.8M - -$0.3M"
      })),
    []
  );

  const filteredRows = useMemo(() => {
    const value = query.trim().toLowerCase();

    return [...rows]
      .filter((row) => {
        const matchesQuery =
          !value ||
          `${row.name} ${row.channel} ${row.region} ${row.type} ${row.creativeTheme}`.toLowerCase().includes(value);
        const matchesFilter = filter === "Todas" || row.status === filter;
        return matchesQuery && matchesFilter;
      })
      .sort((left, right) => Number(right[sortKey]) - Number(left[sortKey]));
  }, [filter, query, rows, sortKey]);

  const selected = selectedId ? rows.find((row) => row.id === selectedId) ?? null : null;
  const topCampaign = [...filteredRows].sort((left, right) => right.roas - left.roas)[0];
  const topRegion = [...filteredRows].sort((left, right) => right.attributedRevenue - left.attributedRevenue)[0];
  const channelSummary = useMemo(() => {
    const sourceRows = filteredRows.length > 0 ? filteredRows : rows;
    const byChannel = sourceRows.reduce<Record<string, { spend: number; revenue: number }>>((acc, row) => {
      acc[row.channel] = acc[row.channel] ?? { spend: 0, revenue: 0 };
      acc[row.channel].spend += row.spend;
      acc[row.channel].revenue += row.attributedRevenue;
      return acc;
    }, {});

    return Object.entries(byChannel)
      .map(([channel, values]) => ({
        channel: formatChannelLabel(channel),
        spend: values.spend,
        roas: Number((values.revenue / values.spend).toFixed(1))
      }))
      .sort((left, right) => right.roas - left.roas);
  }, [filteredRows, rows]);

  const spendByChannel = channelSummary.map((item) => ({ canal: item.channel, inversion: item.spend }));
  const roasByChannel = channelSummary.map((item) => ({ canal: item.channel, roas: item.roas }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Marketing"
        title="Inteligencia de marketing"
        description="Qué campaña escalar, dónde ajustar inversión y qué retorno conviene proteger."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="ROAS promedio" value="5.1x" detail="Portafolio actual" icon={TrendingUp} />
        <MetricCard title="CAC promedio" value="$190" detail="Costo de adquisición" icon={Megaphone} />
        <MetricCard
          title="Campañas listas para escalar"
          value={`${rows.filter((row) => row.status === "Escalar").length}`}
          detail="Con retorno y costo saludables"
          icon={Target}
        />
        <MetricCard
          title="Campañas en watchlist"
          value={`${rows.filter((row) => row.status === "Vigilancia").length}`}
          detail="Con ajuste recomendado"
          icon={TriangleAlert}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <InsightCard
          title="Canal más eficiente"
          value={channelSummary[0]?.channel ?? "Sin dato"}
          detail={`${channelSummary[0]?.roas ?? 0}x de ROAS promedio`}
        />
        <InsightCard title="Región con mejor conversión" value={topRegion?.region ?? "Sin dato"} detail={topRegion?.name ?? "Sin campaña líder"} />
        <InsightCard title="Campaña con mejor retorno" value={topCampaign?.name ?? "Sin dato"} detail={`${topCampaign?.roas ?? 0}x de ROAS`} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle>Inversión por canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendByChannel} layout="vertical" margin={{ top: 8, right: 12, left: 16, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
                  <XAxis type="number" stroke="#8E9AB7" tickLine={false} axisLine={false} tickFormatter={(value) => `${Math.round(Number(value) / 1000000)}M`} />
                  <YAxis type="category" dataKey="canal" width={120} stroke="#8E9AB7" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#09101f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }}
                    formatter={(value) => [formatCompactCurrency(Number(value)), "Inversión"]}
                  />
                  <Bar dataKey="inversion" fill="#5AD7C4" radius={[0, 10, 10, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle>ROAS por canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roasByChannel} layout="vertical" margin={{ top: 8, right: 12, left: 16, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
                  <XAxis type="number" stroke="#8E9AB7" tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="canal" width={120} stroke="#8E9AB7" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#09101f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }}
                    formatter={(value) => [`${value}x`, "ROAS"]}
                  />
                  <Bar dataKey="roas" fill="#5E8BFF" radius={[0, 10, 10, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="gap-4 border-b border-white/10 pb-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <CardTitle>Tabla de campañas</CardTitle>
              <div className="flex flex-wrap gap-2">
                {["Todas", "Escalar", "Vigilancia"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFilter(option as CampaignFilter)}
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
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <SearchInput value={query} onChange={setQuery} placeholder="Buscar campaña, canal o región..." className="xl:max-w-[440px]" />
              <div className="flex flex-wrap gap-2">
                {[
                  ["roas", "Ordenar por ROAS"],
                  ["cac", "Ordenar por CAC"],
                  ["spend", "Ordenar por inversión"]
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSortKey(key as SortKey)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition ${
                      sortKey === key
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto scroll-clean pt-6">
            {filteredRows.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-[#09101F] px-5 py-10 text-center text-sm text-slate-400">
                No hay campañas para el criterio buscado.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaña</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Región</TableHead>
                    <TableHead>Inversión</TableHead>
                    <TableHead>CAC</TableHead>
                    <TableHead>ROAS</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acción sugerida</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((row) => (
                    <TableRow key={row.id} className="cursor-pointer" onClick={() => setSelectedId(row.id)}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{row.name}</p>
                          <p className="text-xs text-slate-500">{row.type}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatChannelLabel(row.channel)}</TableCell>
                      <TableCell>{row.region}</TableCell>
                      <TableCell>{formatCompactCurrency(row.spend)}</TableCell>
                      <TableCell>{formatCompactCurrency(row.cac)}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <span>{row.roas}x</span>
                          <MiniBar value={row.roas * 18} tone={row.status === "Escalar" ? "accent" : "amber"} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusChip label={row.status} />
                      </TableCell>
                      <TableCell className="max-w-[320px] text-slate-300">{row.recommendation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      <DetailPanel
        open={selected !== null}
        onClose={() => setSelectedId(null)}
        title={selected?.name ?? "Campaña"}
        subtitle={selected ? `${selected.region} • ${formatChannelLabel(selected.channel)}` : ""}
      >
        {selected ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Resumen ejecutivo</p>
              <p className="mt-2 text-sm text-slate-200">{selected.recommendation}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Objetivo" value={selected.type} />
              <Metric label="Región" value={selected.region} />
              <Metric label="CAC" value={formatCompactCurrency(selected.cac)} />
              <Metric label="ROAS" value={`${selected.roas}x`} />
              <Metric label="Inversión" value={formatCompactCurrency(selected.spend)} />
              <Metric label="Impacto estimado" value={selected.impact} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Razón de la recomendación</p>
              <p className="mt-2 text-sm text-slate-200">
                {selected.creativeTheme} muestra {selected.engagement}/100 en engagement y una lectura comercial consistente con {selected.status.toLowerCase()}.
              </p>
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
  icon: typeof Megaphone;
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

function InsightCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardContent className="space-y-2 p-5">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{title}</p>
        <p className="text-xl text-white">{value}</p>
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
