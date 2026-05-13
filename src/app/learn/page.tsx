"use client";

import { useState } from "react";

const CONCEPTS = [
  { term: "EUV Lithography", category: "Semiconductors" },
  { term: "HBM (High Bandwidth Memory)", category: "Semiconductors" },
  { term: "CoWoS Advanced Packaging", category: "Semiconductors" },
  { term: "Co-Packaged Optics (CPO)", category: "Optical" },
  { term: "Silicon Photonics", category: "Optical" },
  { term: "800G Transceivers", category: "Optical" },
  { term: "AI Inference vs Training", category: "AI Infrastructure" },
  { term: "CUDA Ecosystem Lock-in", category: "AI Infrastructure" },
  { term: "Hyperscaler Capex Cycle", category: "AI Infrastructure" },
  { term: "Humanoid Robot Actuators", category: "Robotics" },
  { term: "Physical AI / Foundation Models for Robotics", category: "Robotics" },
  { term: "Attritable Drone Systems", category: "Defense" },
  { term: "Rare Earth Processing vs Mining", category: "Rare Earth" },
  { term: "Nuclear Power Purchase Agreement (PPA)", category: "Power" },
  { term: "Grid Interconnection Queue", category: "Power" },
  { term: "Free Cash Flow Yield", category: "Investing" },
  { term: "Semiconductor Equipment Cycle", category: "Semiconductors" },
  { term: "Moat / Economic Moat", category: "Investing" },
];

const BEGINNER_GUIDE = [
  {
    title: "Why AI is a Bottleneck Industry",
    content:
      "AI progress is gated by a small number of physical constraints — chips, power, and connectivity. Unlike software, you can't just copy-paste your way to more compute. This creates durable competitive advantages for companies that solve these physical problems.",
  },
  {
    title: "The 'Picks and Shovels' Principle",
    content:
      "During the California Gold Rush, the people who got rich weren't always the miners — they were the ones selling shovels, jeans, and supplies. In AI, Nvidia, ASML, and TSMC are the shovel-sellers. They profit regardless of which AI app 'wins'.",
  },
  {
    title: "What Makes a Stock 'High Conviction'",
    content:
      "High conviction means: (1) we understand why this company has a durable advantage, (2) that advantage is hard for competitors to copy, (3) the business is growing and generating cash, and (4) the price is reasonable relative to the opportunity. Missing any of these reduces conviction.",
  },
  {
    title: "How to Think About Risk",
    content:
      "Risk isn't just 'the stock might go down.' Every thesis has specific things that would prove it wrong. Identifying those kill-shots upfront lets you monitor for them and size your position appropriately. A low-probability catastrophic risk (Taiwan invasion) is different from a high-probability moderate risk (AI capex slowdown).",
  },
  {
    title: "Catalysts vs Long-Term Thesis",
    content:
      "A catalyst is a specific event that can move a stock in the near term — an earnings beat, a contract win, a new product launch. The long-term thesis is why the company will be worth more in 3-5 years. You need both: the thesis tells you what to own, catalysts tell you when to buy.",
  },
  {
    title: "Why Semiconductor Supply Chains Matter",
    content:
      "The most advanced chips can only be made by one company (TSMC), using machines only made by one company (ASML), which require materials only processed in a handful of places. This concentration means any disruption — war, earthquake, export controls — cascades across the entire tech world.",
  },
];

function formatMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.trim() === "") return <br key={i} />;
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <p key={i} className="text-sm font-semibold text-white mt-3">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return (
        <li key={i} className="text-sm text-gray-300 ml-4 list-disc">
          {line.replace(/^[-*]\s+/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
        </li>
      );
    }
    return (
      <p key={i} className="text-sm text-gray-300 leading-relaxed">
        {line.replace(/\*\*(.*?)\*\*/g, "$1")}
      </p>
    );
  });
}

export default function LearnPage() {
  const [concept, setConcept] = useState("");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  async function explain(term: string) {
    setConcept(term);
    setLoading(true);
    setError(null);
    setExplanation(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept: term }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setExplanation(data.explanation);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to get explanation");
    } finally {
      setLoading(false);
    }
  }

  const categories = [...new Set(CONCEPTS.map((c) => c.category))];

  return (
    <div className="p-6 space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Learn</h1>
        <p className="text-sm text-gray-500 mt-1">
          Plain-English explanations of investing concepts, sector jargon, and market dynamics.
        </p>
      </div>

      {/* Beginner guides */}
      <section>
        <h2 className="text-base font-semibold text-white mb-4">Investing Mental Models</h2>
        <div className="space-y-2">
          {BEGINNER_GUIDE.map((guide, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-white">{guide.title}</span>
                <span className="text-gray-500 text-xs">{expanded === i ? "▲" : "▼"}</span>
              </button>
              {expanded === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-400 leading-relaxed">{guide.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* AI-powered concept explainer */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white mb-1">AI Concept Explainer</h2>
          <p className="text-xs text-gray-500">
            Ask Claude to explain any investing or sector concept in plain English.
          </p>
        </div>

        {/* Custom concept input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && concept.trim() && explain(concept)}
            placeholder="Type any concept (e.g. 'what is CoWoS packaging?')"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => concept.trim() && explain(concept)}
            disabled={loading || !concept.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? "…" : "Explain"}
          </button>
        </div>

        {/* Quick concept buttons */}
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat}>
              <div className="text-xs text-gray-600 font-medium mb-2">{cat}</div>
              <div className="flex flex-wrap gap-2">
                {CONCEPTS.filter((c) => c.category === cat).map((c) => (
                  <button
                    key={c.term}
                    onClick={() => explain(c.term)}
                    disabled={loading}
                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                  >
                    {c.term}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-4">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <div className="text-gray-500 text-sm">Claude is explaining &ldquo;{concept}&rdquo;…</div>
          </div>
        )}

        {explanation && !loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-xs text-indigo-400 font-medium mb-3 uppercase tracking-wider">
              {concept}
            </div>
            <div className="space-y-1">{formatMarkdown(explanation)}</div>
          </div>
        )}
      </section>
    </div>
  );
}
