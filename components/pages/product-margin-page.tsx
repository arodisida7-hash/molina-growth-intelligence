"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, ArrowDownWideNarrow, Box, TrendingDown, TrendingUp } from "lucide-react";

import { DetailPanel } from "@/components/common/detail-panel";
import { MiniBar } from "@/components/common/mini-bar";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusChip } from "@/components/common/status-chip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardData } from "@/lib/mock-data";
import { ProductMetric } from "@/lib/types";
import { formatChannelLabel, formatCompactCurrency, formatPercent } from "@/lib/utils";

type ProductFilter = "Todos" | "Escalar" | "Subaprovechado" | "Presión";
type SortKey = "ytdRevenue" | "grossMargin" | "growth" | "contribution";

export function ProductMarginPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ProductFilter>("Todos");
  const [sortKey, setSortKey] = useState<SortKey>("ytdRevenue");
  const [descending, setDescending] = useState(true);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);

  const rows = useMemo(() => {
    const value = query.trim().toLowerCase();

    return [...dashboardData.products]
      .filter((product) => {
        const status = product.marginPressure ? "Presión" : product.underLeveraged ? "Subaprovechado" : "Escalar";
        const matchesQuery = !value || `${product.family} ${product.keyChannel}`.toLowerCase().includes(value);
        const matchesFilter = filter === "Todos" || status === filter;
        return matchesQuery && matchesFilter;
      })
      .sort((left, right) => {
        const delta = Number(right[sortKey]) - Number(left[sortKey]);
        return descending ? delta : -delta;
      });
  }, [descending, filter, query, sortKey]);

  const selected = selectedFamily ? dashboardData.products.find((row) => row.family === selectedFamily) ?? null : null;
  const trendProducts = (rows.length > 0 ? rows : dashboardData.products).slice(0, 4);
  const marginTrend = trendProducts[0].monthlyMarginTrend.map((point, index) =>
    trendProducts.reduce<Record<string, string | number>>(
      (acc, product) => {
        acc.mes = point.month;
        acc[product.family] = product.monthlyMarginTrend[index]?.margin ?? 0;
        return acc;
      },
      { mes: point.month }
    )
  );

  const pressureCount = dashboardData.products.filter((product) => product.marginPressure).length;
  const underLeveragedCount = dashboardData.products.filter((product) => product.underLeveraged).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Productos"
        title="Producto y margen"
        description="Qué familia escalar, cuál vigilar y dónde conviene proteger margen."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Ingresos del portafolio" value={formatCompactCurrency(dashboardData.kpis.revenueYtd)} detail="Total anualizado" icon={Box} />
        <MetricCard title="Margen promedio" value={formatPercent(dashboardData.kpis.grossMargin)} detail="Portafolio total" icon={TrendingUp} />
        <MetricCard title="Productos en presión" value={`${pressureCount}`} detail="Con deterioro secuencial" icon={AlertTriangle} />
        <MetricCard title="Subaprovechados" value={`${underLeveragedCount}`} detail="Con espacio para crecer" icon={TrendingDown} />
      </section>

      <section>
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="border-b border-white/10 pb-5">
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Tendencia de margen</CardTitle>
              <div className="rounded-full border border-white/10 bg-[#09101F] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-slate-400">
                {trendProducts.length} líneas visibles
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marginTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="mes" stroke="#8E9AB7" tickLine={false} axisLine={false} />
                  <YAxis stroke="#8E9AB7" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#09101f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }} />
                  {trendProducts.map((product, index) => (
                    <Line
                      key={product.family}
                      type="monotone"
                      dataKey={product.family}
                      stroke={["#5AD7C4", "#5E8BFF", "#F8B84E", "#F27EA9"][index]}
                      strokeWidth={index === 0 ? 3 : 2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="gap-4 border-b border-white/10 pb-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <CardTitle>Tabla de productos</CardTitle>
              <div className="flex flex-wrap gap-2">
                {["Todos", "Escalar", "Subaprovechado", "Presión"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFilter(option as ProductFilter)}
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
              <SearchInput value={query} onChange={setQuery} placeholder="Buscar producto o canal..." className="xl:max-w-[440px]" />
              <div className="flex flex-wrap gap-2">
                {[
                  ["ytdRevenue", "Ingresos"],
                  ["grossMargin", "Margen"],
                  ["growth", "Crecimiento"],
                  ["contribution", "Aporte"]
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (sortKey === key) {
                        setDescending((current) => !current);
                        return;
                      }
                      setSortKey(key as SortKey);
                      setDescending(true);
                    }}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                      sortKey === key
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                    }`}
                  >
                    {label}
                    <ArrowDownWideNarrow className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto scroll-clean pt-6">
            {rows.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 bg-[#09101F] px-5 py-10 text-center text-sm text-slate-400">
                No hay productos para el criterio buscado.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Línea</TableHead>
                    <TableHead>Ingresos</TableHead>
                    <TableHead>Margen</TableHead>
                    <TableHead>Crecimiento</TableHead>
                    <TableHead>Riesgo</TableHead>
                    <TableHead>Recomendación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((product) => {
                    const status = product.marginPressure ? "Presión" : product.underLeveraged ? "Subaprovechado" : "Escalar";

                    return (
                      <TableRow key={product.family} className="cursor-pointer" onClick={() => setSelectedFamily(product.family)}>
                        <TableCell className="font-medium text-white">{product.family}</TableCell>
                        <TableCell>{formatChannelLabel(product.keyChannel)}</TableCell>
                        <TableCell>{formatCompactCurrency(product.ytdRevenue)}</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <span>{formatPercent(product.grossMargin)}</span>
                            <MiniBar value={Math.round(product.grossMargin * 2.1)} tone={status === "Presión" ? "rose" : "accent"} />
                          </div>
                        </TableCell>
                        <TableCell>{formatPercent(product.growth)}</TableCell>
                        <TableCell>
                          <StatusChip label={status} />
                        </TableCell>
                        <TableCell className="max-w-[320px] text-slate-300">{product.recommendedAction}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      <DetailPanel
        open={selected !== null}
        onClose={() => setSelectedFamily(null)}
        title={selected?.family ?? "Producto"}
        subtitle={selected ? formatChannelLabel(selected.keyChannel) : ""}
      >
        {selected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Ingresos" value={formatCompactCurrency(selected.ytdRevenue)} />
              <Metric label="Margen" value={formatPercent(selected.grossMargin)} />
              <Metric label="Crecimiento" value={formatPercent(selected.growth)} />
              <Metric label="Aporte" value={formatPercent(selected.contribution)} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Acción sugerida</p>
              <p className="mt-2 text-sm text-slate-200">{selected.recommendedAction}</p>
            </div>
            <div className="grid gap-3">
              <SignalLine label="Demanda" value={selected.demandGrowth} />
              <SignalLine label="Engagement de contenido" value={selected.contentEngagement} />
              <SignalLine label="Potencial de margen" value={selected.marginPotential} />
              <SignalLine label="Índice comercial" value={selected.salesIndex} />
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
  icon: typeof Box;
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg text-white">{value}</p>
    </div>
  );
}

function SignalLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#09101F] px-4 py-4">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <MiniBar value={value} />
    </div>
  );
}
