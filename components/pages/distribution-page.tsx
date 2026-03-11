"use client";

import { Scatter, ScatterChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ZAxis, ReferenceLine } from "recharts";
import { AlertTriangle, Truck } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardData } from "@/lib/mock-data";

export function DistributionIntelligencePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Inteligencia de Distribucion"
        title="Cobertura, penetracion y tension operativa"
        description="Cruza demanda regional con cobertura de distribuidores para detectar plazas a defender, expandir u optimizar antes de comprometer margen."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardData.distributors.map((distributor) => (
          <Card key={distributor.name} className="border-white/10 bg-white/[0.04]">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-xl text-white">{distributor.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{distributor.region}</p>
                </div>
                <Badge variant={distributor.stockoutRisk >= 30 ? "rose" : distributor.coverage >= 70 ? "accent" : "amber"}>
                  {distributor.coverage}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <MiniPill label="Cobertura" value={distributor.coverage} />
                <MiniPill label="Rotacion" value={distributor.rotation} />
                <MiniPill label="Servicio" value={distributor.serviceLevel} />
              </div>
              <p className="text-sm leading-6 text-slate-300">{distributor.strategicStatus}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle>Penetracion vs demanda</CardTitle>
            <p className="text-sm text-slate-400">Scatterplot para entender que regiones requieren expansion, defensa o racionalizacion.</p>
          </CardHeader>
          <CardContent>
            <div className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                  <XAxis type="number" dataKey="penetrationIndex" name="Penetracion" stroke="#8E9AB7" domain={[30, 80]} />
                  <YAxis type="number" dataKey="demandIndex" name="Demanda" stroke="#8E9AB7" domain={[65, 100]} />
                  <ZAxis type="number" dataKey="opportunityScore" range={[120, 620]} />
                  <Tooltip cursor={{ strokeDasharray: "4 4" }} contentStyle={{ background: "#09101f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }} />
                  <ReferenceLine x={58} stroke="rgba(255,255,255,0.18)" />
                  <ReferenceLine y={82} stroke="rgba(255,255,255,0.18)" />
                  <Scatter data={dashboardData.regions} fill="#5AD7C4" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                "Fuerte / Defender",
                "Alto potencial / Baja penetracion",
                "En riesgo / Presion marginal",
                "Saturado / Optimizar"
              ].map((segment) => (
                <div key={segment} className="rounded-2xl border border-white/10 bg-[#09101F] px-4 py-3 text-sm text-slate-300">
                  {segment}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-rose-200">
                <AlertTriangle className="h-4 w-4" />
                Alertas de riesgo
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboardData.regions
                .filter((region) => region.stockRisk >= 28 || region.distributorHealth <= 72)
                .map((region) => (
                  <div key={region.region} className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm text-white">{region.region}</p>
                      <Badge variant={region.stockRisk >= 30 ? "rose" : "amber"}>{region.stockRisk}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Riesgo por cobertura, inventario o salud de distribuidor. Conviene contener demanda adicional hasta estabilizar suministro.
                    </p>
                  </div>
                ))}
            </CardContent>
          </Card>
          <Card className="surface-highlight border-white/10 bg-white/[0.04]">
            <CardHeader>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent">
                <Truck className="h-4 w-4" />
                Segmentos de crecimiento
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboardData.regions.map((region) => (
                <div key={region.region} className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-white">{region.region}</p>
                    <Badge variant={region.segment === "Alto potencial / Baja penetracion" ? "accent" : region.segment === "En riesgo / Presion marginal" ? "rose" : "default"}>
                      {region.segment}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{region.recommendation}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function MiniPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] px-2 py-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-base text-white">{value}</p>
    </div>
  );
}
