"use client";

import type { ComponentType, ReactNode } from "react";
import { useMemo, useState } from "react";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, TrendingDown, Zap } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/common/chart-card";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardData } from "@/lib/mock-data";
import { ProductMetric } from "@/lib/types";
import { formatChannelLabel, formatCompactCurrency, formatPercent } from "@/lib/utils";

type SortKey = "ytdRevenue" | "grossMargin" | "growth" | "contribution";

export function ProductMarginPage() {
  const [sortKey, setSortKey] = useState<SortKey>("ytdRevenue");
  const [descending, setDescending] = useState(true);

  const sortedProducts = useMemo(() => {
    return [...dashboardData.products].sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];
      return descending ? Number(right) - Number(left) : Number(left) - Number(right);
    });
  }, [descending, sortKey]);

  const marginTrendData = useMemo(() => {
    const focusProducts = dashboardData.products.slice(0, 5);

    return focusProducts[0].monthlyMarginTrend.map((point, index) =>
      focusProducts.reduce<Record<string, string | number>>(
        (accumulator, product) => {
          accumulator.month = point.month;
          accumulator[product.family] = product.monthlyMarginTrend[index]?.margin ?? 0;
          return accumulator;
        },
        { month: point.month }
      )
    );
  }, []);

  const setSort = (nextKey: SortKey) => {
    if (sortKey === nextKey) {
      setDescending((current) => !current);
      return;
    }
    setSortKey(nextKey);
    setDescending(true);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Producto y Margen"
        title="Portafolio, rentabilidad y palancas por familia"
        description="Vista para identificar que familias financian el crecimiento, cuales estan subaprovechadas y donde la presion promocional empieza a destruir valor."
      />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartCard
          title="Matriz de desempeno del portafolio"
          description="Cada familia combina volumen, crecimiento, margen y contribution share para ayudar a decidir donde escalar y donde defender."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {dashboardData.products.map((product) => (
              <div key={product.family} className="rounded-3xl border border-white/10 bg-[#09101F] p-5 transition duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-xl text-white">{product.family}</p>
                    <p className="mt-2 text-sm text-slate-400">{formatChannelLabel(product.keyChannel)}</p>
                  </div>
                  <Badge variant={product.marginPressure ? "rose" : product.underLeveraged ? "amber" : "accent"}>
                    {product.marginPressure ? "Presion" : product.underLeveraged ? "Subaprovechado" : "Escalar"}
                  </Badge>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/[0.03] p-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Ingresos</p>
                    <p className="mt-2 text-lg text-white">{formatCompactCurrency(product.ytdRevenue)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.03] p-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Margen</p>
                    <p className="mt-2 text-lg text-white">{formatPercent(product.grossMargin)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.03] p-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Crecimiento</p>
                    <p className="mt-2 text-lg text-white">{formatPercent(product.growth)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.03] p-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Aporte</p>
                    <p className="mt-2 text-lg text-white">{formatPercent(product.contribution)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Tendencia de margen por familia" description="Foco sobre las familias con deterioro secuencial y las que aun tienen aire para premiumizacion.">
          <div className="h-[440px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart margin={{ left: -10, right: 10 }} data={marginTrendData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="#8E9AB7" tickLine={false} axisLine={false} />
                <YAxis stroke="#8E9AB7" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#09101f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }}
                />
                {dashboardData.products.slice(0, 5).map((product, index) => (
                  <Line
                    key={product.family}
                    dataKey={product.family}
                    name={product.family}
                    type="monotone"
                    stroke={["#5AD7C4", "#5E8BFF", "#F8B84E", "#F27EA9", "#9FE870"][index]}
                    strokeWidth={index === 0 ? 3 : 2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tabla de desempeno</CardTitle>
              <p className="mt-2 text-sm text-slate-400">Ordena por ingresos, margen, crecimiento o aporte relativo.</p>
            </div>
            <Badge variant="default">{descending ? "Descendente" : "Ascendente"}</Badge>
          </CardHeader>
          <CardContent className="overflow-x-auto scroll-clean">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Familia</TableHead>
                  <SortableHead label="Ventas" active={sortKey === "ytdRevenue"} onClick={() => setSort("ytdRevenue")} />
                  <SortableHead label="Margen" active={sortKey === "grossMargin"} onClick={() => setSort("grossMargin")} />
                  <SortableHead label="Crecimiento" active={sortKey === "growth"} onClick={() => setSort("growth")} />
                  <SortableHead label="Aporte" active={sortKey === "contribution"} onClick={() => setSort("contribution")} />
                  <TableHead>Recomendacion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.map((product) => (
                  <TableRow key={product.family}>
                    <TableCell className="font-medium text-white">{product.family}</TableCell>
                    <TableCell>{formatCompactCurrency(product.ytdRevenue)}</TableCell>
                    <TableCell>{formatPercent(product.grossMargin)}</TableCell>
                    <TableCell>{formatPercent(product.growth)}</TableCell>
                    <TableCell>{formatPercent(product.contribution)}</TableCell>
                    <TableCell className="max-w-[340px] text-slate-300">{product.recommendedAction}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <InsightStack
            title="Productos subaprovechados"
            icon={Zap}
            tone="amber"
            items={dashboardData.products.filter((product) => product.underLeveraged)}
            render={(product) => (
              <>
                <p className="font-medium text-white">{product.family}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Margen de {formatPercent(product.grossMargin)} con crecimiento aun por debajo del potencial. Conviene ampliar
                  presencia en {formatChannelLabel(product.keyChannel)}.
                </p>
              </>
            )}
          />
          <InsightStack
            title="Alertas de presion marginal"
            icon={TrendingDown}
            tone="rose"
            items={dashboardData.products.filter((product) => product.marginPressure)}
            render={(product) => (
              <>
                <p className="font-medium text-white">{product.family}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  La secuencia reciente de margen exige corregir precio, promocion o configuracion de portafolio.
                </p>
              </>
            )}
          />
        </div>
      </section>
    </div>
  );
}

function SortableHead({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <TableHead>
      <button onClick={onClick} className="inline-flex items-center gap-2 text-left text-xs uppercase tracking-[0.16em] text-slate-400">
        {label}
        {active ? <ArrowDownWideNarrow className="h-4 w-4" /> : <ArrowUpWideNarrow className="h-4 w-4 opacity-40" />}
      </button>
    </TableHead>
  );
}

function InsightStack<T extends ProductMetric>({
  title,
  icon: Icon,
  tone,
  items,
  render
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  tone: "amber" | "rose";
  items: T[];
  render: (item: T) => ReactNode;
}) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <div className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] ${tone === "amber" ? "text-amber-200" : "text-rose-200"}`}>
          <Icon className="h-4 w-4" />
          {title}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.family} className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
            {render(item)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
