export type SectorId =
  | "ai-infrastructure"
  | "semiconductors"
  | "optical-connectivity"
  | "robotics"
  | "defense-drones"
  | "rare-earth"
  | "power-cooling"
  | "undervalued-growth";

export interface Sector {
  id: SectorId;
  name: string;
  shortName: string;
  description: string;
  whyItMatters: string; // beginner-friendly explanation
  bottleneck: string;
  tailwinds: string[];
  headwinds: string[];
  color: string;
  icon: string;
  isConsensus?: boolean;       // true = crowded / already a consensus trade
  bottleneckTickers?: string[]; // named companies that are the actual bottleneck
}

export type RiskLevel = "low" | "medium" | "high" | "speculative";
export type Conviction = 1 | 2 | 3 | 4 | 5;
export type Timeframe = "0-3m" | "3-12m" | "1-3y" | "3y+";

export interface Stock {
  ticker: string;
  name: string;
  sector: SectorId;
  description: string;
  thesis: string; // why you own/watch it
  beginnerExplain: string; // plain-English explanation
  riskLevel: RiskLevel;
  conviction: Conviction;
  timeframe: Timeframe;
  tags: string[];
  notes?: string;
  addedDate: string; // ISO date
  targetPrice?: number;
  currentPriceNote?: string;
  // Bottleneck research fields
  bearCase?: string;
  killSwitch?: string;
  lastVerifiedPrice?: number; // stale — check lastVerifiedDate before using
  lastVerifiedDate?: string;  // ISO date of price observation
}

export type CatalystStatus = "upcoming" | "in-progress" | "completed" | "missed";
export type CatalystImpact = "low" | "medium" | "high" | "transformative";

export interface Catalyst {
  id: string;
  title: string;
  description: string;
  sectors: SectorId[];
  relatedTickers: string[];
  expectedDate: string; // ISO date or "Q3 2025" style
  status: CatalystStatus;
  impact: CatalystImpact;
  notes?: string;
  sourceUrl?: string;
}

export type RiskCategory =
  | "macro"
  | "geopolitical"
  | "regulatory"
  | "technology"
  | "valuation"
  | "liquidity"
  | "execution";

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: RiskCategory;
  severity: RiskLevel;
  affectedSectors: SectorId[];
  mitigations: string[];
  probability: "low" | "medium" | "high";
}

export type AllocationTier = "core" | "tactical" | "speculative";

export interface PortfolioPosition {
  ticker: string;
  tier: AllocationTier;
  suggestedAllocation: number; // percent
  rationale: string;
  entryStrategy: string;
  exitTriggers: string[];
}

export interface PortfolioStructure {
  name: string;
  description: string;
  riskProfile: "conservative" | "moderate" | "aggressive";
  positions: PortfolioPosition[];
  cashReserve: number; // percent
  rebalanceFrequency: string;
  notes: string;
}

export interface PriceSnapshot {
  ticker: string;
  price: number;
  weekHigh52: number;
  weekLow52: number;
  marketCap: number;
  avgDailyVolumeDollars: number;
  peRatioTrailing: number | null;
  lastRefreshedAt: string; // ISO datetime
}

export type PriceRefreshStatus =
  | { ticker: string; status: "ok"; snapshot: PriceSnapshot }
  | { ticker: string; status: "failed"; error: string };

export interface WeeklyReport {
  id: string;
  weekOf: string; // ISO date of Monday
  generatedAt: string; // ISO datetime
  summary: string;
  sectorUpdates: { sector: SectorId; update: string }[];
  topCatalysts: string[];
  riskAlerts: string[];
  actionItems: string[];
  rawContent?: string;
}

export interface ResearchNote {
  id: string;
  title: string;
  content: string;
  sectors: SectorId[];
  tickers: string[];
  createdAt: string;
  tags: string[];
}
