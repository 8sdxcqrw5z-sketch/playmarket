export const BUY_HURDLE_PERCENT = 15;

export const CONVICTION_LABELS: Record<number, string> = {
  5: "BUY — cleared 15% hurdle",
  4: "WATCH — real bottleneck thesis, waiting on entry",
  3: "WATCH — crowded or fully priced",
  2: "Interesting — thesis underdeveloped",
  1: "Passed — failed bottleneck rule or crowded",
};

export const CONVICTION_DESCRIPTIONS: Record<number, string> = {
  5: "Passed the bottleneck test and implies ≥15% return at current entry",
  4: "Strong bottleneck thesis but entry price not yet at the hurdle",
  3: "Real bottleneck business but trade is consensus or fully priced",
  2: "Interesting angle but thesis needs more research before sizing",
  1: "Evaluated and passed — failed bottleneck rule, too crowded, or single-customer risk",
};
