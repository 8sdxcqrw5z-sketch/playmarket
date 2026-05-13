# Research Data Freshness

This data was compiled on **May 13, 2026** from bottleneck analysis dated **April 29 – May 11, 2026**.

All prices, multiples, and analyst targets stored in the codebase are **stale by design**. They are stored under `lastVerifiedPrice` / `lastVerifiedDate` fields — not as current state. Do not display these numbers to users without a staleness warning.

---

## Fields that need re-verification before showing live numbers

### Per-stock fields (in `src/lib/data/stocks.ts`)

- [ ] `lastVerifiedPrice` — re-verify against a live data source before displaying
- [ ] `lastVerifiedDate` — update to current date after each price refresh
- [ ] `targetPrice` — analyst targets move; re-pull from Bloomberg/FactSet/consensus
- [ ] Conviction tier — re-run the 15% hurdle check at current prices; tiers may shift

### Tickers with stale prices stored (as of May 13, 2026)

| Ticker | `lastVerifiedPrice` | `lastVerifiedDate` | Notes |
|--------|--------------------|--------------------|-------|
| MP     | $72.65             | 2026-05-06         | Entry was $61.30 at original BUY signal |
| MU     | $797               | 2026-05-08         | Consensus target ~$478 at that date — both stale |
| ASML   | ~$1,545            | 2026-05-09         | Near 52-week high at research date |
| CDNS   | ~$352              | 2026-05-09         | FwdPE ~44 at research date |

### Catalysts (in `src/lib/data/catalysts.ts`)

- [ ] **c11** (JEDEC, 2026-05-15) — confirm whether event occurred; update status to `completed`
- [ ] **c12** (NVDA Q1 FY2027, 2026-05-20) — confirm whether earnings occurred; update status and add result notes
- [ ] **c13** (CRDO Q4 FY26, ~2026-06-05) — confirm exact earnings date before sizing any position
- [ ] **c14** (MU Q3 FY26, ~2026-06-24) — confirm exact earnings date
- [ ] **c15** (SK Hynix / Samsung, ~2026-07-25) — confirm exact earnings dates
- [ ] **c16** (PLTR Q2, 2026-08-03) — confirm date; update status post-event
- [ ] **c17** (NVIDIA Vera Rubin, ~Q3 2026) — confirm ramp schedule from NVIDIA IR
- [ ] **c18** (Golden Dome, ~2026-12-31) — placeholder date; watch DoD announcements

### Risks (in `src/lib/data/risks.ts`)

- [ ] **r10** (Crowded-trade) — DRAM ETF AUM figure ($6.25B as of May 2026) needs refresh; check current AUM
- [ ] **r11** (DOGE overhang) — check for EO updates or DoD services budget announcements
- [ ] **r12** (Customer concentration) — re-verify CRDO customer concentration from latest 10-Q
- [ ] **r13** (Entry-timing) — MU price and consensus target both stale; re-run the math

### Portfolio (in `src/lib/data/portfolio.ts`)

- [ ] MP allocation — re-verify DoD price floor contract is still in force
- [ ] MU entry triggers ($500–550, $600–650) — confirm these levels are still valid at current price
- [ ] CRDO entry trigger — confirm Q4 FY26 earnings date and check whether the earnings have occurred
- [ ] ETF expense ratios (SOXX 0.35%, SOXQ 0.00% waived, PPA) — re-verify, fee waivers can expire

---

## What does NOT need re-verification

These are durable thesis elements unlikely to change on a weekly basis:

- Bottleneck type classifications (EUV monopoly, HBM sole-US-supplier, etc.)
- Kill switch conditions — these are structural, not price-sensitive
- Bear case descriptions
- Sector headwinds/tailwinds (review quarterly, not weekly)
- Conviction tier logic (the 15% hurdle rule in `src/lib/config.ts`)

---

## How to refresh

1. Pull current prices from your data source
2. Update `lastVerifiedPrice` and `lastVerifiedDate` in `stocks.ts`
3. Re-run the 15% implied return check for each WATCH-tier name
4. Update catalyst statuses (`upcoming` → `completed`) for any that have occurred
5. Update this file with the new refresh date
