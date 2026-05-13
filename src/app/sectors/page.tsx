import Link from "next/link";
import { SECTORS } from "@/lib/data/sectors";
import { STOCKS } from "@/lib/data/stocks";

const RISK_DISTRIBUTION = (sectorId: string) => {
  const stocks = STOCKS.filter((s) => s.sector === sectorId);
  return {
    low: stocks.filter((s) => s.riskLevel === "low").length,
    medium: stocks.filter((s) => s.riskLevel === "medium").length,
    high: stocks.filter((s) => s.riskLevel === "high").length,
    speculative: stocks.filter((s) => s.riskLevel === "speculative").length,
  };
};

export default function SectorsPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Sector Bottleneck Map</h1>
        <p className="text-sm text-gray-500 mt-1">
          Each sector mapped to its core bottleneck, tailwinds, and headwinds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTORS.map((sector) => {
          const stocks = STOCKS.filter((s) => s.sector === sector.id);
          const dist = RISK_DISTRIBUTION(sector.id);
          const avgConviction =
            stocks.length > 0
              ? (stocks.reduce((sum, s) => sum + s.conviction, 0) / stocks.length).toFixed(1)
              : "—";

          return (
            <Link
              key={sector.id}
              href={`/sectors/${sector.id}`}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sector.color }}
                  />
                  <div>
                    <div className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {sector.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{stocks.length} stocks · avg conviction {avgConviction}/5</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-400 leading-relaxed mb-3">{sector.description}</p>

              {/* Bottleneck highlight */}
              <div className="bg-gray-800/60 rounded-lg px-3 py-2 mb-3">
                <div className="text-xs text-amber-500 font-medium mb-0.5">Key Bottleneck</div>
                <div className="text-xs text-gray-300">{sector.bottleneck}</div>
              </div>

              {/* Tailwinds / Headwinds */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-green-500 font-medium mb-1">Tailwinds</div>
                  <ul className="space-y-0.5 text-gray-400">
                    {sector.tailwinds.slice(0, 2).map((t, i) => (
                      <li key={i} className="flex gap-1">
                        <span className="text-green-600">↑</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-red-500 font-medium mb-1">Headwinds</div>
                  <ul className="space-y-0.5 text-gray-400">
                    {sector.headwinds.slice(0, 2).map((h, i) => (
                      <li key={i} className="flex gap-1">
                        <span className="text-red-600">↓</span> {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
