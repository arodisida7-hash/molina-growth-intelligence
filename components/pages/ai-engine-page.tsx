"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Radar, WandSparkles } from "lucide-react";

import { MiniBar } from "@/components/common/mini-bar";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusChip } from "@/components/common/status-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardData } from "@/lib/mock-data";
import { generateActionPlan } from "@/lib/report";
import { OpportunityCard } from "@/lib/types";
import { formatChannelLabel } from "@/lib/utils";

type SignalFilter = "Todos" | "Oportunidad" | "Riesgo";

export function AiOpportunityEnginePage() {
  const [query, setQuery] = useState("");
  const [signalFilter, setSignalFilter] = useState<SignalFilter>("Todos");
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  const selected = rows.find((item) => item.id === selectedId) ?? rows[0] ?? dashboardData.opportunities[0];
  const highestImpact = [...dashboardData.opportunities].sort((left, right) => right.score - left.score).slice(0, 3);
  const watchlist = dashboardData.opportunities.filter((opportunity) => opportunity.type === "Riesgo").slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Opportunity Engine"
        title="Opportunity Table"
        description="Cada señal se convierte en una lectura de negocio, una acción y un rango de impacto."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CompactStat title="Open signals" value="6" detail="Lectura activa" />
        <CompactStat title="High confidence" value="3" detail="Listas para actuar" />
        <CompactStat title="Watchlist" value="2" detail="Riesgos relevantes" />
        <CompactStat title="Impact range" value="+9%" detail="Escenario superior" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="gap-4 border-b border-white/10 pb-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl">Signal Feed</CardTitle>
                <p className="text-sm text-slate-400">Selecciona una señal para actualizar el playbook ejecutivo.</p>
              </div>
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
          <CardContent className="grid gap-4 pt-6">
            {rows.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-[#09101F] px-5 py-10 text-center text-sm text-slate-400">
                Sin resultados para los filtros actuales.
              </div>
            ) : null}
            {rows.map((opportunity) => {
              const region = dashboardData.regions.find((item) => item.region === opportunity.region);
              const status = opportunity.type === "Riesgo" ? "Watchlist" : opportunity.score >= 85 ? "Alta prioridad" : "Seguimiento";
              const active = selected.id === opportunity.id;

              return (
                <button
                  key={opportunity.id}
                  onClick={() => setSelectedId(opportunity.id)}
                  className={`group relative overflow-hidden rounded-[28px] border p-5 text-left transition duration-300 ${
                    active
                      ? "border-accent/30 bg-gradient-to-br from-[#0B1528] via-[#0A1021] to-[#10243B] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                      : "border-white/10 bg-[#09101F] hover:-translate-y-1 hover:border-white/20"
                  }`}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-70" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">{opportunity.title}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        {opportunity.region} • {formatChannelLabel(opportunity.channel)}
                      </p>
                    </div>
                    <StatusChip label={status} />
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_auto]">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{opportunity.product}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{opportunity.action}</p>
                    </div>
                    <SignalMetric label="Score" value={`${opportunity.score}`} />
                    <SignalMetric label="Margen" value={`${region?.marginPotential ?? 0}`} />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <MetricChip label="Impacto" value={opportunity.impactRange} />
                    <MetricChip label="Confianza" value={`${opportunity.confidence}%`} />
                  </div>
                  <MiniBar value={opportunity.score} tone={opportunity.type === "Riesgo" ? "rose" : "accent"} className="mt-4" />
                  <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent">
                    Ver playbook
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <PlaybookPanel selected={selected} plan={plan} onGeneratePlan={() => setPlan(generateActionPlan(dashboardData.opportunities))} />

          <CompactList title="Highest impact opportunities" items={highestImpact} onSelect={(item) => setSelectedId(item.id)} />
          <CompactList title="Watchlist" items={watchlist} onSelect={(item) => setSelectedId(item.id)} />
        </div>
      </section>
    </div>
  );
}

function PlaybookPanel({
  selected,
  plan,
  onGeneratePlan
}: {
  selected: OpportunityCard;
  plan: string[] | null;
  onGeneratePlan: () => void;
}) {
  return (
    <Card className="surface-highlight border-white/10 bg-gradient-to-br from-[#0B1528] via-[#0A1021] to-[#10243B]">
      <CardHeader className="border-b border-white/10 pb-5">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
          <Radar className="h-4 w-4" />
          Executive playbook
        </div>
        <CardTitle className="text-3xl">{selected.title}</CardTitle>
        <p className="text-sm text-slate-400">
          {selected.region} • {selected.product} • {formatChannelLabel(selected.channel)}
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3">
          <SignalMetric label="Score" value={`${selected.score}`} />
          <SignalMetric label="Confianza" value={`${selected.confidence}%`} />
          <SignalMetric label="Impacto" value={selected.impactRange} />
          <div className="rounded-2xl border border-white/10 bg-[#09101F] px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Estado</p>
            <div className="mt-3">
              <StatusChip label={selected.type === "Riesgo" ? "Watchlist" : "Alta prioridad"} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-accent/20 bg-accent/10 p-5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Recommended move</p>
          <p className="mt-3 text-base leading-7 text-slate-100">{selected.action}</p>
        </div>

        <div className="space-y-3">
          {selected.rationale.map((item, index) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Driver {index + 1}</p>
              <p className="mt-2 text-sm text-slate-300">{item}</p>
            </div>
          ))}
        </div>

        <Card className="border-white/10 bg-[#09101F]">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Action plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-between" onClick={onGeneratePlan}>
              <span>Generar plan</span>
              <WandSparkles className="h-4 w-4" />
            </Button>
            <div className="space-y-3">
              {(plan ?? dashboardData.recommendedActions.slice(0, 3)).map((item, index) => (
                <div key={`${item}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-accent">
                    {plan ? `Paso ${index + 1}` : `Action ${index + 1}`}
                  </p>
                  <p className="mt-2 text-sm text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

function CompactStat({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <Card className="overflow-hidden border-white/10 bg-white/[0.04]">
      <CardContent className="relative p-5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-70" />
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{title}</p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <p className="font-display text-4xl text-white">{value}</p>
          <p className="text-sm text-slate-400">{detail}</p>
        </div>
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
        <CardTitle className="text-xl">{title}</CardTitle>
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

function SignalMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#09101F] px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl text-white">{value}</p>
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
