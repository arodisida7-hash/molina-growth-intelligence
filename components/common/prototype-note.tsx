import { dashboardData } from "@/lib/mock-data";

export function PrototypeNote({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-slate-400"
          : "rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400"
      }
    >
      <span className="font-medium uppercase tracking-[0.18em] text-slate-300">{dashboardData.prototypeNote.label}</span>
      <span className="text-slate-400">{dashboardData.prototypeNote.statement}</span>
    </div>
  );
}
