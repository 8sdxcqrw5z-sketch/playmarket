import { RISKS } from "@/lib/data/risks";
import { SECTORS } from "@/lib/data/sectors";

const SEVERITY_BADGE: Record<string, string> = {
  low: "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  speculative: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const PROBABILITY_BADGE: Record<string, string> = {
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-red-500",
};

const CATEGORY_ICON: Record<string, string> = {
  macro: "🌐",
  geopolitical: "🗺",
  regulatory: "⚖",
  technology: "⚙",
  valuation: "📊",
  liquidity: "💧",
  execution: "🎯",
};

const SEVERITY_ORDER = ["high", "medium", "low"];

export default function RisksPage() {
  const sorted = [...RISKS].sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  );

  const categories = ["geopolitical", "macro", "regulatory", "technology", "execution"] as const;

  return (
    <div className="p-6 space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Risk Tracker</h1>
        <p className="text-sm text-gray-500 mt-1">
          Known risks across your portfolio, categorized by type and severity.
        </p>
      </div>

      {/* Risk summary */}
      <div className="grid grid-cols-3 gap-4">
        {(["high", "medium", "low"] as const).map((severity) => {
          const count = RISKS.filter((r) => r.severity === severity).length;
          return (
            <div key={severity} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className={`text-2xl font-bold mb-1 ${SEVERITY_BADGE[severity].split(" ")[1]}`}>{count}</div>
              <div className="text-xs text-gray-500 capitalize">{severity} severity</div>
            </div>
          );
        })}
      </div>

      {/* High severity first */}
      <section>
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-red-400">●</span> High Severity — Act-on-these
        </h2>
        <div className="space-y-3">
          {sorted.filter((r) => r.severity === "high").map((risk) => (
            <RiskCard key={risk.id} risk={risk} />
          ))}
        </div>
      </section>

      {/* Medium severity */}
      <section>
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-yellow-400">●</span> Medium Severity — Monitor
        </h2>
        <div className="space-y-3">
          {sorted.filter((r) => r.severity === "medium").map((risk) => (
            <RiskCard key={risk.id} risk={risk} />
          ))}
        </div>
      </section>

      {/* By category */}
      <section>
        <h2 className="text-base font-semibold text-white mb-4">By Risk Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const catRisks = RISKS.filter((r) => r.category === cat);
            if (catRisks.length === 0) return null;
            return (
              <div key={cat} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>{CATEGORY_ICON[cat]}</span>
                  <span className="text-sm font-medium text-white capitalize">{cat}</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{catRisks.length}</div>
                <div className="flex gap-1.5">
                  {catRisks.map((r) => (
                    <span
                      key={r.id}
                      className={`w-2 h-2 rounded-full ${
                        r.severity === "high"
                          ? "bg-red-500"
                          : r.severity === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      title={r.title}
                    />
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

function RiskCard({ risk }: { risk: (typeof RISKS)[0] }) {
  const SEVERITY_BADGE: Record<string, string> = {
    low: "bg-green-500/10 text-green-400 border-green-500/20",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    high: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const PROBABILITY_BADGE: Record<string, string> = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-red-500",
  };

  const CATEGORY_ICON: Record<string, string> = {
    macro: "🌐",
    geopolitical: "🗺",
    regulatory: "⚖",
    technology: "⚙",
    valuation: "📊",
    liquidity: "💧",
    execution: "🎯",
  };

  return (
    <div
      className={`bg-gray-900 border rounded-xl p-5 ${
        risk.severity === "high" ? "border-red-900/40" : "border-gray-800"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span>{CATEGORY_ICON[risk.category]}</span>
          <h3 className="text-sm font-semibold text-white">{risk.title}</h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs border rounded px-1.5 py-0.5 ${SEVERITY_BADGE[risk.severity]}`}>
            {risk.severity}
          </span>
          <span className={`text-xs font-medium ${PROBABILITY_BADGE[risk.probability]}`}>
            {risk.probability} prob
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed mb-3">{risk.description}</p>

      {/* Affected sectors */}
      <div className="flex flex-wrap gap-1 mb-3">
        {risk.affectedSectors.map((s) => {
          const sector = SECTORS.find((sec) => sec.id === s);
          return (
            <span
              key={s}
              className="text-xs rounded px-1.5 py-0.5 bg-gray-800"
              style={{ color: sector?.color || "#9ca3af" }}
            >
              {sector?.shortName || s}
            </span>
          );
        })}
      </div>

      {/* Mitigations */}
      <div>
        <div className="text-xs text-gray-500 font-medium mb-1.5">Mitigations</div>
        <ul className="space-y-1">
          {risk.mitigations.map((m, i) => (
            <li key={i} className="text-xs text-gray-400 flex gap-2">
              <span className="text-green-600 flex-shrink-0">✓</span> {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
