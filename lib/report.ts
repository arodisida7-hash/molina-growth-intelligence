import { dashboardData, topRegionsByOpportunity } from "@/lib/mock-data";
import { OpportunityCard } from "@/lib/types";

export function generateBoardReport() {
  const topOpportunities = dashboardData.opportunities.filter((item) => item.type === "Oportunidad").slice(0, 3);
  const topRisks = dashboardData.opportunities.filter((item) => item.type === "Riesgo").slice(0, 2);
  const suggestedActions = dashboardData.recommendedActions.slice(0, 4);

  const strategicExperiment =
    "Lanzar un piloto de 8 semanas en Monterrey y Cancun que combine degustacion B2B, contenido de recetas premium y surtido hero para medir uplift de ticket y rotacion.";

  const executiveSummary =
    `Durante la semana del 11 de marzo de 2026, la plataforma confirma que la expansion mas rentable se concentra en ${topRegionsByOpportunity
      .slice(0, 3)
      .map((region) => region.region)
      .join(", ")}. La linea natural sostiene el mejor balance entre crecimiento y margen, mientras que Vainilla Cristalina y Azucar Glass requieren contencion promocional para proteger contribucion. La recomendacion ejecutiva es reasignar inversion desde iniciativas tacticas de menor ROAS hacia cobertura regional y creatividad de mayor valor percibido.`;

  return {
    generatedAt: "2026-03-11T09:00:00-06:00",
    topOpportunities,
    topRisks,
    suggestedActions,
    strategicExperiment,
    executiveSummary
  };
}

export function generateActionPlan(opportunities: OpportunityCard[]) {
  const selected = opportunities.slice(0, 3);

  return [
    "Semana 1: validar capacidad de inventario y coverage plan por region prioritaria.",
    `Semana 2: activar narrativa comercial para ${selected.map((item) => item.product).join(", ")} con foco en margen incremental.`,
    `Semana 3: ejecutar despliegue coordinado en ${selected.map((item) => item.region).join(" y ")} con seguimiento de sell-out y cobertura.`,
    "Semana 4: revisar uplift real, ajustar surtido y formalizar la siguiente ola de expansion."
  ];
}
