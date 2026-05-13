import Anthropic from "@anthropic-ai/sdk";
import { SECTORS } from "@/lib/data/sectors";
import { STOCKS } from "@/lib/data/stocks";
import { CATALYSTS } from "@/lib/data/catalysts";
import { RISKS } from "@/lib/data/risks";

const getClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey });
};

const SYSTEM_PROMPT = `You are an expert investment research analyst specializing in AI infrastructure,
semiconductors, optical connectivity, robotics, defense/drones, rare earth materials, power/cooling
infrastructure, and high-growth technology stocks.

Your role is to help organize research, explain complex topics clearly, identify bottlenecks and catalysts,
assess risks, and provide actionable investment insights.

Always be clear when something is your analysis vs established fact. Never provide financial advice —
frame everything as research and educational content. Use plain language alongside technical terms,
and always explain the "why" behind your analysis.`;

function buildContext() {
  return `
Current tracked sectors: ${SECTORS.map((s) => s.name).join(", ")}

Key bottlenecks:
${SECTORS.map((s) => `- ${s.name}: ${s.bottleneck}`).join("\n")}

Watchlist stocks: ${STOCKS.map((s) => `${s.ticker} (${s.sector})`).join(", ")}

Active catalysts:
${CATALYSTS.filter((c) => c.status !== "completed")
  .map((c) => `- ${c.title} (${c.expectedDate}, ${c.impact} impact)`)
  .join("\n")}

Key risks:
${RISKS.filter((r) => r.severity === "high")
  .map((r) => `- ${r.title} (${r.category}, ${r.probability} probability)`)
  .join("\n")}
`.trim();
}

export async function generateWeeklyReport(): Promise<string> {
  const client = getClient();
  const context = buildContext();

  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Generate a weekly AI investing research report based on the following portfolio context.

${context}

Structure the report as:
1. **Executive Summary** (2-3 sentences, the most important things to know this week)
2. **Sector Updates** (brief update on each of the 8 sectors — what's changed, what to watch)
3. **Catalyst Watch** (which active catalysts are most time-sensitive right now)
4. **Risk Alerts** (any risks that have increased in probability or severity)
5. **Action Items** (3-5 specific, concrete things to do or watch this week)
6. **Beginner Corner** (explain ONE concept from this week's report in simple terms)

Keep the tone analytical but accessible. Be direct and specific.`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  return content.text;
}

export async function explainConcept(concept: string): Promise<string> {
  const client = getClient();

  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 800,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Explain "${concept}" as it relates to investing in AI infrastructure and technology.

Requirements:
- Start with a one-sentence plain-English definition
- Explain WHY it matters for investors
- Give a concrete real-world example
- Mention 1-2 public companies most directly affected
- End with the key thing an investor should track

Keep it under 300 words. Use simple language — imagine explaining to a smart friend who knows nothing about this topic.`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  return content.text;
}

export async function analyzeStock(ticker: string): Promise<string> {
  const client = getClient();
  const stock = STOCKS.find((s) => s.ticker === ticker);
  const context = buildContext();

  const stockContext = stock
    ? `
Stock: ${stock.ticker} (${stock.name})
Sector: ${stock.sector}
Our thesis: ${stock.thesis}
Risk level: ${stock.riskLevel}
Conviction: ${stock.conviction}/5
Timeframe: ${stock.timeframe}
Tags: ${stock.tags.join(", ")}
`
    : `Stock: ${ticker} (not in our watchlist)`;

  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 1200,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Provide a research analysis for ${ticker}.

${stockContext}

Portfolio context:
${context}

Structure your response as:
1. **Business Overview** (what the company does in plain English)
2. **Investment Thesis** (why this is or isn't interesting)
3. **Key Risks** (top 3 specific risks for this company)
4. **Catalysts to Watch** (what events would confirm or disprove the thesis)
5. **Verdict** (buy/watch/avoid and why, with conviction level)

Be direct and specific. Max 400 words.`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  return content.text;
}
