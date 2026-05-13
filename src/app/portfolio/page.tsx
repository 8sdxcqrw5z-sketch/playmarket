import { PORTFOLIO_STRUCTURES } from "@/lib/data/portfolio";
import { STOCKS } from "@/lib/data/stocks";
import { SECTORS } from "@/lib/data/sectors";

const TIER_BADGE: Record<string, string> = {
  core: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  tactical: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  speculative: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const RISK_COLOR: Record<string, string> = {
  conservative: "text-green-400",
  moderate: "text-yellow-400",
  aggressive: "text-red-400",
};

export default function PortfolioPage() {
  return (
    <div className="p-6 space-y-10 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Portfolio Structure Ideas</h1>
        <p className="text-sm text-gray-500 mt-1">
          Suggested portfolio structures across different risk profiles. Not financial advice.
        </p>
      </div>

      {/* Tier legend */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-3">Position Tiers Explained</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className={`text-xs border rounded px-1.5 py-0.5 ${TIER_BADGE.core}`}>core</span>
            <p className="text-gray-400 text-xs mt-2">
              Highest conviction, most durable thesis. 8–20% each. Hold through volatility. Add on meaningful pullbacks.
            </p>
          </div>
          <div>
            <span className={`text-xs border rounded px-1.5 py-0.5 ${TIER_BADGE.tactical}`}>tactical</span>
            <p className="text-gray-400 text-xs mt-2">
              Strong thesis with more timing or cycle sensitivity. 5–8% each. Actively manage around catalysts.
            </p>
          </div>
          <div>
            <span className={`text-xs border rounded px-1.5 py-0.5 ${TIER_BADGE.speculative}`}>speculative</span>
            <p className="text-gray-400 text-xs mt-2">
              High risk, high potential reward. 1–3% each. Sized so a total loss is tolerable. Treat as option-like.
            </p>
          </div>
        </div>
      </div>

      {PORTFOLIO_STRUCTURES.map((structure) => {
        const totalAllocated = structure.positions.reduce((sum, p) => sum + p.suggestedAllocation, 0);
        const corePct = structure.positions
          .filter((p) => p.tier === "core")
          .reduce((s, p) => s + p.suggestedAllocation, 0);
        const tacticalPct = structure.positions
          .filter((p) => p.tier === "tactical")
          .reduce((s, p) => s + p.suggestedAllocation, 0);
        const specPct = structure.positions
          .filter((p) => p.tier === "speculative")
          .reduce((s, p) => s + p.suggestedAllocation, 0);

        return (
          <div key={structure.name} className="space-y-5">
            {/* Portfolio header */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-lg font-bold text-white">{structure.name}</h2>
                  <p className="text-sm text-gray-400 mt-1">{structure.description}</p>
                </div>
                <span className={`text-sm font-semibold flex-shrink-0 ${RISK_COLOR[structure.riskProfile]}`}>
                  {structure.riskProfile}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-white">{totalAllocated}%</div>
                  <div className="text-xs text-gray-500 mt-0.5">Invested</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-indigo-400">{corePct}%</div>
                  <div className="text-xs text-gray-500 mt-0.5">Core</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-amber-400">{tacticalPct}%</div>
                  <div className="text-xs text-gray-500 mt-0.5">Tactical</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-gray-400">{structure.cashReserve}%</div>
                  <div className="text-xs text-gray-500 mt-0.5">Cash Reserve</div>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Rebalance: {structure.rebalanceFrequency} · {structure.notes}
              </div>
            </div>

            {/* Allocation bar */}
            <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
              {structure.positions
                .sort((a, b) => b.suggestedAllocation - a.suggestedAllocation)
                .map((p) => {
                  const stock = STOCKS.find((s) => s.ticker === p.ticker);
                  const sector = SECTORS.find((s) => s.id === stock?.sector);
                  return (
                    <div
                      key={p.ticker}
                      className="h-full"
                      style={{
                        width: `${p.suggestedAllocation}%`,
                        backgroundColor: sector?.color || "#6366f1",
                        opacity: p.tier === "speculative" ? 0.5 : p.tier === "tactical" ? 0.75 : 1,
                      }}
                      title={`${p.ticker}: ${p.suggestedAllocation}%`}
                    />
                  );
                })}
              <div
                className="h-full bg-gray-700"
                style={{ width: `${structure.cashReserve}%` }}
                title={`Cash: ${structure.cashReserve}%`}
              />
            </div>

            {/* Position list */}
            <div className="space-y-2">
              {(["core", "tactical", "speculative"] as const).map((tier) => {
                const tierPositions = structure.positions.filter((p) => p.tier === tier);
                if (tierPositions.length === 0) return null;
                return (
                  <div key={tier}>
                    <div className="flex items-center gap-2 mb-2 mt-4">
                      <span className={`text-xs border rounded px-1.5 py-0.5 ${TIER_BADGE[tier]}`}>
                        {tier}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {tierPositions.map((pos) => {
                        const stock = STOCKS.find((s) => s.ticker === pos.ticker);
                        const sector = SECTORS.find((s) => s.id === stock?.sector);
                        return (
                          <div
                            key={pos.ticker}
                            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
                          >
                            <div className="flex items-start gap-4">
                              {/* Allocation bar */}
                              <div className="flex-shrink-0 text-center w-12">
                                <div className="text-xl font-bold text-white">{pos.suggestedAllocation}%</div>
                                <div
                                  className="w-full h-1 rounded-full mt-1"
                                  style={{ backgroundColor: sector?.color || "#6366f1" }}
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-bold text-white">{pos.ticker}</span>
                                  {sector && (
                                    <span className="text-xs" style={{ color: sector.color }}>
                                      {sector.shortName}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 mb-2">{pos.rationale}</p>
                                <div className="text-xs text-gray-500">
                                  <span className="text-gray-600">Entry: </span>
                                  {pos.entryStrategy}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  <span className="text-gray-600">Exit triggers: </span>
                                  {pos.exitTriggers.join(" · ")}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
