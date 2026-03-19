import { Badge } from "@/components/ui/badge";

export function SourceChip({ name, category }: { name: string; category?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition duration-300 hover:border-white/15 hover:bg-white/[0.05]">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="default" className="bg-white/[0.04] text-slate-100">
          {name}
        </Badge>
        {category ? <span className="text-xs text-slate-500">{category}</span> : null}
      </div>
    </div>
  );
}
