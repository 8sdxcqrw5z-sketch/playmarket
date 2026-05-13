import { NextRequest, NextResponse } from "next/server";
import { explainConcept } from "@/lib/ai/claude";

export async function POST(req: NextRequest) {
  try {
    const { concept } = await req.json();
    if (!concept || typeof concept !== "string") {
      return NextResponse.json({ error: "concept is required" }, { status: 400 });
    }
    const explanation = await explainConcept(concept);
    return NextResponse.json({ explanation });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
