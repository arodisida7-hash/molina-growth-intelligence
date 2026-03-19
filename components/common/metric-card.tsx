import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  title,
  value,
  detail,
  delta
}: {
  title: string;
  value: string;
  detail: string;
  delta?: number;
}) {
  const positive = (delta ?? 0) >= 0;

  return (
    <Card className="group overflow-hidden border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.05]">
      <CardHeader className="pb-3">
        <CardTitle className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="font-display text-4xl tracking-tight text-white">{value}</div>
          {typeof delta === "number" ? (
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
                positive ? "bg-emerald-400/10 text-emerald-200" : "bg-rose-400/10 text-rose-200"
              )}
            >
              {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {Math.abs(delta).toFixed(1)} pts
            </div>
          ) : null}
        </div>
        <p className="text-sm leading-6 text-slate-400">{detail}</p>
      </CardContent>
    </Card>
  );
}
