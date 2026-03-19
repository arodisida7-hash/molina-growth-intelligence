"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export function DetailPanel({
  open,
  title,
  subtitle,
  children,
  onClose
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className={cn("pointer-events-none fixed inset-0 z-40 transition", open ? "opacity-100" : "opacity-0")}>
      <button
        aria-label="Cerrar detalle"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-[#02040C]/70 backdrop-blur-sm transition",
          open ? "pointer-events-auto opacity-100" : "opacity-0"
        )}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 h-full w-full max-w-xl border-l border-white/10 bg-[#08101F]/95 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl transition duration-300",
          open ? "translate-x-0 pointer-events-auto" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Detalle</p>
              <h3 className="font-display text-2xl text-white">{title}</h3>
              {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : null}
            </div>
            <button
              onClick={onClose}
              className="rounded-2xl border border-white/10 p-3 text-slate-300 transition hover:bg-white/[0.06]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="scroll-clean flex-1 overflow-y-auto px-6 py-6">{children}</div>
        </div>
      </aside>
    </div>
  );
}
