import {
  AlertItem,
  CampaignMetric,
  ChannelMixItem,
  DashboardData,
  DistributorMetric,
  OpportunityCard,
  ProductFamily,
  ProductMetric,
  RegionMetric
} from "@/lib/types";

const monthLabels = [
  "Abr 25",
  "May 25",
  "Jun 25",
  "Jul 25",
  "Ago 25",
  "Sep 25",
  "Oct 25",
  "Nov 25",
  "Dic 25",
  "Ene 26",
  "Feb 26",
  "Mar 26"
] as const;

const productBlueprints: Array<{
  family: ProductFamily;
  baseRevenue: number;
  baseMargin: number;
  growthBias: number;
  marginSlope: number;
  engagement: number;
  marginPotential: number;
  keyChannel: ProductMetric["keyChannel"];
}> = [
  {
    family: "Vainilla Natural",
    baseRevenue: 42200000,
    baseMargin: 40.8,
    growthBias: 13.4,
    marginSlope: 0.35,
    engagement: 86,
    marginPotential: 88,
    keyChannel: "Retail"
  },
  {
    family: "Extracto Natural",
    baseRevenue: 30800000,
    baseMargin: 42.1,
    growthBias: 10.2,
    marginSlope: 0.22,
    engagement: 81,
    marginPotential: 85,
    keyChannel: "Food Service"
  },
  {
    family: "Vainilla Cristalina",
    baseRevenue: 26800000,
    baseMargin: 34.4,
    growthBias: 4.8,
    marginSlope: -0.9,
    engagement: 69,
    marginPotential: 63,
    keyChannel: "Distribuidores"
  },
  {
    family: "Cocoa",
    baseRevenue: 19400000,
    baseMargin: 32.8,
    growthBias: 12.6,
    marginSlope: 0.5,
    engagement: 73,
    marginPotential: 76,
    keyChannel: "Modern Trade"
  },
  {
    family: "Cacao en Polvo",
    baseRevenue: 17200000,
    baseMargin: 31.6,
    growthBias: 9.7,
    marginSlope: 0.15,
    engagement: 74,
    marginPotential: 72,
    keyChannel: "E-commerce"
  },
  {
    family: "Azucar Glass",
    baseRevenue: 15000000,
    baseMargin: 27.2,
    growthBias: 3.9,
    marginSlope: -0.55,
    engagement: 58,
    marginPotential: 49,
    keyChannel: "Retail"
  },
  {
    family: "Azucar Glass con Vainilla",
    baseRevenue: 13400000,
    baseMargin: 30.4,
    growthBias: 8.5,
    marginSlope: 0.4,
    engagement: 77,
    marginPotential: 80,
    keyChannel: "Modern Trade"
  },
  {
    family: "Salsa de Soya",
    baseRevenue: 11800000,
    baseMargin: 24.6,
    growthBias: 6.3,
    marginSlope: -0.35,
    engagement: 56,
    marginPotential: 44,
    keyChannel: "Distribuidores"
  }
];

const regionBlueprints = [
  {
    region: "CDMX",
    demandIndex: 94,
    penetrationIndex: 76,
    marginPotential: 84,
    stockRisk: 22,
    contentEngagement: 88,
    growth: 10.6,
    distributorHealth: 85,
    dominantChannel: "Modern Trade"
  },
  {
    region: "Guadalajara",
    demandIndex: 87,
    penetrationIndex: 61,
    marginPotential: 79,
    stockRisk: 26,
    contentEngagement: 83,
    growth: 12.8,
    distributorHealth: 78,
    dominantChannel: "Retail"
  },
  {
    region: "Monterrey",
    demandIndex: 91,
    penetrationIndex: 58,
    marginPotential: 86,
    stockRisk: 31,
    contentEngagement: 76,
    growth: 13.2,
    distributorHealth: 74,
    dominantChannel: "Food Service"
  },
  {
    region: "Queretaro",
    demandIndex: 82,
    penetrationIndex: 44,
    marginPotential: 81,
    stockRisk: 20,
    contentEngagement: 74,
    growth: 14.6,
    distributorHealth: 80,
    dominantChannel: "Distribuidores"
  },
  {
    region: "Puebla",
    demandIndex: 77,
    penetrationIndex: 49,
    marginPotential: 74,
    stockRisk: 28,
    contentEngagement: 71,
    growth: 11.4,
    distributorHealth: 76,
    dominantChannel: "Retail"
  },
  {
    region: "Leon",
    demandIndex: 73,
    penetrationIndex: 41,
    marginPotential: 78,
    stockRisk: 24,
    contentEngagement: 68,
    growth: 12.1,
    distributorHealth: 73,
    dominantChannel: "Distribuidores"
  },
  {
    region: "Merida",
    demandIndex: 79,
    penetrationIndex: 38,
    marginPotential: 83,
    stockRisk: 19,
    contentEngagement: 82,
    growth: 15.8,
    distributorHealth: 77,
    dominantChannel: "E-commerce"
  },
  {
    region: "Tijuana",
    demandIndex: 76,
    penetrationIndex: 47,
    marginPotential: 68,
    stockRisk: 36,
    contentEngagement: 64,
    growth: 9.5,
    distributorHealth: 69,
    dominantChannel: "Food Service"
  },
  {
    region: "Cancun",
    demandIndex: 84,
    penetrationIndex: 35,
    marginPotential: 87,
    stockRisk: 27,
    contentEngagement: 85,
    growth: 16.2,
    distributorHealth: 71,
    dominantChannel: "Food Service"
  }
] as const;

const campaignBlueprints = [
  {
    id: "cmp-recetas",
    name: "Recetas que convierten",
    type: "Recetas",
    channel: "E-commerce",
    spend: 2850000,
    attributedRevenue: 16300000,
    cac: 142,
    engagement: 87,
    creativeTheme: "Reposteria casera premium"
  },
  {
    id: "cmp-estacional",
    name: "Temporada navidena extendida",
    type: "Estacional",
    channel: "Retail",
    spend: 3350000,
    attributedRevenue: 14900000,
    cac: 189,
    engagement: 75,
    creativeTheme: "Postres de celebracion"
  },
  {
    id: "cmp-premium",
    name: "Linea natural premium",
    type: "Premium",
    channel: "Modern Trade",
    spend: 2580000,
    attributedRevenue: 15500000,
    cac: 164,
    engagement: 81,
    creativeTheme: "Origen y calidad culinaria"
  },
  {
    id: "cmp-producto",
    name: "Rotacion hero SKU",
    type: "Producto",
    channel: "Distribuidores",
    spend: 1820000,
    attributedRevenue: 7900000,
    cac: 211,
    engagement: 61,
    creativeTheme: "Impulso tactico a inventario"
  },
  {
    id: "cmp-b2b",
    name: "Prospeccion food service",
    type: "Adquisicion B2B",
    channel: "Food Service",
    spend: 2210000,
    attributedRevenue: 11800000,
    cac: 246,
    engagement: 72,
    creativeTheme: "Soluciones para cocina profesional"
  }
] as const;

const channelMix: ChannelMixItem[] = [
  { channel: "Retail", value: 31 },
  { channel: "Distribuidores", value: 23 },
  { channel: "Food Service", value: 18 },
  { channel: "E-commerce", value: 11 },
  { channel: "Modern Trade", value: 17 }
];

const seasonality = [0.92, 0.95, 0.97, 1, 1.04, 1.07, 1.12, 1.18, 1.21, 1.05, 1.02, 1.09];

function channelLabel(channel: ProductMetric["keyChannel"]) {
  const labels: Record<ProductMetric["keyChannel"], string> = {
    Retail: "Autoservicio",
    Distribuidores: "Distribuidores",
    "Food Service": "Food service",
    "E-commerce": "Comercio electronico",
    "Modern Trade": "Trade moderno"
  };

  return labels[channel];
}

function computeMarginPressure(points: Array<{ margin: number }>) {
  if (points.length < 3) return false;
  const last = points.slice(-3);
  return last[0].margin > last[1].margin && last[1].margin > last[2].margin;
}

function productRecommendation(family: ProductFamily, grossMargin: number, growth: number, keyChannel: ProductMetric["keyChannel"]) {
  if (family === "Vainilla Natural" || family === "Extracto Natural") {
    return "Expandir mezcla premium en food service y trade moderno con narrativa de origen natural.";
  }
  if (grossMargin < 29) {
    return "Reducir presion promocional y mover el mix hacia presentaciones de mayor valor por kilo.";
  }
  if (growth > 10) {
    return `Escalar cobertura en ${channelLabel(keyChannel)} y reforzar contenido de uso culinario para acelerar rotacion.`;
  }
  return "Mantener cobertura selectiva y optimizar exhibicion con foco en contribucion marginal.";
}

const products: ProductMetric[] = productBlueprints.map((product, index) => {
  const recentRevenue = monthLabels.map((month, monthIndex) => {
    const performanceBoost = 1 + product.growthBias / 100 * (monthIndex / 11);
    const revenue = Math.round(product.baseRevenue * seasonality[monthIndex] * performanceBoost * (1 + (index % 3) * 0.01));
    return { month, revenue };
  });

  const monthlyMarginTrend = monthLabels.slice(-6).map((month, idx) => {
    const margin =
      product.baseMargin +
      product.marginSlope * idx +
      (index % 2 === 0 ? 0.18 * idx : -0.05 * idx) +
      (idx === 4 ? -0.2 : 0);

    return {
      month,
      margin: Number(margin.toFixed(1))
    };
  });

  const ytdRevenue = recentRevenue.reduce((sum, point) => sum + point.revenue, 0);
  const growth = Number((product.growthBias + index * 0.4).toFixed(1));
  const grossMargin = Number((monthlyMarginTrend.reduce((sum, point) => sum + point.margin, 0) / monthlyMarginTrend.length).toFixed(1));
  const contribution = 0;
  const demandGrowth = Number((growth + 3.2).toFixed(1));
  const salesIndex = Math.round(68 + index * 3.7 + growth * 0.8);
  const marginPressure = computeMarginPressure(monthlyMarginTrend);
  const underLeveraged = grossMargin >= 31 && growth <= 9.8;

  return {
    family: product.family,
    ytdRevenue,
    growth,
    grossMargin,
    contribution,
    demandGrowth,
    contentEngagement: product.engagement,
    marginPotential: product.marginPotential,
    salesIndex,
    monthlyMarginTrend,
    recentRevenue: recentRevenue.slice(-6),
    marginPressure,
    underLeveraged,
    recommendedAction: productRecommendation(product.family, grossMargin, growth, product.keyChannel),
    keyChannel: product.keyChannel
  };
});

const totalRevenue = products.reduce((sum, product) => sum + product.ytdRevenue, 0);
products.forEach((product) => {
  product.contribution = Number(((product.ytdRevenue / totalRevenue) * 100).toFixed(1));
});

function scoreRegion(input: {
  growth: number;
  contentEngagement: number;
  marginPotential: number;
  penetrationIndex: number;
  stockRisk: number;
}) {
  const demandGrowth = Math.min(input.growth * 5.8, 100);
  const lowPenetration = 100 - input.penetrationIndex;
  const lowStockRisk = 100 - input.stockRisk;
  return Math.round(
    demandGrowth * 0.27 +
      input.contentEngagement * 0.18 +
      input.marginPotential * 0.24 +
      lowPenetration * 0.18 +
      lowStockRisk * 0.13
  );
}

function segmentRegion(opportunityScore: number, penetrationIndex: number, stockRisk: number) {
  if (opportunityScore >= 78 && penetrationIndex >= 58) return "Fuerte / Defender";
  if (opportunityScore >= 75 && penetrationIndex < 58) return "Alto potencial / Baja penetracion";
  if (stockRisk >= 30) return "En riesgo / Presion marginal";
  return "Saturado / Optimizar";
}

function regionRecommendation(region: string, dominantChannel: string, segment: RegionMetric["segment"]) {
  if (segment === "Alto potencial / Baja penetracion") {
    return `Acelerar apertura regional en ${region} con cobertura via ${channelLabel(dominantChannel as ProductMetric["keyChannel"])} y contenido de conversion local.`;
  }
  if (segment === "En riesgo / Presion marginal") {
    return `Normalizar inventario y reenfocar el surtido en ${region} antes de elevar inversion comercial adicional.`;
  }
  if (segment === "Fuerte / Defender") {
    return `Defender liderazgo en ${region} con portafolio premium y acuerdos de visibilidad por canal.`;
  }
  return `Optimizar el mix comercial en ${region} y reasignar presupuesto hacia subzonas con mejor margen incremental.`;
}

const regions: RegionMetric[] = regionBlueprints.map((region, index) => {
  const revenue = Math.round(11400000 + region.demandIndex * 138000 + (8 - index) * 420000);
  const opportunityScore = scoreRegion(region);
  const segment = segmentRegion(opportunityScore, region.penetrationIndex, region.stockRisk);

  return {
    region: region.region,
    revenue,
    growth: region.growth,
    demandIndex: region.demandIndex,
    penetrationIndex: region.penetrationIndex,
    marginPotential: region.marginPotential,
    stockRisk: region.stockRisk,
    contentEngagement: region.contentEngagement,
    opportunityScore,
    distributorHealth: region.distributorHealth,
    dominantChannel: region.dominantChannel,
    segment,
    recommendation: regionRecommendation(region.region, region.dominantChannel, segment)
  };
});

const campaigns: CampaignMetric[] = campaignBlueprints.map((campaign, index) => {
  const roas = Number((campaign.attributedRevenue / campaign.spend).toFixed(1));
  const efficiencyIndex = Math.round(roas * 16 + campaign.engagement * 0.55 - campaign.cac * 0.08 + index * 2.5);

  return {
    ...campaign,
    roas,
    efficiencyIndex,
    recommendation:
      roas >= 5
        ? "Escalar presupuesto incremental con foco en creatividad derivada."
        : "Optimizar mensaje, frecuencia y segmentacion antes de ampliar inversion."
  };
});

const distributors: DistributorMetric[] = [
  {
    name: "Distribuciones Centro",
    region: "CDMX",
    coverage: 88,
    rotation: 81,
    serviceLevel: 93,
    stockoutRisk: 14,
    strategicStatus: "Cobertura robusta y lista para defender premium."
  },
  {
    name: "Occidente Select",
    region: "Guadalajara",
    coverage: 71,
    rotation: 74,
    serviceLevel: 86,
    stockoutRisk: 24,
    strategicStatus: "Capacidad para acelerar apertura con apoyo promocional."
  },
  {
    name: "Norte Food Hub",
    region: "Monterrey",
    coverage: 67,
    rotation: 79,
    serviceLevel: 82,
    stockoutRisk: 29,
    strategicStatus: "Buen encaje para food service, requiere disciplina de inventario."
  },
  {
    name: "Sureste Expansion",
    region: "Cancun",
    coverage: 54,
    rotation: 72,
    serviceLevel: 78,
    stockoutRisk: 33,
    strategicStatus: "Alta oportunidad con cobertura aun insuficiente."
  }
];

const monthlyRevenue = monthLabels.map((month, index) => {
  const aggregate = products.reduce((sum, product) => sum + Math.round((product.ytdRevenue / 12) * seasonality[index]), 0);
  const grossMargin =
    products.reduce((sum, product) => sum + product.monthlyMarginTrend[index % product.monthlyMarginTrend.length].margin, 0) /
    products.length;
  const marketingEfficiency = campaigns.reduce((sum, campaign) => sum + campaign.efficiencyIndex, 0) / campaigns.length + index * 0.8;

  return {
    month,
    revenue: aggregate,
    grossMargin: Number(grossMargin.toFixed(1)),
    marketingEfficiency: Number(marketingEfficiency.toFixed(0))
  };
});

const alerts: AlertItem[] = [
  {
    title: "Presion marginal en Vainilla Cristalina",
    detail: "Tres cortes consecutivos de margen sugieren remezclar promociones y gramajes.",
    level: "Alta"
  },
  {
    title: "Cancun supera demanda planificada",
    detail: "La combinacion de turismo y food service presiona inventario de linea natural.",
    level: "Alta"
  },
  {
    title: "Campana de impulso tactico por debajo del benchmark",
    detail: "ROAS inferior a 4.5x; conviene redistribuir parte del gasto hacia contenido de recetas.",
    level: "Media"
  },
  {
    title: "CDMX estable con cobertura defensiva",
    detail: "La region mantiene alta rentabilidad y no requiere cambios tacticos urgentes.",
    level: "Controlada"
  }
];

const recommendedActions = [
  "Expandir Vainilla Natural y Extracto Natural en Monterrey y Cancun con propuesta premium para food service.",
  "Reasignar 12% del gasto de campanas tacticas hacia recetas de alta conversion y creatividad premium.",
  "Abrir sprint comercial en Queretaro, Merida y Leon para elevar penetracion sin comprometer margen.",
  "Reducir intensidad promocional en Azucar Glass y Vainilla Cristalina; priorizar paquetes con mejor contribucion."
];

const topSkus = [
  { name: "Vainilla Natural 250 ml", revenue: 18200000, growth: 15.1 },
  { name: "Extracto Natural Chef 1 L", revenue: 14600000, growth: 14.2 },
  { name: "Cocoa Premium 400 g", revenue: 9800000, growth: 13.6 },
  { name: "Azucar Glass con Vainilla 500 g", revenue: 8300000, growth: 11.9 }
];

const creativeThemes = [
  { theme: "Origen natural y calidad repostera", lift: 28 },
  { theme: "Recetas de temporada con uso multiproducto", lift: 23 },
  { theme: "Formato profesional para cocina y panaderia", lift: 18 },
  { theme: "Conveniencia premium para retail moderno", lift: 15 }
];

const opportunities: OpportunityCard[] = [
  {
    id: "opp-1",
    title: "Escalar linea natural en Monterrey",
    description: "Food service muestra demanda acelerada, alta disposicion a ticket premium y baja penetracion relativa.",
    type: "Oportunidad",
    confidence: 92,
    impactRange: "$6.5M - $8.1M",
    product: "Extracto Natural",
    region: "Monterrey",
    channel: "Food Service",
    score: 90,
    action: "Desplegar oferta premium con demostracion culinaria y cobertura selectiva en cadenas independientes.",
    rationale: [
      "Demanda regional por encima de 90 puntos.",
      "Penetracion actual aun por debajo del potencial de canal.",
      "Margen incremental superior al promedio del portafolio."
    ]
  },
  {
    id: "opp-2",
    title: "Acelerar Merida con contenido de recetas",
    description: "La ciudad combina engagement digital alto, bajo nivel de penetracion y riesgo logístico contenido.",
    type: "Oportunidad",
    confidence: 89,
    impactRange: "$4.2M - $5.4M",
    product: "Vainilla Natural",
    region: "Merida",
    channel: "E-commerce",
    score: 87,
    action: "Conectar campañas de recetas con surtido hero y reposicion automatizada para marketplaces regionales.",
    rationale: [
      "Engagement de contenido por arriba de 80.",
      "Stock risk por debajo de 20.",
      "Baja penetracion habilita expansion eficiente."
    ]
  },
  {
    id: "opp-3",
    title: "Premiumizar modern trade en Guadalajara",
    description: "Cocoa y Azucar Glass con Vainilla presentan margen adicional disponible con mejor storytelling.",
    type: "Oportunidad",
    confidence: 84,
    impactRange: "$3.8M - $4.6M",
    product: "Azucar Glass con Vainilla",
    region: "Guadalajara",
    channel: "Modern Trade",
    score: 81,
    action: "Migrar el anaquel a una propuesta de reposteria premium con bundles estacionales.",
    rationale: [
      "Mix de canal favorable para ticket superior.",
      "Margen potencial de 79 puntos.",
      "Alta afinidad a creatividad estacional."
    ]
  },
  {
    id: "risk-1",
    title: "Vainilla Cristalina pierde rentabilidad",
    description: "El producto sostiene volumen, pero la pendiente de margen sugiere compresion por promociones y costo.",
    type: "Riesgo",
    confidence: 86,
    impactRange: "-$2.4M - -$1.8M",
    product: "Vainilla Cristalina",
    region: "Puebla",
    channel: "Distribuidores",
    score: 74,
    action: "Ajustar descuentos por canal y revisar presentaciones con mayor presion de costo.",
    rationale: [
      "Dos periodos consecutivos de deterioro marginal.",
      "Canal sensible a promociones de precio.",
      "Contribucion relevante que justifica intervencion inmediata."
    ]
  },
  {
    id: "risk-2",
    title: "Cobertura insuficiente en Cancun",
    description: "El potencial food service es alto, pero el nivel actual de cobertura puede provocar quiebres de inventario.",
    type: "Riesgo",
    confidence: 83,
    impactRange: "-$1.7M - -$1.1M",
    product: "Vainilla Natural",
    region: "Cancun",
    channel: "Food Service",
    score: 72,
    action: "Elevar frecuencia de abastecimiento y priorizar SKUs de alta rotacion para clientes clave.",
    rationale: [
      "Oportunidad comercial superior a 80 puntos.",
      "Cobertura del distribuidor aun por debajo de 60.",
      "Demanda del canal acelera mas rapido que la oferta."
    ]
  }
];

const kpis = {
  revenueYtd: totalRevenue,
  growth: Number((products.reduce((sum, product) => sum + product.growth, 0) / products.length).toFixed(1)),
  grossMargin: Number((products.reduce((sum, product) => sum + product.grossMargin, 0) / products.length).toFixed(1)),
  marketingEfficiency: Math.round(campaigns.reduce((sum, campaign) => sum + campaign.efficiencyIndex, 0) / campaigns.length)
};

export const dashboardData: DashboardData = {
  months: monthlyRevenue,
  products,
  regions,
  campaigns,
  channelMix,
  distributors,
  topSkus,
  kpis,
  executiveBrief: {
    title: "Resumen ejecutivo semanal",
    summary:
      "Molina Growth Intelligence identifica una ventana clara para acelerar expansion rentable en ciudades con alta demanda culinaria y baja penetracion relativa. La mejor combinacion de crecimiento y margen proviene de la linea natural, mientras que ciertas familias defensivas requieren disciplina promocional.",
    bullets: [
      "Monterrey, Merida y Cancun concentran el mayor retorno incremental esperado en los proximos 90 dias.",
      "Recetas y creatividad premium superan consistentemente a las campañas tacticas en eficiencia comercial.",
      "La compresion marginal en Vainilla Cristalina y Azucar Glass requiere accion correctiva inmediata."
    ]
  },
  alerts,
  recommendedActions,
  opportunities,
  creativeThemes
};

export const topRegionsByOpportunity = [...regions].sort((a, b) => b.opportunityScore - a.opportunityScore).slice(0, 5);
export const topProductsByRevenue = [...products].sort((a, b) => b.ytdRevenue - a.ytdRevenue);
