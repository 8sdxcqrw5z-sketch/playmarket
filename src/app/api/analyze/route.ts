import { NextRequest, NextResponse } from "next/server";
import { analyzeStock } from "@/lib/ai/claude";

export async function POST(req: NextRequest) {
  try {
    const { ticker } = await req.json();
    if (!ticker || typeof ticker !== "string") {
      return NextResponse.json({ error: "ticker is required" }, { status: 400 });
    }
    const analysis = await analyzeStock(ticker.toUpperCase());
    return NextResponse.json({ analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
