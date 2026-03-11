"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AreaChart,
  Bot,
  FileText,
  LayoutDashboard,
  LucideIcon,
  Map,
  Package2,
  Truck
} from "lucide-react";

import { cn } from "@/lib/utils";

export const navItems = [
  { href: "/overview", label: "Resumen Ejecutivo", icon: LayoutDashboard },
  { href: "/product-margin", label: "Producto y Margen", icon: Package2 },
  { href: "/opportunity-map", label: "Mapa de Oportunidad", icon: Map },
  { href: "/marketing-intelligence", label: "Inteligencia de Marketing", icon: AreaChart },
  { href: "/distribution-intelligence", label: "Inteligencia de Distribucion", icon: Truck },
  { href: "/ai-opportunity-engine", label: "Motor de Oportunidades IA", icon: Bot },
  { href: "/board-report", label: "Reporte de Consejo", icon: FileText }
] satisfies Array<{ href: Route; label: string; icon: LucideIcon }>;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[310px] shrink-0 border-r border-white/10 bg-[#070b18]/90 px-6 py-8 backdrop-blur-xl xl:block">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/90 to-cyan-300/80 text-slate-950 shadow-glow">
            <Activity className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Molina Intelligence</p>
            <h2 className="font-display text-2xl font-semibold text-white">Growth Intelligence</h2>
            <p className="text-sm leading-6 text-slate-400">
              Capa de inteligencia comercial para expansion, margen y decisiones ejecutivas.
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl border px-4 py-3 transition duration-300",
                  active
                    ? "border-accent/30 bg-accent/10 text-white shadow-[0_0_0_1px_rgba(90,215,196,0.1)]"
                    : "border-transparent bg-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-accent" : "text-slate-500 group-hover:text-slate-200")} />
                <span className="text-sm leading-5">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Narrativa ejecutiva</p>
          <p className="mt-3 text-sm leading-6 text-slate-200">
            La plataforma conecta senales de marketing, ventas, distribucion y margen para priorizar expansion rentable.
          </p>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="scroll-clean flex gap-2 overflow-x-auto xl:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-3 text-sm transition duration-300",
              active
                ? "border-accent/30 bg-accent/10 text-white"
                : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
