import Link from "next/link";
import { ArrowRight, Bot, ChartColumnIncreasing, MapPinned, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const pillars = [
  {
    icon: ChartColumnIncreasing,
    title: "Visibilidad ejecutiva unificada",
    text: "Ingresos, margen, marketing y distribucion integrados en una sola narrativa para direccion general."
  },
  {
    icon: MapPinned,
    title: "Expansion regional con criterio",
    text: "Detecta donde abrir cobertura, donde defender presencia y donde el margen no justifica mas presion."
  },
  {
    icon: Bot,
    title: "IA orientada a decisiones",
    text: "Convierte senales operativas y comerciales en recomendaciones accionables, no en dashboards decorativos."
  }
];

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-radial opacity-90" />
      <div className="relative mx-auto flex min-h-screen max-w-[1480px] flex-col justify-center px-6 py-16 md:px-10">
        <div className="grid items-center gap-10 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-accent">
              <Sparkles className="h-4 w-4" />
              Capa de inteligencia comercial para expansion rentable
            </div>
            <div className="space-y-6">
              <h1 className="font-display text-5xl font-semibold tracking-tight text-white md:text-7xl">
                Molina Growth Intelligence
              </h1>
              <p className="max-w-2xl text-balance text-lg leading-8 text-slate-300 md:text-xl">
                Plataforma demo de nivel consejo que integra senales de marketing, ventas, distribucion y margen para
                detectar oportunidades reales de crecimiento para una marca mexicana de alimentos con legado y ambicion
                nacional.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/overview" className={buttonVariants()}>
                <span className="inline-flex items-center gap-2">
                  Entrar al centro ejecutivo
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <Link href="/board-report" className={buttonVariants("secondary")}>
                Ver memo del consejo
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <Card key={pillar.title} className="surface-highlight border-white/10 bg-white/[0.04]">
                    <CardContent className="space-y-4 p-6">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="font-display text-xl text-white">{pillar.title}</h2>
                        <p className="text-sm leading-6 text-slate-300">{pillar.text}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="surface-highlight overflow-hidden border-white/10 bg-white/[0.05] p-8">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Pulso ejecutivo</p>
                  <h2 className="mt-2 font-display text-3xl text-white">Lo que cambia la conversacion</h2>
                </div>
                <div className="rounded-full bg-accent/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent">
                  Demo boardroom
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Expansion prioritaria", "Monterrey, Merida y Cancun concentran la mejor combinacion de demanda y margen."],
                  ["Riesgo inmediato", "Vainilla Cristalina pierde rentabilidad por presion promocional sostenida."],
                  ["Canal a escalar", "Food service y recetas digitales capturan mayor valor incremental."],
                  ["Siguiente accion", "Reasignar gasto tactico hacia creatividad premium y cobertura regional selectiva."]
                ].map(([title, text]) => (
                  <div key={title} className="rounded-3xl border border-white/10 bg-[#0A1021] p-5 transition duration-300 hover:-translate-y-1">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{text}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl border border-accent/15 bg-gradient-to-r from-accent/10 to-blue-400/10 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-accent">Posicionamiento</p>
                <p className="mt-3 text-base leading-7 text-slate-100">
                  Molina Growth Intelligence no reemplaza CRM ni ERP. Se monta por encima de los sistemas existentes
                  para dar lectura ejecutiva, priorizacion de expansion y claridad comercial semanal.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
