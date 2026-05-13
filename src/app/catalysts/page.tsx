import { CATALYSTS } from "@/lib/data/catalysts";
import { SECTORS } from "@/lib/data/sectors";

const STATUS_BADGE: Record<string, string> = {
  upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "in-progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  missed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const IMPACT_BADGE: Record<string, string> = {
  transformative: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  medium: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  low: "bg-gray-700/10 text-gray-500 border-gray-700/20",
};

const IMPACT_ORDER = ["transformative", "high", "medium", "low"];

export default function CatalystsPage() {
  const sortedCatalysts = [...CATALYSTS].sort(
    (a, b) => IMPACT_ORDER.indexOf(a.impact) - IMPACT_ORDER.indexOf(b.impact)
  );

  const transformative = sortedCatalysts.filter((c) => c.impact === "transformative");
  const high = sortedCatalysts.filter((c) => c.impact === "high");

  return (
    <div className="p-6 space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Catalyst Tracker</h1>
        <p className="text-sm text-gray-500 mt-1">
          Key events and milestones that could move markets in your focus sectors.
        </p>
      </div>

      {/* Summary counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["upcoming", "in-progress", "completed", "missed"] as const).map((status) => (
          <div key={status} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className={`text-2xl font-bold mb-1 ${STATUS_BADGE[status].split(" ")[1]}`}>
              {CATALYSTS.filter((c) => c.status === status).length}
            </div>
            <div className="text-xs text-gray-500 capitalize">{status.replace("-", " ")}</div>
          </div>
        ))}
      </div>

      {/* Transformative catalysts */}
      {transformative.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-indigo-400">◆</span> Transformative Impact
          </h2>
          <div className="space-y-3">
            {transformative.map((catalyst) => (
              <CatalystCard key={catalyst.id} catalyst={catalyst} />
            ))}
          </div>
        </section>
      )}

      {/* High impact catalysts */}
      {high.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-amber-400">●</span> High Impact
          </h2>
          <div className="space-y-3">
            {high.map((catalyst) => (
              <CatalystCard key={catalyst.id} catalyst={catalyst} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function CatalystCard({ catalyst }: { catalyst: (typeof CATALYSTS)[0] }) {
  const STATUS_BADGE: Record<string, string> = {
    upcoming: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "in-progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    completed: "bg-green-500/10 text-green-400 border-green-500/20",
    missed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  const IMPACT_BADGE: Record<string, string> = {
    transformative: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    medium: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    low: "bg-gray-700/10 text-gray-500 border-gray-700/20",
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-sm font-semibold text-white">{catalyst.title}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs border rounded px-1.5 py-0.5 ${STATUS_BADGE[catalyst.status]}`}>
            {catalyst.status.replace("-", " ")}
          </span>
          <span className={`text-xs border rounded px-1.5 py-0.5 ${IMPACT_BADGE[catalyst.impact]}`}>
            {catalyst.impact}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-400 leading-relaxed mb-3">{catalyst.description}</p>

      {catalyst.notes && (
        <div className="bg-gray-800/50 rounded-lg px-3 py-2 mb-3">
          <div className="text-xs text-amber-400 font-medium mb-1">Research Note</div>
          <p className="text-xs text-gray-400">{catalyst.notes}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="text-gray-500">📅 {catalyst.expectedDate}</span>
        <span className="text-gray-700">·</span>
        <div className="flex flex-wrap gap-1">
          {catalyst.relatedTickers.map((t) => (
            <span key={t} className="bg-gray-800 text-gray-300 rounded px-1.5 py-0.5 font-medium">{t}</span>
          ))}
        </div>
        <span className="text-gray-700">·</span>
        <div className="flex flex-wrap gap-1">
          {catalyst.sectors.map((s) => {
            const sector = SECTORS.find((sec) => sec.id === s);
            return (
              <span key={s} className="text-gray-500" style={{ color: sector?.color }}>
                {sector?.shortName}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
