"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { Download, FileText, Lightbulb, ShieldAlert, Trophy } from "lucide-react";

import { TypingSummary } from "@/components/board/typing-summary";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateBoardReport } from "@/lib/report";

const report = generateBoardReport();

export function BoardReportPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Reporte de Consejo"
        title="Memo semanal"
        description="Lectura ejecutiva lista para direccion, con oportunidades, riesgos y acciones sugeridas."
        aside={
          <Link href="/api/report" className={buttonVariants("secondary")}>
            <span className="inline-flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar demo
            </span>
          </Link>
        }
      />

      <Card className="surface-highlight overflow-hidden border-white/10 bg-gradient-to-br from-accent/10 via-white/[0.05] to-blue-400/10 shadow-glow">
        <CardHeader className="border-b border-white/10 pb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent">
                <FileText className="h-4 w-4" />
                Executive Weekly Brief
              </div>
              <CardTitle className="text-3xl">Resumen listo para consejo</CardTitle>
              <p className="max-w-2xl text-sm text-slate-200">Una sola lectura para alinear expansion, margen y riesgos relevantes.</p>
            </div>
            <Badge variant="accent">Corte semanal</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <TypingSummary text={report.executiveSummary} />
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-2">
        <Panel
          icon={Trophy}
          label="3 oportunidades clave"
          items={report.topOpportunities.map((item) => `${item.title}. ${item.action}`)}
        />
        <Panel
          icon={ShieldAlert}
          label="2 riesgos clave"
          items={report.topRisks.map((item) => `${item.title}. ${item.action}`)}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader>
            <CardTitle>Acciones sugeridas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.suggestedActions.map((action, index) => (
              <div key={action} className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-accent">Accion {index + 1}</p>
                <p className="mt-2 text-sm leading-7 text-slate-200">{action}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="surface-highlight border-white/10 bg-gradient-to-br from-accent/10 to-blue-400/10">
          <CardHeader>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent">
              <Lightbulb className="h-4 w-4" />
              Experimento estrategico
            </div>
            <CardTitle className="text-3xl">Una apuesta medible de 8 semanas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-8 text-slate-100">{report.strategicExperiment}</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Panel({
  icon: Icon,
  label,
  items
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  items: string[];
}) {
  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
          <Icon className="h-4 w-4" />
          {label}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-[#09101F] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Punto {index + 1}</p>
            <p className="mt-2 text-sm leading-7 text-slate-200">{item}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
