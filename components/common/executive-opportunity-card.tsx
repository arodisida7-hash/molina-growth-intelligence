import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function ExecutiveOpportunityCard({
  region,
  product,
  insight,
  action,
  dominant = false
}: {
  region: string;
  product: string;
  insight: string;
  action: string;
  dominant?: boolean;
}) {
  return (
    <Card
      className={`group overflow-hidden border-white/10 transition duration-300 hover:-translate-y-1 hover:border-white/20 ${
        dominant ? "surface-highlight bg-gradient-to-br from-white/[0.08] to-white/[0.03] shadow-glow" : "bg-white/[0.04]"
      }`}
    >
      <CardContent className="space-y-5 p-6">
        <div className="flex items-center justify-between gap-4">
          <Badge variant="default" className="bg-white/[0.04] text-slate-200">
            {region}
          </Badge>
          <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Oportunidad priorizada</span>
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-2xl text-white">{product}</h3>
          <p className="text-sm leading-7 text-slate-300">{insight}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0A1021] px-4 py-4">
          <div className="flex items-start gap-3">
            <ArrowUpRight className="mt-0.5 h-4 w-4 text-accent" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-accent">Accion sugerida</p>
              <p className="mt-2 text-sm leading-6 text-slate-100">{action}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
