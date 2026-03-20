"use client";

import { ReactNode, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronRight, Download } from "lucide-react";

import { AppSidebar, MobileNav } from "@/components/layout/app-sidebar";
import { SearchInput } from "@/components/common/search-input";
import { buttonVariants } from "@/components/ui/button";
import { dashboardData } from "@/lib/mock-data";

type SearchResult = {
  id: string;
  label: string;
  meta: string;
  href: Route;
};

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];

    const entities: SearchResult[] = [
      ...dashboardData.products.map((item) => ({
        id: item.family,
        label: item.family,
        meta: "Producto",
        href: "/product-margin" as Route
      })),
      ...dashboardData.regions.map((item) => ({
        id: item.region,
        label: item.region,
        meta: "Region",
        href: "/opportunity-map" as Route
      })),
      ...dashboardData.campaigns.map((item) => ({
        id: item.id,
        label: item.name,
        meta: "Campana",
        href: "/marketing-intelligence" as Route
      })),
      ...dashboardData.opportunities.map((item) => ({
        id: item.id,
        label: item.title,
        meta: "Oportunidad",
        href: "/ai-opportunity-engine" as Route
      }))
    ];

    return entities.filter((item) => `${item.label} ${item.meta}`.toLowerCase().includes(value)).slice(0, 6);
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#060816]/80 px-5 py-4 backdrop-blur-xl md:px-8 xl:px-10">
            <div className="dashboard-container">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                    <CalendarDays className="h-4 w-4" />
                    Corte al 11 de marzo de 2026
                  </div>
                  <p className="text-sm text-slate-300">
                    Capa de inteligencia comercial para potenciar CRM, SAP y BI con decisiones de expansion, margen y cobertura.
                  </p>
                </div>
                <div className="flex flex-col gap-3 lg:min-w-[420px]">
                  <div className="relative">
                    <SearchInput
                      value={query}
                      onChange={setQuery}
                      placeholder="Buscar producto, region, campana u oportunidad..."
                    />
                    {results.length > 0 ? (
                      <div className="absolute top-[calc(100%+0.5rem)] z-30 w-full rounded-3xl border border-white/10 bg-[#08101F]/95 p-2 shadow-panel backdrop-blur-xl">
                        {results.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setQuery("");
                              router.push(item.href);
                            }}
                            className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-white/[0.06]"
                          >
                            <div>
                              <p className="text-sm text-white">{item.label}</p>
                              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{item.meta}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-500" />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href="/api/report" className={buttonVariants("secondary")}>
                      <span className="inline-flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        JSON del reporte
                      </span>
                    </Link>
                    <Link href="/" className={buttonVariants("ghost")}>
                      <span className="inline-flex items-center gap-2">
                        Volver a la portada
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <MobileNav />
              </div>
            </div>
          </header>
          <main className="flex-1 px-5 py-8 md:px-8 xl:px-10">
            <div className="dashboard-container">{children}</div>
          </main>
          <footer className="border-t border-white/10 px-5 py-4 md:px-8 xl:px-10">
            <div className="dashboard-container">
              <div className="flex items-center justify-end">
                <p className="text-sm text-slate-500">Designed to work with CRM, SAP and BI systems.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
