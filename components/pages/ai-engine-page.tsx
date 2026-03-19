"use client";

import { useMemo, useState } from "react";
import { ListFilter, Radar, WandSparkles } from "lucide-react";

import { DetailPanel } from "@/components/common/detail-panel";
import { MiniBar } from "@/components/common/mini-bar";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusChip } from "@/components/common/status-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardData } from "@/lib/mock-data";
import { generateActionPlan } from "@/lib/report";
import { OpportunityCard } from "@/lib/types";
import { formatChannelLabel } from "@/lib/utils";

type SignalFilter = "Todos" | "Oportunidad" | "Riesgo";

export function AiOpportunityEnginePage() {
  const [query, setQuery] = useState("");
  const [signalFilter, setSignalFilter] = useState<SignalFilter>("Todos");
  const [selected, setSelected] = useState<OpportunityCard | null>(dashboardData.opportunities[0] ?? null);
  const [plan, setPlan] = useState<string[] | null>(null);

  const rows = useMemo(() => {
    const value = query.trim().toLowerCase();

    return dashboardData.opportunities.filter((opportunity) => {
      const matchesQuery =
        !value ||
        `${opportunity.title} ${opportunity.region} ${opportunity.product} ${opportunity.channel}`.toLowerCase().includes(value);
      const matchesType = signalFilter === "Todos" || opportunity.type === signalFilter;
      return matchesQuery && matchesType;
    });
  }, [query, signalFilter]);

  const highestImpact = [...dashboardData.opportunities]
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
  const watchlist = dashboardData.opportunities.filter((opportunity) => opportunity.type === "Riesgo").slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Opportunity Engine"
        title="Opportunity Table"
        description="Prioriza oportunidades y riesgos por region, producto y canal con detalle bajo demanda."
      />

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <MiniMetric title="Open signals" value="6" detail="Lectura activa" />
        <MiniMetric title="High confidence" value="3" detail="Listas para actuar" />
        <MiniMetric title="Watchlist" value="2" detail="Riesgos relevantes" />
        <MiniMetric title="Impact range" value="+9%" detail="Escenario superior" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <CardTitle>Opportunity Table</CardTitle>
              <div className="flex flex-wrap gap-2">
                {["Todos", "Oportunidad", "Riesgo"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setSignalFilter(option as SignalFilter)}
                    className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition ${
                      signalFilter === option
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <SearchInput value={query} onChange={setQuery} placeholder="Buscar producto, region, canal u oportunidad..." />
          </CardHeader>
          <CardContent className="overflow-x-auto scroll-clean">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Opportunity Score</TableHead>
                  <TableHead>Margen Potencial</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Accion sugerida</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((opportunity) => {
                  const region = dashboardData.regions.find((item) => item.region === opportunity.region);
                  const status = opportunity.type === "Riesgo" ? "Watchlist" : opportunity.score >= 85 ? "Alta prioridad" : "Seguimiento";
                  return (
                    <TableRow key={opportunity.id} className="cursor-pointer" onClick={() => setSelected(opportunity)}>
                      <TableCell className="font-medium text-white">{opportunity.region}</TableCell>
                      <TableCell>{opportunity.product}</TableCell>
                      <TableCell>{formatChannelLabel(opportunity.channel)}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <span>{opportunity.score}</span>
                          <MiniBar value={opportunity.score} tone={opportunity.type === "Riesgo" ? "rose" : "accent"} />
                        </div>
                      </TableCell>
                      <TableCell>{region?.marginPotential ?? 0}</TableCell>
                      <TableCell>
                        <StatusChip label={status} />
                      </TableCell>
                      <TableCell className="max-w-[300px] text-slate-300">{opportunity.action}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="surface-highlight border-white/10 bg-white/[0.04]">
            <CardHeader>
              <CardTitle>Estimated business impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Metric label="Revenue uplift" value={dashboardData.impactPotential.salesLift} />
              <Metric label="Margin optimization" value={dashboardData.impactPotential.marginLift} />
              <Metric label="Marketing efficiency" value={dashboardData.impactPotential.marketingLift} />
              <p className="text-xs text-slate-500">{dashboardData.impactPotential.note}</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-accent">Recommended actions</p>
                <CardTitle className="mt-2">Action plan</CardTitle>
              </div>
              <ListFilter className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-between" onClick={() => setPlan(generateActionPlan(dashboardData.opportunities))}>
                <span>Generar plan</span>
                <WandSparkles className="h-4 w-4" />
              </Button>
              <div className="space-y-3">
                {(plan ?? dashboardData.recommendedActions.slice(0, 3)).map((item, index) => (
                  <div key={`${item}-${index}`} className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-accent">
                      {plan ? `Paso ${index + 1}` : `Action ${index + 1}`}
                    </p>
                    <p className="mt-2 text-sm text-slate-200">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <CompactList
            title="Highest impact opportunities"
            items={highestImpact}
            onSelect={setSelected}
          />
          <CompactList
            title="Watchlist"
            items={watchlist}
            onSelect={setSelected}
          />
        </div>
      </section>

      <DetailPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title ?? "Signal"}
        subtitle={selected ? `${selected.region} • ${formatChannelLabel(selected.channel)}` : ""}
      >
        {selected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Opportunity Score" value={`${selected.score}`} />
              <Metric label="Confidence" value={`${selected.confidence}%`} />
              <Metric label="Impact range" value={selected.impactRange} />
              <Metric label="Producto" value={selected.product} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Accion sugerida</p>
              <p className="mt-2 text-sm text-slate-200">{selected.action}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Signal drivers</p>
              <div className="mt-3 space-y-3">
                {selected.rationale.map((item) => (
                  <div key={item} className="rounded-2xl bg-white/[0.03] px-4 py-3 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
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
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{title}</p>
        <p className="font-display text-3xl text-white">{value}</p>
        <p className="text-sm text-slate-400">{detail}</p>
      </CardContent>
    </Card>
  );
}

function CompactList({
  title,
  items,
  onSelect
}: {
  title: string;
  items: OpportunityCard[];
  onSelect: (item: OpportunityCard) => void;
}) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent">
          <Radar className="h-4 w-4" />
          {title}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full rounded-2xl border border-white/10 bg-[#09101F] p-4 text-left transition hover:border-white/20"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-white">{item.region}</p>
              <StatusChip label={item.type === "Riesgo" ? "Watchlist" : "Alta prioridad"} />
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">
              {item.product} • {formatChannelLabel(item.channel)}
            </p>
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
