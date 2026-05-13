import { NextResponse } from "next/server";
import { STOCKS } from "@/lib/data/stocks";
import type { PriceSnapshot, PriceRefreshStatus } from "@/lib/types";

const FMP_BASE = "https://financialmodelingprep.com/api/v3";

interface FMPQuote {
  symbol: string;
  price: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  avgVolume: number;
  pe: number | null;
}

export async function POST() {
  const apiKey = process.env.FMP_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured — add FMP_API_KEY to .env.local" },
      { status: 400 }
    );
  }

  const tickers = STOCKS.map((s) => s.ticker);
  const refreshedAt = new Date().toISOString();

  let fmpData: FMPQuote[] = [];

  try {
    const url = `${FMP_BASE}/quote/${tickers.join(",")}?apikey=${apiKey}`;
    const res = await fetch(url, { cache: "no-store" });

    if (res.status === 401) {
      return NextResponse.json(
        { error: "Authentication failed — check your FMP_API_KEY" },
        { status: 401 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `FMP API error: ${res.status} ${res.statusText}` },
        { status: 502 }
      );
    }

    fmpData = await res.json();

    // FMP returns an object with a message key when auth fails softly
    if (!Array.isArray(fmpData)) {
      return NextResponse.json(
        { error: "Invalid response from FMP — check your API key" },
        { status: 502 }
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return NextResponse.json({ error: `Failed to reach FMP: ${message}` }, { status: 502 });
  }

  const quoteMap = new Map<string, FMPQuote>(fmpData.map((q) => [q.symbol, q]));

  const results: PriceRefreshStatus[] = tickers.map((ticker) => {
    const quote = quoteMap.get(ticker);

    if (!quote || quote.price == null) {
      return { ticker, status: "failed", error: "Ticker not found or no price returned" };
    }

    const snapshot: PriceSnapshot = {
      ticker,
      price: quote.price,
      weekHigh52: quote.yearHigh,
      weekLow52: quote.yearLow,
      marketCap: quote.marketCap,
      avgDailyVolumeDollars: Math.round((quote.avgVolume ?? 0) * quote.price),
      peRatioTrailing: quote.pe ?? null,
      lastRefreshedAt: refreshedAt,
    };

    return { ticker, status: "ok", snapshot };
  });

  return NextResponse.json({ results, refreshedAt });
}
