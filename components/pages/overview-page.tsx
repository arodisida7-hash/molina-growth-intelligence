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
import { ArrowUpRight, BrainCircuit, MapPinned, ShieldAlert, Sparkles } from "lucide-react";

import { ChartCard } from "@/components/common/chart-card";
import { MetricCard } from "@/components/common/metric-card";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { dashboardData, topRegionsByOpportunity } from "@/lib/mock-data";
import { formatChannelLabel, formatCompactCurrency, formatPercent } from "@/lib/utils";

const channelColors = ["#5AD7C4", "#5E8BFF", "#F8B84E", "#F27EA9", "#93A6FF"];

export function OverviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Resumen Ejecutivo"
        title="Centro de mando para expansion comercial rentable"
        description="Lectura consolidada para direccion general: ingresos, margen, eficiencia comercial y focos regionales convertidos en decisiones semanales."
        aside={
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Ventana observada</p>
            <p className="mt-2 text-sm text-slate-200">Abril 2025 a marzo 2026</p>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <MetricCard
          title="Ingresos YTD"
          value={formatCompactCurrency(dashboardData.kpis.revenueYtd)}
          detail="El portafolio mantiene crecimiento orgánico sostenido con mayor aporte de la linea natural."
          delta={dashboardData.kpis.growth}
        />
        <MetricCard
          title="Crecimiento"
          value={formatPercent(dashboardData.kpis.growth)}
          detail="Las ciudades con mejor retorno incremental explican la aceleracion del ultimo trimestre."
          delta={2.4}
        />
        <MetricCard
          title="Margen Bruto"
          value={formatPercent(dashboardData.kpis.grossMargin)}
          detail="El mix premium compensa parcialmente la presion promocional en lineas defensivas."
          delta={0.8}
        />
        <MetricCard
          title="Indice de Eficiencia de Marketing"
          value={`${dashboardData.kpis.marketingEfficiency}`}
          detail="Recetas y premium superan la media; las activaciones tacticas siguen por debajo del benchmark."
          delta={4.1}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <ChartCard
          title="Tendencia de ingresos y margen"
          description="Evolucion mensual del negocio con lectura simultanea de crecimiento comercial y estabilidad marginal."
          badge="12 meses"
        >
          <div className="h-[350px]">
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

        <Card className="surface-highlight border-white/10 bg-white/[0.04]">
          <CardHeader className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent">
              <BrainCircuit className="h-4 w-4" />
              Brief ejecutivo IA
            </div>
            <div>
              <CardTitle className="text-2xl">{dashboardData.executiveBrief.title}</CardTitle>
              <p className="mt-3 text-sm leading-7 text-slate-300">{dashboardData.executiveBrief.summary}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.executiveBrief.bullets.map((bullet) => (
              <div key={bullet} className="rounded-2xl border border-white/10 bg-[#09101F] px-4 py-4 text-sm leading-6 text-slate-200">
                {bullet}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ChartCard
          title="Mix por canal"
          description="La contribucion de autoservicio y distribuidores sigue siendo dominante, pero food service gana peso."
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

        <ChartCard title="Margen por familia" description="La linea natural mantiene el mejor perfil de rentabilidad relativa.">
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

        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle>Regiones y SKUs lideres</CardTitle>
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

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
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
            <CardTitle>Acciones recomendadas</CardTitle>
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
      </section>
    </div>
  );
}
