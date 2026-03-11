"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, WandSparkles } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardData } from "@/lib/mock-data";
import { generateActionPlan } from "@/lib/report";
import { formatChannelLabel } from "@/lib/utils";

export function AiOpportunityEnginePage() {
  const [expandedId, setExpandedId] = useState<string | null>(dashboardData.opportunities[0]?.id ?? null);
  const [plan, setPlan] = useState<string[] | null>(null);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Motor de Oportunidades IA"
        title="Motor de deteccion de oportunidades y riesgos"
        description="Interfaz tipo copiloto para priorizar expansion, detectar fricciones marginales y traducir senales cruzadas en acciones concretas."
      />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {dashboardData.opportunities.map((opportunity) => {
            const expanded = expandedId === opportunity.id;
            return (
              <Card
                key={opportunity.id}
                className={`overflow-hidden border-white/10 bg-white/[0.04] transition duration-300 ${expanded ? "shadow-glow" : "hover:-translate-y-1"}`}
              >
                <CardHeader className="cursor-pointer" onClick={() => setExpandedId(expanded ? null : opportunity.id)}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={opportunity.type === "Oportunidad" ? "accent" : "rose"}>{opportunity.type}</Badge>
                        <Badge variant="default">{opportunity.product}</Badge>
                        <Badge variant="default">{opportunity.region}</Badge>
                        <Badge variant="default">{formatChannelLabel(opportunity.channel)}</Badge>
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{opportunity.title}</CardTitle>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{opportunity.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl border border-white/10 bg-[#09101F] px-4 py-3 text-right">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Confianza</p>
                        <p className="mt-2 text-lg text-white">{opportunity.confidence}%</p>
                      </div>
                      <button className="rounded-2xl border border-white/10 p-3 text-slate-200 transition hover:bg-white/[0.06]">
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </CardHeader>
                {expanded ? (
                  <CardContent className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4 rounded-3xl border border-white/10 bg-[#09101F] p-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Razonamiento de la señal</p>
                      <div className="space-y-3">
                        {opportunity.rationale.map((item) => (
                          <div key={item} className="rounded-2xl bg-white/[0.03] px-4 py-3 text-sm leading-6 text-slate-200">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4 rounded-3xl border border-white/10 bg-[#09101F] p-5">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Impacto esperado</p>
                        <p className="mt-2 text-2xl text-white">{opportunity.impactRange}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Accion sugerida</p>
                        <p className="mt-2 text-sm leading-7 text-slate-200">{opportunity.action}</p>
                      </div>
                    </div>
                  </CardContent>
                ) : null}
              </Card>
            );
          })}
        </div>

        <Card className="surface-highlight border-white/10 bg-white/[0.04]">
          <CardHeader className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent">
              <Sparkles className="h-4 w-4" />
              Estudio de accion
            </div>
            <CardTitle className="text-3xl">Plan de accion ejecutivo</CardTitle>
            <p className="text-sm leading-7 text-slate-300">
              Genera una secuencia de activacion basada en las oportunidades con mayor confianza y mejor impacto esperado.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <Button className="w-full justify-between" onClick={() => setPlan(generateActionPlan(dashboardData.opportunities))}>
              <span>Generar plan de accion</span>
              <WandSparkles className="h-4 w-4" />
            </Button>
            {plan ? (
              <div className="space-y-3">
                {plan.map((step, index) => (
                  <div key={step} className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-accent">Paso {index + 1}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-200">{step}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-[#09101F] p-6 text-sm leading-7 text-slate-300">
                El motor listara una ruta de ejecucion en 4 semanas alineada a producto, region y canal.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
