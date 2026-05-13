"use client";

import { useState } from "react";

function formatMarkdown(text: string) {
  return text
    .split("\n")
    .map((line, i) => {
      if (line.startsWith("## ") || line.startsWith("**") && line.endsWith("**")) {
        return (
          <h3 key={i} className="text-sm font-bold text-white mt-4 mb-1">
            {line.replace(/^##\s+/, "").replace(/\*\*/g, "")}
          </h3>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={i} className="text-sm text-gray-300 ml-4 list-disc">
            {line.replace(/^[-*]\s+/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
          </li>
        );
      }
      if (line.startsWith("1. ") || /^\d+\.\s/.test(line)) {
        const content = line.replace(/^\d+\.\s+/, "");
        return (
          <li key={i} className="text-sm text-gray-300 ml-4 list-decimal">
            {content.replace(/\*\*(.*?)\*\*/g, "$1")}
          </li>
        );
      }
      if (line.trim() === "") return <br key={i} />;
      return (
        <p key={i} className="text-sm text-gray-300 leading-relaxed">
          {line.replace(/\*\*(.*?)\*\*/g, "$1")}
        </p>
      );
    });
}

export default function ReportsPage() {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticker, setTicker] = useState("");
  const [stockAnalysis, setStockAnalysis] = useState<string | null>(null);
  const [stockLoading, setStockLoading] = useState(false);

  async function generateReport() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/report", { method: "POST" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setReport(data.report);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate report");
    } finally {
      setLoading(false);
    }
  }

  async function analyzeStock() {
    if (!ticker.trim()) return;
    setStockLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStockAnalysis(data.analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to analyze stock");
    } finally {
      setStockLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Research Reports</h1>
        <p className="text-sm text-gray-500 mt-1">
          Generate weekly reports and stock analyses powered by Claude AI.
        </p>
      </div>

      {/* API key notice */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4">
        <div className="text-xs text-amber-400 font-medium mb-1">Setup Required</div>
        <p className="text-xs text-gray-400">
          Set <code className="text-amber-300 bg-gray-800 px-1 rounded">ANTHROPIC_API_KEY</code> in your{" "}
          <code className="text-amber-300 bg-gray-800 px-1 rounded">.env.local</code> file to enable AI features.
        </p>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-4">
          <div className="text-xs text-red-400 font-medium mb-1">Error</div>
          <p className="text-xs text-gray-400">{error}</p>
        </div>
      )}

      {/* Weekly report */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Weekly Research Report</h2>
          <button
            onClick={generateReport}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? "Generating…" : "Generate Report"}
          </button>
        </div>

        {loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <div className="text-gray-500 text-sm">Claude is analyzing your sectors and positions…</div>
          </div>
        )}

        {report && !loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-gray-500">Generated {new Date().toLocaleDateString()}</div>
              <button
                onClick={() => navigator.clipboard.writeText(report)}
                className="text-xs text-gray-500 hover:text-gray-300"
              >
                Copy
              </button>
            </div>
            <div className="space-y-1">{formatMarkdown(report)}</div>
          </div>
        )}

        {!report && !loading && (
          <div className="bg-gray-900 border border-gray-800 border-dashed rounded-xl p-8 text-center">
            <div className="text-gray-600 text-sm">
              Click &ldquo;Generate Report&rdquo; to get an AI-powered weekly research summary
              <br />
              covering all 8 sectors, active catalysts, risks, and action items.
            </div>
          </div>
        )}
      </section>

      {/* Stock analysis */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-white">Stock Deep Dive</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && analyzeStock()}
            placeholder="Enter ticker (e.g. NVDA)"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={analyzeStock}
            disabled={stockLoading || !ticker.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            {stockLoading ? "Analyzing…" : "Analyze"}
          </button>
        </div>

        {stockAnalysis && !stockLoading && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="space-y-1">{formatMarkdown(stockAnalysis)}</div>
          </div>
        )}
      </section>
    </div>
  );
}
