import type { Longshot } from "@/lib/content";

/** Pick a shareable dog: ClashPicks first, 4–18%, skip leftover "Other" buckets. */
export function pickMoment(rows: Longshot[], preferredId?: string | null): Longshot | null {
  if (preferredId) {
    const hit = rows.find((row) => row.id === preferredId);
    if (hit) return hit;
  }
  const clash = rows.filter((row) => row.source === "ClashPicks");
  const pool = clash.length ? clash : rows;
  const story = pool.filter((row) => {
    const p = row.impliedValue ?? 0;
    return p >= 0.04 && p <= 0.18 && !/— Other$/i.test(row.question);
  });
  const use = story.length ? story : pool;
  return [...use].sort((a, b) => (a.impliedValue ?? 1) - (b.impliedValue ?? 1))[0] ?? null;
}

export function nFromImplied(p: number): number {
  if (!(p > 0)) return 10;
  return Math.max(2, Math.round(1 / p));
}

export function oneInN(p: number): string {
  return `1 in ${nFromImplied(p)}`;
}

export function dollarsForOne(p: number): number {
  return nFromImplied(p);
}

export function shareCopy(row: Longshot, url: string): string {
  const p = row.impliedValue ?? 0;
  const n = nFromImplied(p);
  return [
    `$UNDERDOG · Dog of the moment`,
    `${row.question}`,
    `${row.source} pays $${n} for every $1 if this hits.`,
    `Things priced like this hit about 1 time in ${n}. That's why it pays — it usually loses.`,
    url,
  ].join("\n");
}

export function splitQuestion(question: string): { event: string; pick: string } {
  const idx = question.indexOf(" — ");
  if (idx < 0) return { event: question, pick: "Long shot" };
  return { event: question.slice(0, idx), pick: question.slice(idx + 3) };
}
