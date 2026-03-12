"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Megaphone, Sparkles, Target } from "lucide-react";

import { ChartCard } from "@/components/common/chart-card";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardData } from "@/lib/mock-data";
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

export function MarketingIntelligencePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Inteligencia de Marketing"
        title="Asignacion de gasto, creatividad y retorno comercial"
        description="Lectura de eficiencia para decidir donde escalar campanas, donde corregir mensaje y que creatividad mueve ingresos con mejor retorno comercial."
      />

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <MiniMetric title="ROAS promedio" value="5.1x" detail="Las recetas y premium arrastran la media." />
        <MiniMetric title="CAC promedio" value="$190" detail="B2B sostiene CAC mas alto pero con mejor valor de ticket." />
        <MiniMetric title="Interaccion" value="75/100" detail="El contenido utilitario supera las piezas puramente tacticas." />
        <MiniMetric title="Temas creativos" value="4" detail="Dos conceptos ya justifican escalamiento nacional." />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <ChartCard title="Inversion por canal" description="Compara concentracion presupuestal contra la lectura actual de retorno.">
          <div className="h-[320px]">
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

        <ChartCard title="Comparativo por tipo de contenido" description="Interaccion y ROAS indexado para priorizar creatividad que si cambia resultado comercial.">
          <div className="h-[320px]">
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
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle>Tabla de campanas</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto scroll-clean">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campana</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Inversion</TableHead>
                  <TableHead>ROAS</TableHead>
                  <TableHead>CAC</TableHead>
                  <TableHead>Interaccion</TableHead>
                  <TableHead>Recomendacion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium text-white">{campaign.name}</TableCell>
                    <TableCell>{campaign.type}</TableCell>
                    <TableCell>{formatChannelLabel(campaign.channel)}</TableCell>
                    <TableCell>{formatCompactCurrency(campaign.spend)}</TableCell>
                    <TableCell>{campaign.roas}x</TableCell>
                    <TableCell>{formatCompactCurrency(campaign.cac)}</TableCell>
                    <TableCell>{campaign.engagement}</TableCell>
                    <TableCell className="max-w-[300px] text-slate-300">{campaign.recommendation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="surface-highlight border-white/10 bg-white/[0.04]">
            <CardHeader>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent">
                <Target className="h-4 w-4" />
                Recomendacion de asignacion
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-slate-200">
              <p>
                Escalar el mix de recetas y premium, donde el engagement convierte mejor en sell-out y la historia de marca
                eleva elasticidad de precio.
              </p>
              <p>
                Reducir el peso de activaciones tacticas en distribuidores hasta corregir ROAS y redefinir la propuesta creativa.
              </p>
              <p>
                Integrar la captura B2B con casos de uso culinario para bajar CAC en food service sin sacrificar calidad del lead.
              </p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                <Sparkles className="h-4 w-4" />
                Temas creativos lideres
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboardData.creativeThemes.map((theme) => (
                <div key={theme.theme} className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-white">{theme.theme}</p>
                    <Badge variant="accent">+{theme.lift}%</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
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
        <p className="text-sm leading-6 text-slate-300">{detail}</p>
      </CardContent>
    </Card>
  );
}
