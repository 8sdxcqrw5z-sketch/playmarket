import Link from "next/link";
import { SECTORS } from "@/lib/data/sectors";
import { STOCKS } from "@/lib/data/stocks";
import { CATALYSTS } from "@/lib/data/catalysts";
import { RISKS } from "@/lib/data/risks";
import { StatCard } from "@/components/cards/StatCard";

const CONVICTION_COLORS: Record<number, string> = {
  5: "text-green-400",
  4: "text-emerald-400",
  3: "text-yellow-400",
  2: "text-orange-400",
  1: "text-red-400",
};

const RISK_BADGE: Record<string, string> = {
  low: "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  speculative: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const IMPACT_BADGE: Record<string, string> = {
  transformative: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  medium: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  low: "bg-gray-700/10 text-gray-500 border-gray-700/20",
};

export default function DashboardPage() {
  const highConviction = STOCKS.filter((s) => s.conviction >= 4);
  const upcomingCatalysts = CATALYSTS.filter(
    (c) => c.status === "upcoming" || c.status === "in-progress"
  ).slice(0, 5);
  const highRisks = RISKS.filter((r) => r.severity === "high").slice(0, 4);

  return (
    <div className="p-6 space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Research Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          AI infrastructure · Semiconductors · Optical · Robotics · Defense · Rare Earth · Power
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Focus Sectors" value={SECTORS.length} sub="Tracked themes" />
        <StatCard
          label="Watchlist Stocks"
          value={STOCKS.length}
          sub="Across all sectors"
          color="text-indigo-400"
        />
        <StatCard
          label="Active Catalysts"
          value={CATALYSTS.filter((c) => c.status !== "completed").length}
          sub="In progress or upcoming"
          color="text-amber-400"
        />
        <StatCard
          label="High-Risk Flags"
          value={RISKS.filter((r) => r.severity === "high").length}
          sub="Require monitoring"
          color="text-red-400"
        />
      </div>

      {/* Sector overview grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Sector Map</h2>
          <Link href="/sectors" className="text-xs text-indigo-400 hover:text-indigo-300">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SECTORS.map((sector) => {
            const sectorStocks = STOCKS.filter((s) => s.sector === sector.id);
            return (
              <Link
                key={sector.id}
                href={`/sectors/${sector.id}`}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-all group"
              >
                <div
                  className="w-2 h-2 rounded-full mb-3"
                  style={{ backgroundColor: sector.color }}
                />
                <div className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                  {sector.shortName}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{sector.bottleneck}</div>
                <div className="text-xs text-gray-600 mt-2">{sectorStocks.length} stocks</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Two column: High conviction + Catalysts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* High conviction */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">High Conviction Picks</h2>
            <Link href="/watchlist" className="text-xs text-indigo-400 hover:text-indigo-300">
              Full watchlist →
            </Link>
          </div>
          <div className="space-y-2">
            {highConviction.map((stock) => (
              <div
                key={stock.ticker}
                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 flex items-center gap-4"
              >
                <div className="w-12 text-sm font-bold text-white">{stock.ticker}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-400 truncate">{stock.name}</div>
                  <div className="text-xs text-gray-600 mt-0.5 truncate">
                    {stock.thesis.slice(0, 60)}…
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-xs border rounded px-1.5 py-0.5 ${RISK_BADGE[stock.riskLevel]}`}
                  >
                    {stock.riskLevel}
                  </span>
                  <span className={`text-sm font-bold ${CONVICTION_COLORS[stock.conviction]}`}>
                    {"★".repeat(stock.conviction)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming catalysts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Active Catalysts</h2>
            <Link href="/catalysts" className="text-xs text-indigo-400 hover:text-indigo-300">
              All catalysts →
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingCatalysts.map((catalyst) => (
              <div
                key={catalyst.id}
                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium text-white leading-snug">
                    {catalyst.title}
                  </div>
                  <span
                    className={`text-xs border rounded px-1.5 py-0.5 flex-shrink-0 ${IMPACT_BADGE[catalyst.impact]}`}
                  >
                    {catalyst.impact}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-gray-500">{catalyst.expectedDate}</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-xs text-gray-600">
                    {catalyst.relatedTickers.join(", ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Risk alerts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">High-Severity Risks</h2>
          <Link href="/risks" className="text-xs text-indigo-400 hover:text-indigo-300">
            Risk tracker →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {highRisks.map((risk) => (
            <div
              key={risk.id}
              className="bg-gray-900 border border-red-900/30 rounded-xl px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
                <div>
                  <div className="text-sm font-medium text-white">{risk.title}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {risk.description.slice(0, 120)}…
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {risk.affectedSectors.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-gray-800 text-gray-500 rounded px-1.5 py-0.5"
                      >
                        {s.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick action summary */}
      <section className="bg-indigo-950/40 border border-indigo-800/30 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-indigo-300 mb-3">Action Summary</h2>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex gap-2">
            <span className="text-indigo-500 flex-shrink-0">→</span>
            <span>
              <strong className="text-white">NVDA, TSM, ASML, CEG, META</strong> are the
              highest-conviction core positions. Start here.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-500 flex-shrink-0">→</span>
            <span>
              <strong className="text-white">MU</strong> — HBM memory supercycle is early innings.
              Watch next earnings for ramp commentary.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-500 flex-shrink-0">→</span>
            <span>
              <strong className="text-white">MP Materials</strong> — small position as a hedge on
              China rare earth restrictions escalating.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-amber-500 flex-shrink-0">⚠</span>
            <span>
              Monitor Taiwan situation and US export control updates — these are tail risks that
              could reprice the whole portfolio.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
