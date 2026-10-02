import type { OptimizerEvent } from "./types";

export type AiRead = {
  modelWin: number;
  reason: string;
};

export async function readUnderdog(event: OptimizerEvent, bookWin: number | null): Promise<AiRead | null> {
  const key = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
  if (!key || bookWin === null) return null;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Estimate the underdog win probability for education only. Use only the facts given. Do not invent a record, injury, or camp note. Return JSON with modelWin as a number from 0.02 to 0.8 and reason as one sentence under 140 characters. modelWin must be your own chance, not a copy of the book.",
        },
        {
          role: "user",
          content: JSON.stringify({
            sport: event.sport,
            event: event.eventName,
            underdog: event.underdog,
            favorite: event.favorite,
            bookWin,
            bookCount: event.bookCount,
          }),
        },
      ],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) return null;
  const parsed = JSON.parse(text) as { modelWin?: unknown; reason?: unknown };
  const modelWin = Number(parsed.modelWin);
  if (!Number.isFinite(modelWin)) return null;
  return {
    modelWin: Math.min(0.8, Math.max(0.02, modelWin)),
    reason: String(parsed.reason || "Model read from the posted facts.").slice(0, 180),
  };
}
