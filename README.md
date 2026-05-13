# PlayMarket — AI Investing Research OS

An AI-powered dashboard for organizing and researching investments across high-conviction sectors:
AI infrastructure · Semiconductors · Optical Connectivity · Robotics · Defense/Drones · Rare Earth · Power/Cooling · Undervalued Growth

## Features

| Page | What it does |
|------|-------------|
| **Dashboard** | At-a-glance summary: sector overview, high-conviction picks, active catalysts, risk alerts, action summary |
| **Sector Map** | Deep-dive on each sector — bottleneck, tailwinds, headwinds, plain-English explanation |
| **Watchlist** | All tracked stocks sorted by conviction, with thesis and risk level |
| **Catalyst Tracker** | Key upcoming events sorted by impact — what to watch and when |
| **Risk Tracker** | Known risks categorized by type and severity, with mitigations |
| **Portfolio Ideas** | Two suggested portfolio structures (aggressive / moderate) with position tiers and entry/exit logic |
| **AI Reports** | Claude-generated weekly research reports + stock deep-dive analyzer |
| **Learn** | Plain-English concept explainer (AI-powered) + investing mental models |

## Setup

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Dashboard
│   ├── sectors/            # Sector map + detail pages
│   ├── watchlist/          # Stock watchlist
│   ├── catalysts/          # Catalyst tracker
│   ├── risks/              # Risk tracker
│   ├── portfolio/          # Portfolio structure ideas
│   ├── reports/            # AI-generated reports
│   ├── learn/              # Concept explainer
│   └── api/                # API routes (report, explain, analyze)
├── components/
│   ├── ui/                 # Sidebar, NavLink
│   └── cards/              # StatCard, etc.
└── lib/
    ├── types/              # TypeScript types for all entities
    ├── data/               # Seed data (sectors, stocks, catalysts, risks, portfolio)
    └── ai/                 # Claude API integration
```

## Data Model

- **Sector** — 8 focus sectors with bottleneck, tailwinds/headwinds, and plain-English explanations
- **Stock** — Ticker, thesis, conviction (1-5), risk level, timeframe, beginner explanation
- **Catalyst** — Event tracking with impact level, affected sectors/tickers, status
- **Risk** — Categorized risks with probability, severity, and mitigation strategies
- **PortfolioStructure** — Tiered position suggestions (core/tactical/speculative) with entry/exit logic

## Adding Your Own Research

Edit files in `src/lib/data/`:
- `stocks.ts` — Add or modify stocks
- `catalysts.ts` — Add upcoming events
- `risks.ts` — Track new risks
- `portfolio.ts` — Adjust portfolio structures

## AI Features

Requires `ANTHROPIC_API_KEY`. Three capabilities:
1. **Weekly Report** — Analyzes all sectors, active catalysts, and risks to produce a structured research digest
2. **Stock Analyzer** — Deep-dive on any ticker with thesis, risks, and catalysts
3. **Concept Explainer** — Plain-English explanations of any investing or sector concept
