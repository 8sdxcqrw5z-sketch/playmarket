import { notFound } from "next/navigation";
import Link from "next/link";
import { SECTORS } from "@/lib/data/sectors";
import { STOCKS } from "@/lib/data/stocks";
import { CATALYSTS } from "@/lib/data/catalysts";
import type { SectorId } from "@/lib/types";

const RISK_BADGE: Record<string, string> = {
  low: "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  speculative: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const TIMEFRAME_LABEL: Record<string, string> = {
  "0-3m": "0–3 months",
  "3-12m": "3–12 months",
  "1-3y": "1–3 years",
  "3y+": "3+ years",
};

export async function generateStaticParams() {
  return SECTORS.map((s) => ({ id: s.id }));
}

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sector = SECTORS.find((s) => s.id === id);
  if (!sector) notFound();

  const stocks = STOCKS.filter((s) => s.sector === sector.id);
  const catalysts = CATALYSTS.filter((c) => c.sectors.includes(sector.id as SectorId));

  return (
    <div className="p-6 space-y-8 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/sectors" className="hover:text-gray-300">Sectors</Link>
        <span>/</span>
        <span className="text-gray-300">{sector.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-4 h-4 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: sector.color }} />
        <div>
          <h1 className="text-2xl font-bold text-white">{sector.name}</h1>
          <p className="text-sm text-gray-400 mt-1 max-w-2xl">{sector.description}</p>
        </div>
      </div>

      {/* Plain English explanation */}
      <div className="bg-indigo-950/30 border border-indigo-800/30 rounded-xl p-5">
        <div className="text-xs text-indigo-400 font-medium uppercase tracking-wider mb-2">Why This Matters</div>
        <p className="text-sm text-gray-300 leading-relaxed">{sector.whyItMatters}</p>
      </div>

      {/* Bottleneck + Tailwinds/Headwinds */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-950/20 border border-amber-800/30 rounded-xl p-4">
          <div className="text-xs text-amber-400 font-medium uppercase tracking-wider mb-2">Core Bottleneck</div>
          <p className="text-sm text-gray-300">{sector.bottleneck}</p>
        </div>
        <div className="bg-green-950/20 border border-green-800/30 rounded-xl p-4">
          <div className="text-xs text-green-400 font-medium uppercase tracking-wider mb-2">Tailwinds</div>
          <ul className="space-y-1.5">
            {sector.tailwinds.map((t, i) => (
              <li key={i} className="text-xs text-gray-300 flex gap-2">
                <span className="text-green-500">↑</span> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-950/20 border border-red-800/30 rounded-xl p-4">
          <div className="text-xs text-red-400 font-medium uppercase tracking-wider mb-2">Headwinds</div>
          <ul className="space-y-1.5">
            {sector.headwinds.map((h, i) => (
              <li key={i} className="text-xs text-gray-300 flex gap-2">
                <span className="text-red-500">↓</span> {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Stocks in this sector */}
      <section>
        <h2 className="text-base font-semibold text-white mb-4">Stocks in this Sector</h2>
        <div className="space-y-3">
          {stocks.map((stock) => (
            <div key={stock.ticker} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-white">{stock.ticker}</span>
                  <span className="text-sm text-gray-400">{stock.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs border rounded px-1.5 py-0.5 ${RISK_BADGE[stock.riskLevel]}`}>
                    {stock.riskLevel}
                  </span>
                  <span className="text-xs text-gray-500">{TIMEFRAME_LABEL[stock.timeframe]}</span>
                  <span className="text-sm">{"★".repeat(stock.conviction)}<span className="text-gray-700">{"★".repeat(5 - stock.conviction)}</span></span>
                </div>
              </div>

              {/* Thesis */}
              <div className="mb-2">
                <div className="text-xs text-gray-500 font-medium mb-1">Investment Thesis</div>
                <p className="text-sm text-gray-300 leading-relaxed">{stock.thesis}</p>
              </div>

              {/* Plain English */}
              <div className="bg-gray-800/50 rounded-lg px-3 py-2">
                <div className="text-xs text-indigo-400 font-medium mb-0.5">Plain English</div>
                <p className="text-xs text-gray-400 leading-relaxed">{stock.beginnerExplain}</p>
              </div>

              {/* Tags */}
              {stock.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {stock.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-800 text-gray-500 rounded px-1.5 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related catalysts */}
      {catalysts.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-white mb-4">Related Catalysts</h2>
          <div className="space-y-2">
            {catalysts.map((catalyst) => (
              <div key={catalyst.id} className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium text-white">{catalyst.title}</div>
                  <span className="text-xs text-gray-500 flex-shrink-0">{catalyst.expectedDate}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{catalyst.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
