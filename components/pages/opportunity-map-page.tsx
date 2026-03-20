"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Map, Radar } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { dashboardData, topRegionsByOpportunity } from "@/lib/mock-data";
import { RegionMetric } from "@/lib/types";
import { formatChannelLabel, formatCompactCurrency, formatPercent } from "@/lib/utils";

const regionOrder = ["Tijuana", "Monterrey", "Leon", "Guadalajara", "Queretaro", "CDMX", "Merida", "Puebla", "Cancun"];

export function OpportunityMapPage() {
  const [selected, setSelected] = useState<RegionMetric | null>(null);
  const [activationMessage, setActivationMessage] = useState("Explora la shortlist y activa una plaza con mejor balance entre demanda, margen y cobertura.");

  const orderedRegions = useMemo(
    () => regionOrder.map((name) => dashboardData.regions.find((region) => region.region === name)!).filter(Boolean),
    []
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Mapa de Oportunidad"
        title="Prioridades regionales para expansion inteligente"
        description="Mapa ejecutivo de Mexico estilizado para ordenar demanda, penetracion, margen potencial y riesgo de inventario en una sola lectura."
      />

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Mapa de oportunidad regional</CardTitle>
              <p className="mt-2 text-sm text-slate-400">Selecciona una plaza para actualizar la recomendacion accionable.</p>
            </div>
            <Badge variant="accent">Score compuesto</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {orderedRegions.map((region) => {
                const active = region.region === selected?.region;
                return (
                  <button
                    key={region.region}
                    onClick={() => {
                      setSelected(region);
                      setActivationMessage(`Plan regional listo para ${region.region}.`);
                    }}
                    className={`group rounded-3xl border p-5 text-left transition duration-300 ${
                      active
                        ? "border-accent/40 bg-gradient-to-br from-accent/15 to-blue-400/10 shadow-glow"
                        : "border-white/10 bg-[#09101F] hover:-translate-y-1 hover:border-white/20"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="min-w-0 truncate font-display text-xl text-white">{region.region}</p>
                        <div className="shrink-0 rounded-full bg-white/[0.06] px-3 py-1 text-sm font-medium text-white">
                          {region.opportunityScore}
                        </div>
                      </div>
                      <p className="text-sm leading-6 text-slate-400">{region.segment}</p>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <MetricChip label="DEM" value={region.demandIndex} />
                      <MetricChip label="PEN" value={region.penetrationIndex} />
                      <MetricChip label="MAR" value={region.marginPotential} />
                      <MetricChip label="STK" value={100 - region.stockRisk} />
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="surface-highlight border-white/10 bg-white/[0.04]">
          <CardHeader>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent">
              <Radar className="h-4 w-4" />
              Recomendacion actual
            </div>
            <CardTitle className="text-3xl">{selected?.region ?? "Shortlist regional"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {selected ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <MetricTile label="Ingresos" value={formatCompactCurrency(selected.revenue)} />
                  <MetricTile label="Crecimiento" value={formatPercent(selected.growth)} />
                  <MetricTile label="Canal" value={formatChannelLabel(selected.dominantChannel)} />
                  <MetricTile label="Salud" value={`${selected.distributorHealth}/100`} />
                </div>
                <div className="rounded-3xl border border-accent/20 bg-accent/10 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-accent">Lectura estrategica</p>
                  <p className="mt-3 text-sm leading-7 text-slate-100">{selected.recommendation}</p>
                </div>
                <div className="grid gap-3">
                  {[
                    ["Demanda", selected.demandIndex],
                    ["Penetracion", selected.penetrationIndex],
                    ["Margen potencial", selected.marginPotential],
                    ["Stock risk inverso", 100 - selected.stockRisk]
                  ].map(([label, value]) => (
                    <div key={String(label)} className="rounded-2xl bg-[#09101F] p-4">
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                        <span>{label}</span>
                        <span>{value}</span>
                      </div>
                      <Progress value={Number(value)} />
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full justify-between"
                  onClick={() =>
                    setActivationMessage(
                      `Se priorizo ${selected.region} para activacion comercial con foco en ${formatChannelLabel(selected.dominantChannel)}.`
                    )
                  }
                >
                  <span>Activar recomendacion regional</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                {topRegionsByOpportunity.slice(0, 3).map((region, index) => (
                  <button
                    key={region.region}
                    onClick={() => {
                      const target = orderedRegions.find((item) => item.region === region.region) ?? null;
                      setSelected(target);
                      if (target) {
                        setActivationMessage(`Plan regional listo para ${target.region}.`);
                      }
                    }}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#09101F] px-4 py-4 text-left transition hover:border-white/20"
                  >
                    <div>
                      <p className="text-sm text-white">
                        {index + 1}. {region.region}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{region.segment}</p>
                    </div>
                    <Badge variant="accent">{region.opportunityScore}</Badge>
                  </button>
                ))}
              </div>
            )}
            <div className="rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-slate-100">
              {activationMessage}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
              <Map className="h-4 w-4" />
              5 oportunidades lideres
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topRegionsByOpportunity.map((region, index) => (
              <div key={region.region} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#09101F] p-4">
                <div>
                  <p className="text-sm text-white">
                    {index + 1}. {region.region}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{region.segment}</p>
                </div>
                <Badge variant="accent">{region.opportunityScore}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle>Desglose del indice de oportunidad</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dashboardData.regions.map((region) => (
              <div key={region.region} className="rounded-3xl border border-white/10 bg-[#09101F] p-5 transition duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{region.region}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{formatChannelLabel(region.dominantChannel)}</p>
                  </div>
                  <Badge variant={region.opportunityScore >= 80 ? "accent" : "default"}>{region.opportunityScore}</Badge>
                </div>
                <div className="mt-4 space-y-3">
                  <ScoreLine label="Demanda" value={region.demandIndex} />
                  <ScoreLine label="Afinidad de contenido" value={region.contentEngagement} />
                  <ScoreLine label="Margen" value={region.marginPotential} />
                  <ScoreLine label="Riesgo de stock inverso" value={100 - region.stockRisk} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-3 text-lg text-white">{value}</p>
    </div>
  );
}

function ScoreLine({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-400">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

function MetricChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/[0.04] px-3 py-3 text-center">
      <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl text-white">{value}</p>
    </div>
  );
}
