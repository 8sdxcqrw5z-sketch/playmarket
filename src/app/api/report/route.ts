import { NextResponse } from "next/server";
import { generateWeeklyReport } from "@/lib/ai/claude";

export async function POST() {
  try {
    const report = await generateWeeklyReport();
    return NextResponse.json({ report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
