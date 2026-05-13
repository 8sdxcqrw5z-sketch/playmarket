"use client";

import { useState, useEffect } from "react";
import type { PriceSnapshot, PriceRefreshStatus } from "@/lib/types";

const CACHE_KEY = "playmarket_prices";

interface CachedPrices {
  snapshots: Record<string, PriceSnapshot>;
  refreshedAt: string;
}

function formatAge(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

function formatPrice(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

function formatMarketCap(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

function formatVolume(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

export function PriceRefreshButton() {
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState<CachedPrices | null>(null);
  const [results, setResults] = useState<PriceRefreshStatus[] | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) setCache(JSON.parse(stored));
    } catch {
      // ignore corrupt cache
    }
  }, []);

  async function handleRefresh() {
    setLoading(true);
    setGlobalError(null);
    setResults(null);

    try {
      const res = await fetch("/api/refresh-prices", { method: "POST" });
      const data = await res.json();

      if (!res.ok || data.error) {
        setGlobalError(data.error ?? `Error ${res.status}`);
        return;
      }

      const refreshedResults: PriceRefreshStatus[] = data.results;
      setResults(refreshedResults);

      // Build snapshot map from successful results only
      const newSnapshots: Record<string, PriceSnapshot> = { ...cache?.snapshots };
      for (const r of refreshedResults) {
        if (r.status === "ok") newSnapshots[r.ticker] = r.snapshot;
      }

      const newCache: CachedPrices = { snapshots: newSnapshots, refreshedAt: data.refreshedAt };
      setCache(newCache);
      localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  const okCount = results?.filter((r) => r.status === "ok").length ?? 0;
  const failedResults = results?.filter((r) => r.status === "failed") ?? [];
  const snapshots = cache?.snapshots ?? {};
  const snapshotList = Object.values(snapshots).sort((a, b) => a.ticker.localeCompare(b.ticker));
  const visibleSnapshots = showAll ? snapshotList : snapshotList.slice(0, 8);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Live Prices</h2>
          {cache?.refreshedAt ? (
            <p className="text-xs text-gray-500 mt-0.5">
              Last refreshed {formatAge(cache.refreshedAt)}
              <span className="text-gray-700 ml-1">
                ({new Date(cache.refreshedAt).toLocaleTimeString()})
              </span>
            </p>
          ) : (
            <p className="text-xs text-gray-600 mt-0.5">No data yet — click Refresh</p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? (
            <>
              <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Refreshing…
            </>
          ) : (
            "↻ Refresh Prices"
          )}
        </button>
      </div>

      {/* Global error */}
      {globalError && (
        <div className="bg-red-950/40 border border-red-800/40 rounded-lg px-4 py-3 text-sm text-red-400">
          {globalError}
        </div>
      )}

      {/* Refresh result summary */}
      {results && !globalError && (
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="text-green-400 font-medium">{okCount} updated</span>
          {failedResults.length > 0 && (
            <span className="text-red-400 font-medium">{failedResults.length} failed</span>
          )}
          {failedResults.map((r) => (
            <span key={r.ticker} className="bg-red-950/30 border border-red-800/30 rounded px-2 py-0.5 text-red-400">
              {r.ticker}: {r.error}
            </span>
          ))}
        </div>
      )}

      {/* Price table */}
      {snapshotList.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="pb-2 pr-4 text-gray-500 font-medium uppercase tracking-wider">Ticker</th>
                  <th className="pb-2 pr-4 text-gray-500 font-medium uppercase tracking-wider text-right">Price</th>
                  <th className="pb-2 pr-4 text-gray-500 font-medium uppercase tracking-wider text-right">52W High</th>
                  <th className="pb-2 pr-4 text-gray-500 font-medium uppercase tracking-wider text-right">52W Low</th>
                  <th className="pb-2 pr-4 text-gray-500 font-medium uppercase tracking-wider text-right">Mkt Cap</th>
                  <th className="pb-2 pr-4 text-gray-500 font-medium uppercase tracking-wider text-right">ADV</th>
                  <th className="pb-2 text-gray-500 font-medium uppercase tracking-wider text-right">P/E (TTM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {visibleSnapshots.map((s) => (
                  <tr key={s.ticker} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-2 pr-4 font-bold text-white">{s.ticker}</td>
                    <td className="py-2 pr-4 text-gray-300 text-right tabular-nums">{formatPrice(s.price)}</td>
                    <td className="py-2 pr-4 text-gray-500 text-right tabular-nums">{formatPrice(s.weekHigh52)}</td>
                    <td className="py-2 pr-4 text-gray-500 text-right tabular-nums">{formatPrice(s.weekLow52)}</td>
                    <td className="py-2 pr-4 text-gray-400 text-right tabular-nums">{formatMarketCap(s.marketCap)}</td>
                    <td className="py-2 pr-4 text-gray-400 text-right tabular-nums">{formatVolume(s.avgDailyVolumeDollars)}</td>
                    <td className="py-2 text-gray-400 text-right tabular-nums">
                      {s.peRatioTrailing != null ? s.peRatioTrailing.toFixed(1) + "x" : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {snapshotList.length > 8 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {showAll ? "Show less ↑" : `Show all ${snapshotList.length} tickers ↓`}
            </button>
          )}

          <p className="text-xs text-gray-700">
            P/E is trailing twelve months. Forward P/E requires FMP paid plan.
            Prices shown are last close from Financial Modeling Prep.
          </p>
        </>
      )}
    </div>
  );
}

// Export a helper so other components can read cached prices without triggering a refresh
export function getCachedPrice(ticker: string): PriceSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (!stored) return null;
    const cache: CachedPrices = JSON.parse(stored);
    return cache.snapshots[ticker] ?? null;
  } catch {
    return null;
  }
}
