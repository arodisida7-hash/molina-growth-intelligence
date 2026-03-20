"use client";

import { useMemo, useState, type ComponentType } from "react";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, TrendingDown, Zap } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { DetailPanel } from "@/components/common/detail-panel";
import { MiniBar } from "@/components/common/mini-bar";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { StatusChip } from "@/components/common/status-chip";
import { ChartCard } from "@/components/common/chart-card";
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
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"Todos" | "Escalar" | "Subaprovechado" | "Presion">("Todos");
  const [selected, setSelected] = useState<ProductMetric | null>(null);

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

  const sortedProducts = useMemo(() => {
    const value = query.trim().toLowerCase();

    return [...dashboardData.products]
      .filter((product) => {
        const label = product.marginPressure ? "Presion" : product.underLeveraged ? "Subaprovechado" : "Escalar";
        const matchesQuery = !value || `${product.family} ${product.keyChannel}`.toLowerCase().includes(value);
        const matchesRisk = riskFilter === "Todos" || label === riskFilter;
        return matchesQuery && matchesRisk;
      })
      .sort((a, b) => {
        const left = a[sortKey];
        const right = b[sortKey];
        return descending ? Number(right) - Number(left) : Number(left) - Number(right);
      });
  }, [descending, query, riskFilter, sortKey]);

  const setSort = (nextKey: SortKey) => {
    if (sortKey === nextKey) {
      setDescending((current) => !current);
      return;
    }
    setSortKey(nextKey);
    setDescending(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Products"
        title="Product Intelligence Table"
        description="Busca, filtra y abre detalle por producto para entender revenue, margin, growth y riesgo."
      />

      <section className="dashboard-grid">
        <div className="col-span-12 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <SearchInput value={query} onChange={setQuery} placeholder="Buscar producto o linea..." className="xl:max-w-[460px]" />
          <div className="flex flex-wrap gap-2">
            {["Todos", "Escalar", "Subaprovechado", "Presion"].map((option) => (
              <button
                key={option}
                onClick={() => setRiskFilter(option as "Todos" | "Escalar" | "Subaprovechado" | "Presion")}
                className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition ${
                  riskFilter === option
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="col-span-12 xl:col-span-8">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <CardTitle>Product Intelligence Table</CardTitle>
              <StatusChip label={`${sortedProducts.length} productos`} />
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto scroll-clean">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <SortableHead label="Revenue" active={sortKey === "ytdRevenue"} onClick={() => setSort("ytdRevenue")} />
                  <SortableHead label="Margin" active={sortKey === "grossMargin"} onClick={() => setSort("grossMargin")} />
                  <SortableHead label="Growth" active={sortKey === "growth"} onClick={() => setSort("growth")} />
                  <SortableHead label="Aporte" active={sortKey === "contribution"} onClick={() => setSort("contribution")} />
                  <TableHead>Riesgo</TableHead>
                  <TableHead>Recomendacion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.map((product) => {
                  const label = product.marginPressure ? "Presion" : product.underLeveraged ? "Subaprovechado" : "Escalar";
                  return (
                    <TableRow key={product.family} className="cursor-pointer" onClick={() => setSelected(product)}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{product.family}</p>
                          <p className="text-xs text-slate-500">{formatChannelLabel(product.keyChannel)}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatCompactCurrency(product.ytdRevenue)}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <span>{formatPercent(product.grossMargin)}</span>
                          <MiniBar value={product.grossMargin * 2.1} tone={product.marginPressure ? "rose" : "accent"} />
                        </div>
                      </TableCell>
                      <TableCell>{formatPercent(product.growth)}</TableCell>
                      <TableCell>{formatPercent(product.contribution)}</TableCell>
                      <TableCell>
                        <StatusChip label={label} />
                      </TableCell>
                      <TableCell className="max-w-[320px] text-slate-300">{product.recommendedAction}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </div>

        <div className="col-span-12 grid gap-4 xl:col-span-4">
          <ChartCard title="Margin trend" description="Vista rapida para detectar deterioro secuencial.">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart margin={{ left: -10, right: 10 }} data={marginTrendData}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="month" stroke="#8E9AB7" tickLine={false} axisLine={false} />
                  <YAxis stroke="#8E9AB7" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#09101f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }} />
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

          <QuickList
            title="Highest impact"
            icon={Zap}
            items={dashboardData.products.filter((item) => !item.marginPressure).slice(0, 3)}
            tone="accent"
          />
          <QuickList
            title="Watchlist"
            icon={TrendingDown}
            items={dashboardData.products.filter((item) => item.marginPressure).slice(0, 3)}
            tone="rose"
          />
        </div>
      </section>

      <DetailPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.family ?? "Producto"}
        subtitle={selected ? formatChannelLabel(selected.keyChannel) : ""}
      >
        {selected ? (
          <div className="space-y-4">
            <Metric label="Revenue" value={formatCompactCurrency(selected.ytdRevenue)} />
            <Metric label="Margin" value={formatPercent(selected.grossMargin)} />
            <Metric label="Growth" value={formatPercent(selected.growth)} />
            <Metric label="Contribution" value={formatPercent(selected.contribution)} />
            <div className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Recommendation</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">{selected.recommendedAction}</p>
            </div>
          </div>
        ) : null}
      </DetailPanel>
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

function QuickList({
  title,
  icon: Icon,
  items,
  tone
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  items: ProductMetric[];
  tone: "accent" | "rose";
}) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <div className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] ${tone === "accent" ? "text-accent" : "text-rose-200"}`}>
          <Icon className="h-4 w-4" />
          {title}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.family} className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-white">{item.family}</p>
              <StatusChip label={item.marginPressure ? "Presion" : "Escalar"} />
            </div>
            <p className="mt-2 text-sm text-slate-400">{item.recommendedAction}</p>
          </div>
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
