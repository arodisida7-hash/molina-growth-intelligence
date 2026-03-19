"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Megaphone, Radar, Target, TriangleAlert, type LucideIcon } from "lucide-react";

import { ChartCard } from "@/components/common/chart-card";
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

const spendByChannel = dashboardData.campaigns.reduce<Record<string, number>>((accumulator, campaign) => {
  accumulator[campaign.channel] = (accumulator[campaign.channel] ?? 0) + campaign.spend;
  return accumulator;
}, {});

const spendData = Object.entries(spendByChannel).map(([channel, spend]) => ({ channel, spend }));

const contentData = dashboardData.campaigns.map((campaign) => ({
  type: campaign.type,
  engagement: campaign.engagement,
  roas: campaign.roas * 15
}));

const regionByCampaign: Record<string, string> = {
  "cmp-recetas": "Queretaro",
  "cmp-estacional": "CDMX",
  "cmp-premium": "Monterrey",
  "cmp-producto": "Guadalajara",
  "cmp-b2b": "Cancun"
};

type CampaignStatus = "Todos" | "Escalar" | "Optimizar";

export function MarketingIntelligencePage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CampaignStatus>("Todos");
  const [selected, setSelected] = useState<CampaignMetric | null>(dashboardData.campaigns[0] ?? null);

  const rows = useMemo(() => {
    const value = query.trim().toLowerCase();

    return dashboardData.campaigns.filter((campaign) => {
      const label = campaign.roas >= 5 ? "Escalar" : "Optimizar";
      const region = regionByCampaign[campaign.id] ?? "CDMX";
      const matchesQuery =
        !value ||
        `${campaign.name} ${campaign.channel} ${campaign.type} ${region} ${campaign.creativeTheme}`.toLowerCase().includes(value);
      const matchesStatus = status === "Todos" || label === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const topImpact = [...dashboardData.campaigns].sort((left, right) => right.roas - left.roas).slice(0, 3);
  const watchlist = dashboardData.campaigns.filter((campaign) => campaign.roas < 5 || campaign.cac >= 210).slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Marketing"
        title="Marketing Performance Table"
        description="Busca campanas, filtra prioridad y abre detalle comercial en un clic."
      />

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <MiniMetric title="ROAS" value="5.1x" detail="Portafolio" />
        <MiniMetric title="CAC" value="$190" detail="Promedio" />
        <MiniMetric title="Highest impact" value="2" detail="Listas para escalar" />
        <MiniMetric title="Watchlist" value="2" detail="Ajuste recomendado" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <CardTitle>Marketing Performance Table</CardTitle>
              <div className="flex flex-wrap gap-2">
                {["Todos", "Escalar", "Optimizar"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setStatus(option as CampaignStatus)}
                    className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition ${
                      status === option
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <SearchInput value={query} onChange={setQuery} placeholder="Buscar campana, canal o region..." />
          </CardHeader>
          <CardContent className="overflow-x-auto scroll-clean">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campana</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>CAC</TableHead>
                  <TableHead>ROAS</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Insight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((campaign) => {
                  const state = campaign.roas >= 5 ? "Escalar" : "Optimizar";
                  return (
                    <TableRow key={campaign.id} className="cursor-pointer" onClick={() => setSelected(campaign)}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{campaign.name}</p>
                          <p className="text-xs text-slate-500">{campaign.type}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatChannelLabel(campaign.channel)}</TableCell>
                      <TableCell>{formatCompactCurrency(campaign.cac)}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <span>{campaign.roas}x</span>
                          <MiniBar value={campaign.roas * 18} tone={campaign.roas >= 5 ? "accent" : "amber"} />
                        </div>
                      </TableCell>
                      <TableCell>{regionByCampaign[campaign.id] ?? "CDMX"}</TableCell>
                      <TableCell>
                        <StatusChip label={state} />
                      </TableCell>
                      <TableCell className="max-w-[280px] text-slate-300">{campaign.recommendation}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <ChartCard title="Spend by channel" description="Allocation actual.">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="channel" stroke="#8E9AB7" tickLine={false} axisLine={false} />
                  <YAxis stroke="#8E9AB7" tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip
                    contentStyle={{ background: "#09101f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }}
                    formatter={(value) => [formatCompactCurrency(Number(value)), "Inversion"]}
                  />
                  <Bar dataKey="spend" fill="#5E8BFF" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Creative signal" description="Interaccion y retorno.">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contentData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="type" stroke="#8E9AB7" tickLine={false} axisLine={false} />
                  <YAxis stroke="#8E9AB7" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#09101f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }} />
                  <Bar dataKey="engagement" fill="#5AD7C4" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="roas" fill="#F8B84E" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <CompactList
            title="Highest impact"
            icon={Target}
            tone="accent"
            items={topImpact.map((campaign) => ({
              id: campaign.id,
              title: campaign.name,
              detail: `${regionByCampaign[campaign.id] ?? "CDMX"} • ${campaign.roas}x ROAS`,
              action: campaign.recommendation
            }))}
            onSelect={(id) => setSelected(dashboardData.campaigns.find((campaign) => campaign.id === id) ?? null)}
          />
          <CompactList
            title="Watchlist"
            icon={TriangleAlert}
            tone="amber"
            items={watchlist.map((campaign) => ({
              id: campaign.id,
              title: campaign.name,
              detail: `${formatCompactCurrency(campaign.cac)} CAC • ${regionByCampaign[campaign.id] ?? "CDMX"}`,
              action: campaign.recommendation
            }))}
            onSelect={(id) => setSelected(dashboardData.campaigns.find((campaign) => campaign.id === id) ?? null)}
          />
        </div>
      </section>

      <DetailPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name ?? "Campana"}
        subtitle={selected ? `${selected.type} • ${formatChannelLabel(selected.channel)}` : ""}
      >
        {selected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Metric label="ROAS" value={`${selected.roas}x`} />
              <Metric label="CAC" value={formatCompactCurrency(selected.cac)} />
              <Metric label="Revenue" value={formatCompactCurrency(selected.attributedRevenue)} />
              <Metric label="Region" value={regionByCampaign[selected.id] ?? "CDMX"} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Insight</p>
              <p className="mt-2 text-sm text-slate-200">{selected.recommendation}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Creative theme</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white">{selected.creativeTheme}</p>
                  <p className="text-xs text-slate-500">{selected.engagement}/100 engagement</p>
                </div>
                <StatusChip label={selected.roas >= 5 ? "Escalar" : "Optimizar"} />
              </div>
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
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
          <Megaphone className="h-4 w-4" />
          {title}
        </div>
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
  items,
  onSelect
}: {
  title: string;
  icon: LucideIcon;
  tone: "accent" | "amber";
  items: Array<{ id: string; title: string; detail: string; action: string }>;
  onSelect: (id: string) => void;
}) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <div className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] ${tone === "accent" ? "text-accent" : "text-amber-200"}`}>
          <Icon className="h-4 w-4" />
          {title}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="w-full rounded-2xl border border-white/10 bg-[#09101F] p-4 text-left transition hover:border-white/20"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-white">{item.title}</p>
              <Radar className="h-4 w-4 text-slate-500" />
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">{item.detail}</p>
            <p className="mt-3 text-sm text-slate-300">{item.action}</p>
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
