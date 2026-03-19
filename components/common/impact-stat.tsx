import { Card, CardContent } from "@/components/ui/card";

export function ImpactStat({
  value,
  label
}: {
  value: string;
  label: string;
}) {
  return (
    <Card className="border-white/10 bg-[#09101F]">
      <CardContent className="space-y-3 p-6">
        <p className="font-display text-4xl tracking-tight text-white">{value}</p>
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      </CardContent>
    </Card>
  );
}
