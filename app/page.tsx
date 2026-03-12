import Link from "next/link";
import { ArrowRight, Bot, ChartColumnIncreasing, DatabaseZap, MapPinned, Sparkles } from "lucide-react";

import { PrototypeNote } from "@/components/common/prototype-note";
import { SourceChip } from "@/components/common/source-chip";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardData } from "@/lib/mock-data";

const pillars = [
  {
    icon: ChartColumnIncreasing,
    title: "Visibilidad ejecutiva unificada",
    text: "Conecta fuentes comerciales dispersas y las convierte en una lectura estrategica para direccion general."
  },
  {
    icon: MapPinned,
    title: "Expansion regional con criterio",
    text: "Detecta donde abrir cobertura, donde defender presencia y donde el margen no justifica mas presion."
  },
  {
    icon: Bot,
    title: "IA orientada a decisiones",
    text: "Prioriza oportunidades, riesgos de margen y decisiones comerciales sin competir con CRM, SAP ni BI."
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
              AI Layer for Commercial Intelligence
            </div>
            <div className="space-y-6">
              <h1 className="font-display text-5xl font-semibold tracking-tight text-white md:text-7xl">
                Molina Growth Intelligence
              </h1>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400 md:text-base">
                AI Layer for Commercial Intelligence
              </p>
              <p className="max-w-2xl text-balance text-lg leading-8 text-slate-300 md:text-xl">
                Conecta CRM, SAP y fuentes de marketing para detectar oportunidades comerciales, riesgos de margen y
                prioridades de expansion antes de que aparezcan en reportes tardios.
              </p>
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-start gap-3">
                  <DatabaseZap className="mt-1 h-5 w-5 text-accent" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white">{dashboardData.enterprisePositioning.statement}</p>
                    <p className="text-sm leading-6 text-slate-300">{dashboardData.enterprisePositioning.supporting}</p>
                  </div>
                </div>
              </div>
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
            <div className="grid gap-3 sm:grid-cols-3">
              {dashboardData.connectedSources.slice(0, 3).map((source) => (
                <SourceChip key={source.name} name={source.name} category={source.category} />
              ))}
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
                  <h2 className="mt-2 font-display text-3xl text-white">La capa que hace mas inteligente la infraestructura actual</h2>
                </div>
                <div className="rounded-full bg-accent/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent">
                  Demo boardroom
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Expansion prioritaria", "Monterrey, Queretaro y Cancun concentran la mejor combinacion de demanda, baja penetracion y margen."],
                  ["Riesgo inmediato", "Vainilla Cristalina pierde rentabilidad y exige lectura anticipada antes del siguiente cierre."],
                  ["Integracion existente", "CRM, SAP, BI y campanas digitales ya aportan las senales que el motor necesita para priorizar."],
                  ["Siguiente accion", "Reasignar foco comercial hacia expansion selectiva y creatividad premium respaldada por datos."]
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
                  Molina Growth Intelligence no reemplaza CRM, SAP ni BI. Se integra por encima de la infraestructura
                  comercial y analitica existente para conectar senales del negocio y acelerar decisiones de direccion.
                </p>
              </div>
              <PrototypeNote />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
