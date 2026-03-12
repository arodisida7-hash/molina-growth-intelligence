export type ProductFamily =
  | "Vainilla Natural"
  | "Extracto Natural"
  | "Vainilla Cristalina"
  | "Cocoa"
  | "Cacao en Polvo"
  | "Azucar Glass"
  | "Azucar Glass con Vainilla"
  | "Salsa de Soya";

export type RegionName =
  | "CDMX"
  | "Guadalajara"
  | "Monterrey"
  | "Queretaro"
  | "Puebla"
  | "Leon"
  | "Merida"
  | "Tijuana"
  | "Cancun";

export type ChannelName =
  | "Retail"
  | "Distribuidores"
  | "Food Service"
  | "E-commerce"
  | "Modern Trade";

export type CampaignType =
  | "Recetas"
  | "Estacional"
  | "Premium"
  | "Producto"
  | "Adquisicion B2B";

export type PriorityLevel = "Alta" | "Media" | "Controlada";

export interface MonthlyPoint {
  month: string;
  revenue: number;
  grossMargin: number;
  marketingEfficiency: number;
}

export interface ChannelMixItem {
  channel: ChannelName;
  value: number;
}

export interface ProductMetric {
  family: ProductFamily;
  ytdRevenue: number;
  growth: number;
  grossMargin: number;
  contribution: number;
  demandGrowth: number;
  contentEngagement: number;
  marginPotential: number;
  salesIndex: number;
  monthlyMarginTrend: Array<{ month: string; margin: number }>;
  recentRevenue: Array<{ month: string; revenue: number }>;
  marginPressure: boolean;
  underLeveraged: boolean;
  recommendedAction: string;
  keyChannel: ChannelName;
}

export interface RegionMetric {
  region: RegionName;
  revenue: number;
  growth: number;
  demandIndex: number;
  penetrationIndex: number;
  marginPotential: number;
  stockRisk: number;
  contentEngagement: number;
  opportunityScore: number;
  distributorHealth: number;
  dominantChannel: ChannelName;
  segment:
    | "Fuerte / Defender"
    | "Alto potencial / Baja penetracion"
    | "En riesgo / Presion marginal"
    | "Saturado / Optimizar";
  recommendation: string;
}

export interface CampaignMetric {
  id: string;
  name: string;
  type: CampaignType;
  channel: ChannelName;
  spend: number;
  attributedRevenue: number;
  roas: number;
  cac: number;
  engagement: number;
  efficiencyIndex: number;
  creativeTheme: string;
  recommendation: string;
}

export interface DistributorMetric {
  name: string;
  region: RegionName;
  coverage: number;
  rotation: number;
  serviceLevel: number;
  stockoutRisk: number;
  strategicStatus: string;
}

export interface OpportunityCard {
  id: string;
  title: string;
  description: string;
  type: "Oportunidad" | "Riesgo";
  confidence: number;
  impactRange: string;
  product: ProductFamily;
  region: RegionName;
  channel: ChannelName;
  score: number;
  action: string;
  rationale: string[];
}

export interface ExecutiveBrief {
  title: string;
  summary: string;
  bullets: string[];
}

export interface AlertItem {
  title: string;
  detail: string;
  level: PriorityLevel;
}

export interface ConnectedSource {
  name: string;
  category: string;
}

export interface StrategicOpportunitySummary {
  region: RegionName;
  product: ProductFamily | "Linea Natural";
  hypothesis: string;
}

export interface ImpactPotential {
  salesLift: string;
  marginLift: string;
  marketingLift: string;
  note: string;
}

export interface DashboardData {
  months: MonthlyPoint[];
  products: ProductMetric[];
  regions: RegionMetric[];
  campaigns: CampaignMetric[];
  channelMix: ChannelMixItem[];
  distributors: DistributorMetric[];
  topSkus: Array<{ name: string; revenue: number; growth: number }>;
  kpis: {
    revenueYtd: number;
    growth: number;
    grossMargin: number;
    marketingEfficiency: number;
  };
  executiveBrief: ExecutiveBrief;
  alerts: AlertItem[];
  recommendedActions: string[];
  opportunities: OpportunityCard[];
  creativeThemes: Array<{ theme: string; lift: number }>;
  connectedSources: ConnectedSource[];
  strategicOpportunities: StrategicOpportunitySummary[];
  impactPotential: ImpactPotential;
  enterprisePositioning: {
    label: string;
    statement: string;
    supporting: string;
  };
  prototypeNote: {
    label: string;
    statement: string;
  };
}
