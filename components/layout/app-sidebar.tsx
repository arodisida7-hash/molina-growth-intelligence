"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  AreaChart,
  FileText,
  LayoutDashboard,
  type LucideIcon,
  Map,
  Package2,
  Truck
} from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  href:
    | "/overview"
    | "/ai-opportunity-engine"
    | "/board-report"
    | "/opportunity-map"
    | "/distribution-intelligence"
    | "/product-margin"
    | "/marketing-intelligence";
  label: string;
  icon: LucideIcon;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    label: "Resumen",
    items: [{ href: "/overview", label: "Resumen Ejecutivo", icon: LayoutDashboard }]
  },
  {
    label: "Inteligencia comercial",
    items: [
      { href: "/ai-opportunity-engine", label: "Motor de oportunidades", icon: Activity },
      { href: "/board-report", label: "Memo semanal", icon: FileText }
    ]
  },
  {
    label: "Regiones",
    items: [
      { href: "/opportunity-map", label: "Mapa de Oportunidad", icon: Map },
      { href: "/distribution-intelligence", label: "Cobertura", icon: Truck }
    ]
  },
  {
    label: "Productos",
    items: [{ href: "/product-margin", label: "Producto y margen", icon: Package2 }]
  },
  {
    label: "Marketing",
    items: [{ href: "/marketing-intelligence", label: "Marketing", icon: AreaChart }]
  }
];

export const navItems = navSections.flatMap((section) => section.items);

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="sticky top-0 hidden h-screen w-[310px] shrink-0 border-r border-white/10 bg-[#070b18]/90 px-6 py-8 backdrop-blur-xl xl:block">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/90 to-cyan-300/80 text-slate-950 shadow-glow">
            <Activity className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Molina Growth</p>
            <h2 className="font-display text-2xl font-semibold text-white">Inteligencia comercial</h2>
            <p className="text-sm text-slate-400">Prioriza expansión, margen y cobertura.</p>
          </div>
        </div>

        <nav className="space-y-5">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-2">
              <p className="px-4 text-[11px] uppercase tracking-[0.18em] text-slate-500">{section.label}</p>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition duration-300",
                      active
                        ? "border-accent/30 bg-accent/10 text-white shadow-[0_0_0_1px_rgba(90,215,196,0.1)]"
                        : "border-transparent bg-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active ? "text-accent" : "text-slate-500 group-hover:text-slate-200")} />
                    <span className="text-sm leading-5">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="scroll-clean flex gap-2 overflow-x-auto xl:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-3 text-sm transition duration-300",
              active
                ? "border-accent/30 bg-accent/10 text-white"
                : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
