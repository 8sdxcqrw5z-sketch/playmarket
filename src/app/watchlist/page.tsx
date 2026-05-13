import { STOCKS } from "@/lib/data/stocks";
import { SECTORS } from "@/lib/data/sectors";
import type { SectorId } from "@/lib/types";

const RISK_BADGE: Record<string, string> = {
  low: "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  speculative: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const TIMEFRAME_LABEL: Record<string, string> = {
  "0-3m": "0–3m",
  "3-12m": "3–12m",
  "1-3y": "1–3y",
  "3y+": "3y+",
};

export default function WatchlistPage() {
  const sectorOrder: SectorId[] = [
    "ai-infrastructure",
    "semiconductors",
    "optical-connectivity",
    "robotics",
    "defense-drones",
    "rare-earth",
    "power-cooling",
    "undervalued-growth",
  ];

  return (
    <div className="p-6 space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Stock Watchlist</h1>
        <p className="text-sm text-gray-500 mt-1">
          {STOCKS.length} stocks across {sectorOrder.length} sectors. Sorted by conviction.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <span className="font-medium text-gray-400">Risk:</span>
        {["low", "medium", "high", "speculative"].map((r) => (
          <span key={r} className={`border rounded px-2 py-0.5 ${RISK_BADGE[r]}`}>{r}</span>
        ))}
        <span className="ml-4 font-medium text-gray-400">Conviction: ★ = 1/5 → ★★★★★ = 5/5</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left">
              <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
              <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Sector</th>
              <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Conviction</th>
              <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
              <th className="pb-3 pr-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Timeframe</th>
              <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Thesis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {[...STOCKS]
              .sort((a, b) => b.conviction - a.conviction)
              .map((stock) => {
                const sector = SECTORS.find((s) => s.id === stock.sector);
                return (
                  <tr key={stock.ticker} className="hover:bg-gray-900/50 transition-colors">
                    <td className="py-3 pr-4 font-bold text-white">{stock.ticker}</td>
                    <td className="py-3 pr-4 text-gray-300 whitespace-nowrap">{stock.name}</td>
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: sector?.color }}
                        />
                        <span className="text-gray-400 text-xs">{sector?.shortName}</span>
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-yellow-400 text-sm">
                        {"★".repeat(stock.conviction)}
                        <span className="text-gray-700">{"★".repeat(5 - stock.conviction)}</span>
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs border rounded px-1.5 py-0.5 ${RISK_BADGE[stock.riskLevel]}`}>
                        {stock.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-500">{TIMEFRAME_LABEL[stock.timeframe]}</td>
                    <td className="py-3 text-xs text-gray-400 max-w-xs">
                      <span className="line-clamp-2">{stock.thesis}</span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* By sector view */}
      <section className="pt-4">
        <h2 className="text-base font-semibold text-white mb-6">By Sector</h2>
        <div className="space-y-8">
          {sectorOrder.map((sectorId) => {
            const sector = SECTORS.find((s) => s.id === sectorId);
            const sectorStocks = STOCKS.filter((s) => s.sector === sectorId).sort(
              (a, b) => b.conviction - a.conviction
            );
            if (!sector || sectorStocks.length === 0) return null;

            return (
              <div key={sectorId}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sector.color }} />
                  <h3 className="text-sm font-semibold text-white">{sector.name}</h3>
                  <span className="text-xs text-gray-600">{sectorStocks.length} stocks</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {sectorStocks.map((stock) => (
                    <div
                      key={stock.ticker}
                      className="bg-gray-900 border border-gray-800 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-sm font-bold text-white">{stock.ticker}</span>
                          <span className="text-xs text-gray-500 ml-2">{stock.name}</span>
                        </div>
                        <span className="text-yellow-400 text-sm flex-shrink-0">
                          {"★".repeat(stock.conviction)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-3">
                        {stock.beginnerExplain}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs border rounded px-1.5 py-0.5 ${RISK_BADGE[stock.riskLevel]}`}>
                          {stock.riskLevel}
                        </span>
                        <span className="text-xs text-gray-600">{TIMEFRAME_LABEL[stock.timeframe]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
