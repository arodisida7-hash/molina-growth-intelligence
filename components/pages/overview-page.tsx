"use client";

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
import { ArrowUpRight, BrainCircuit, DatabaseZap, MapPinned, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";

import { ExecutiveOpportunityCard } from "@/components/common/executive-opportunity-card";
import { ImpactStat } from "@/components/common/impact-stat";
import { PrototypeNote } from "@/components/common/prototype-note";
import { ChartCard } from "@/components/common/chart-card";
import { MetricCard } from "@/components/common/metric-card";
import { PageHeader } from "@/components/common/page-header";
import { SourceChip } from "@/components/common/source-chip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { dashboardData, topRegionsByOpportunity } from "@/lib/mock-data";
import { formatChannelLabel, formatCompactCurrency, formatPercent } from "@/lib/utils";

const channelColors = ["#5AD7C4", "#5E8BFF", "#F8B84E", "#F27EA9", "#93A6FF"];

export function OverviewPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Resumen Ejecutivo"
        title="Donde crecer. Que hacer. Con que impacto."
        description="Capa de inteligencia comercial para direccion que conecta CRM, SAP, BI y senales de marketing para priorizar expansion, margen y crecimiento."
        aside={
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Enterprise fit</p>
            <p className="mt-2 text-sm text-slate-200">{dashboardData.enterprisePositioning.statement}</p>
          </div>
        }
      />

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">Top Commercial Opportunities</p>
          <h2 className="font-display text-4xl tracking-tight text-white">Prioridades ejecutivas listas para escanear en segundos</h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {dashboardData.strategicOpportunities.map((item, index) => (
            <ExecutiveOpportunityCard
              key={`${item.region}-${item.product}`}
              region={item.region}
              product={item.product}
              insight={item.insight}
              action={item.action}
              dominant={index === 0}
            />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Estimated Business Impact</p>
          <h2 className="font-display text-4xl tracking-tight text-white">Impacto estimado para la siguiente conversacion directiva</h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="surface-highlight border-white/10 bg-white/[0.04]">
            <CardContent className="grid gap-4 p-6 md:grid-cols-3">
              <ImpactStat value={dashboardData.impactPotential.salesLift} label="Revenue uplift" />
              <ImpactStat value={dashboardData.impactPotential.marginLift} label="Margin optimization" />
              <ImpactStat value={dashboardData.impactPotential.marketingLift} label="Marketing efficiency" />
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader className="pb-3">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                <TrendingUp className="h-4 w-4" />
                Executive readout
              </div>
              <CardTitle className="text-3xl">Estimaciones para una lectura financiera y comercial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-7 text-slate-300">
                El motor proyecta donde puede capturarse crecimiento incremental y que mejora marginal podria justificarse si se ejecutan las oportunidades detectadas.
              </p>
              <p className="text-xs leading-6 text-slate-500">{dashboardData.impactPotential.note}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="surface-highlight border-white/10 bg-gradient-to-r from-white/[0.06] to-white/[0.03]">
          <CardHeader>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent">
              <DatabaseZap className="h-4 w-4" />
              Data Sources Layer
            </div>
            <CardTitle className="text-3xl">Connected enterprise data sources</CardTitle>
            <p className="max-w-3xl text-sm leading-7 text-slate-300">
              CRM, SAP, marketing, distribution y BI aportan el contexto. La plataforma lo convierte en lectura estrategica para direccion.
            </p>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {dashboardData.connectedSources.map((source) => (
              <SourceChip key={source.name} name={source.name} category={source.category} />
            ))}
          </CardContent>
        </Card>

        <Card className="surface-highlight overflow-hidden border-white/10 bg-gradient-to-br from-accent/10 via-white/[0.05] to-blue-400/10 shadow-glow">
          <CardHeader className="space-y-4 border-b border-white/10 pb-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent">
              <BrainCircuit className="h-4 w-4" />
              Executive Weekly Brief
            </div>
            <div>
              <CardTitle className="text-4xl tracking-tight">Memo para direccion en menos de 30 segundos</CardTitle>
              <p className="mt-3 text-sm leading-7 text-slate-200">{dashboardData.executiveBrief.summary}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4 text-sm leading-7 text-slate-100">
              El brief resume key opportunity detected, margin pressure alert y recommended action en una sola lectura semanal.
            </div>
            <div className="grid gap-3">
              <MemoLine label="Key opportunity detected" text={dashboardData.executiveBrief.bullets[0]} />
              <MemoLine label="Margin pressure alert" text={dashboardData.executiveBrief.bullets[2]} />
              <MemoLine label="Recommended action" text={dashboardData.recommendedActions[0]} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <MetricCard
          title="Ingresos YTD"
          value={formatCompactCurrency(dashboardData.kpis.revenueYtd)}
          detail="Lectura consolidada para dimensionar el tamano de la oportunidad comercial."
          delta={dashboardData.kpis.growth}
        />
        <MetricCard
          title="Crecimiento"
          value={formatPercent(dashboardData.kpis.growth)}
          detail="Las plazas priorizadas explican la aceleracion del ultimo trimestre."
          delta={2.4}
        />
        <MetricCard
          title="Margen Bruto"
          value={formatPercent(dashboardData.kpis.grossMargin)}
          detail="El mix premium compensa parte de la presion promocional defensiva."
          delta={0.8}
        />
        <MetricCard
          title="Indice de Eficiencia de Marketing"
          value={`${dashboardData.kpis.marketingEfficiency}`}
          detail="La senal de marketing ayuda a decidir donde escalar y donde corregir."
          delta={4.1}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartCard
          title="Tendencia de ingresos y margen"
          description="Contexto consolidado para validar que las oportunidades estan respaldadas por evolucion comercial y estabilidad marginal."
          badge="12 meses"
        >
          <div className="h-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.months}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="#8E9AB7" tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#8E9AB7" tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000000}M`} />
                <YAxis yAxisId="right" orientation="right" stroke="#8E9AB7" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#09101f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }}
                  formatter={(value, name) =>
                    name === "revenue" ? [formatCompactCurrency(Number(value)), "Ingresos"] : [`${value}`, "IEM"]
                  }
                />
                <Bar yAxisId="left" dataKey="revenue" fill="rgba(94,139,255,0.35)" radius={[12, 12, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="marketingEfficiency" stroke="#5AD7C4" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle>Contexto prioritario</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                <MapPinned className="h-4 w-4" />
                Regiones con mayor prioridad
              </div>
              {topRegionsByOpportunity.slice(0, 4).map((region) => (
                <div key={region.region} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#09101F] px-4 py-3">
                  <div>
                    <p className="text-sm text-white">{region.region}</p>
                    <p className="text-xs text-slate-400">{formatChannelLabel(region.dominantChannel)}</p>
                  </div>
                  <Badge variant="accent">{region.opportunityScore}</Badge>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                <Sparkles className="h-4 w-4" />
                SKUs con mayor traccion
              </div>
              {dashboardData.topSkus.map((sku) => (
                <div key={sku.name} className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-3">
                  <div>
                    <p className="text-sm text-white">{sku.name}</p>
                    <p className="text-xs text-slate-400">{formatCompactCurrency(sku.revenue)}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-sm text-emerald-300">
                    <ArrowUpRight className="h-4 w-4" />
                    {formatPercent(sku.growth)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard
          title="Mix por canal"
          description="Contexto de canal para entender donde el crecimiento puede capturarse con mejor calidad comercial."
        >
          <div className="grid items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dashboardData.channelMix} innerRadius={62} outerRadius={88} paddingAngle={4} dataKey="value">
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
            <div className="space-y-3">
              {dashboardData.channelMix.map((item, index) => (
                <div key={item.channel} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#09101F] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: channelColors[index % channelColors.length] }} />
                    <span className="text-sm text-slate-200">{formatChannelLabel(item.channel)}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Margen por familia" description="Vista de apoyo para identificar que familias sostienen rentabilidad relativa.">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.products}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="family" stroke="#8E9AB7" tickLine={false} axisLine={false} angle={-22} height={70} textAnchor="end" />
                <YAxis stroke="#8E9AB7" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#09101f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }}
                  formatter={(value) => [formatPercent(Number(value)), "Margen"]}
                />
                <Bar dataKey="grossMargin" radius={[10, 10, 0, 0]} fill="#5AD7C4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent">
              <Sparkles className="h-4 w-4" />
              Señales de accion
            </div>
            <CardTitle className="text-2xl">Acciones recomendadas por el motor</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {dashboardData.recommendedActions.map((action, index) => (
              <div
                key={action}
                className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5 transition duration-300 hover:-translate-y-1"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-accent">Accion {index + 1}</p>
                <p className="mt-3 text-sm leading-6 text-slate-200">{action}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-rose-200">
              <ShieldAlert className="h-4 w-4" />
              Alertas prioritarias
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData.alerts.map((alert) => (
              <div key={alert.title} className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium text-white">{alert.title}</p>
                  <Badge variant={alert.level === "Alta" ? "rose" : alert.level === "Media" ? "amber" : "default"}>{alert.level}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{alert.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle>Designed to work with CRM, SAP and BI systems</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-7 text-slate-300">
              Esta experiencia esta pensada para convivir con la infraestructura actual y elevar la conversacion directiva con una capa adicional de claridad estrategica.
            </p>
            <PrototypeNote />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MemoLine({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#09101F] px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-accent">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-200">{text}</p>
    </div>
  );
}
