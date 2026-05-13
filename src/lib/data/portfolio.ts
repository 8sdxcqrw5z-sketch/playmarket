import type { PortfolioStructure } from "@/lib/types";

export const PORTFOLIO_STRUCTURES: PortfolioStructure[] = [
  {
    name: "AI Infrastructure Core",
    description: "Concentrated portfolio for investors who believe we are in a multi-year AI infrastructure buildout. Higher risk, higher potential return.",
    riskProfile: "aggressive",
    cashReserve: 10,
    rebalanceFrequency: "Quarterly or after major earnings",
    notes: "This portfolio has high correlation — when AI sentiment turns, most positions will move together. Size accordingly.",
    positions: [
      { ticker: "NVDA", tier: "core", suggestedAllocation: 20, rationale: "Irreplaceable monopoly on AI accelerators", entryStrategy: "Buy on 15%+ pullbacks from highs", exitTriggers: ["AMD/custom ASIC market share exceeds 30%", "Revenue growth decelerates below 30% YoY"] },
      { ticker: "TSM", tier: "core", suggestedAllocation: 15, rationale: "Makes everyone's chips; lower risk than pure-play AI", entryStrategy: "Scale in over 3 months", exitTriggers: ["Taiwan geopolitical escalation", "US fab alternatives at scale"] },
      { ticker: "CEG", tier: "core", suggestedAllocation: 10, rationale: "Nuclear power for AI is a decade-long secular trend", entryStrategy: "Buy the dips on nuclear narrative uncertainty", exitTriggers: ["NRC regulatory setback", "Hyperscaler cancels PPA"] },
      { ticker: "META", tier: "core", suggestedAllocation: 10, rationale: "Best AI monetization story outside the picks-and-shovels", entryStrategy: "Add on macro selloffs", exitTriggers: ["Ad revenue growth below 10% YoY", "Regulatory break-up risk materializes"] },
      { ticker: "ASML", tier: "core", suggestedAllocation: 10, rationale: "Only EUV maker; no thesis needed beyond monopoly", entryStrategy: "Scale in, it's always 'expensive'", exitTriggers: ["China revenue below 10%", "New EUV competitor emerges (unlikely)"] },
      { ticker: "AMAT", tier: "tactical", suggestedAllocation: 7, rationale: "Capex cycle beneficiary with diversified customer base", entryStrategy: "Buy before fab opening announcements", exitTriggers: ["Semi capex cycle turns down"] },
      { ticker: "MU", tier: "tactical", suggestedAllocation: 7, rationale: "HBM memory supercycle, sole US supplier", entryStrategy: "Buy before quarterly earnings on HBM ramp commentary", exitTriggers: ["HBM pricing declines sharply", "Samsung/SK Hynix oversupply"] },
      { ticker: "VST", tier: "tactical", suggestedAllocation: 6, rationale: "Nuclear power optionality + competitive power markets", entryStrategy: "Add on energy sector selloffs", exitTriggers: ["Nuclear license rejections", "PPA demand disappoints"] },
      { ticker: "PLTR", tier: "tactical", suggestedAllocation: 5, rationale: "Defense AI best-in-class, commercial business emerging", entryStrategy: "Dollar cost average", exitTriggers: ["Government contract losses", "P/E exceeds 100x on slowing growth"] },
      { ticker: "MP", tier: "speculative", suggestedAllocation: 3, rationale: "Direct hedge on China rare earth weaponization", entryStrategy: "Small position, add if China escalates", exitTriggers: ["China removes export restrictions", "Processing facility delayed again"] },
      { ticker: "RCAT", tier: "speculative", suggestedAllocation: 2, rationale: "High-risk/reward on SRR contract", entryStrategy: "Small speculative bet, defined risk", exitTriggers: ["Lose SRR contract", "Defense budget cuts to drone programs"] },
    ],
  },
  {
    name: "Balanced Tech + Infrastructure",
    description: "More balanced approach mixing AI infrastructure with defensive picks. Better for investors who want AI exposure without full concentration.",
    riskProfile: "moderate",
    cashReserve: 15,
    rebalanceFrequency: "Semi-annually",
    notes: "Add uncorrelated positions like energy and real assets to reduce drawdown during AI sentiment corrections.",
    positions: [
      { ticker: "NVDA", tier: "core", suggestedAllocation: 12, rationale: "Must-own AI infrastructure monopoly", entryStrategy: "Start with half position, add on weakness", exitTriggers: ["Market share drops materially"] },
      { ticker: "META", tier: "core", suggestedAllocation: 12, rationale: "Profitable AI monetization with strong FCF", entryStrategy: "Add on any regulatory noise", exitTriggers: ["User growth turns negative"] },
      { ticker: "TSM", tier: "core", suggestedAllocation: 10, rationale: "Foundry monopoly with lower volatility than NVDA", entryStrategy: "Scale in steadily", exitTriggers: ["Geopolitical escalation"] },
      { ticker: "CEG", tier: "core", suggestedAllocation: 8, rationale: "Clean energy + AI power demand secular story", entryStrategy: "Buy on nuclear narrative uncertainty", exitTriggers: ["Hyperscaler demand disappointment"] },
      { ticker: "ASML", tier: "core", suggestedAllocation: 8, rationale: "Monopoly machinery, lower volatility than chip designers", entryStrategy: "Buy and hold, reinvest dividends", exitTriggers: ["Export control exposure exceeds 30% revenue"] },
      { ticker: "ISRG", tier: "tactical", suggestedAllocation: 8, rationale: "Stable robotic monopoly uncorrelated to AI sentiment", entryStrategy: "Buy on procedure volume weakness", exitTriggers: ["Competition gains meaningful share"] },
      { ticker: "AMAT", tier: "tactical", suggestedAllocation: 7, rationale: "Diversified semi equipment exposure", entryStrategy: "Cycle-aware entry", exitTriggers: ["Capex cycle downturn"] },
      { ticker: "VST", tier: "tactical", suggestedAllocation: 5, rationale: "Power infrastructure hedge", entryStrategy: "Energy sector dips", exitTriggers: ["Nuclear economics deteriorate"] },
      { ticker: "MP", tier: "speculative", suggestedAllocation: 3, rationale: "Critical minerals hedge", entryStrategy: "Small allocation, geopolitical hedge", exitTriggers: ["Processing facility fails to ramp"] },
    ],
  },
];
