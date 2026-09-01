import type { Longshot } from "@/lib/content";

/** One market per event, no lookalike questions, rotate every 30 minutes. */
export function diverseLongshots(rows: Longshot[], limit = 8): Longshot[] {
  const byEvent = new Map<string, Longshot>();
  for (const row of rows) {
    const event = eventKey(row);
    const prev = byEvent.get(event);
    if (!prev || (row.impliedValue ?? 99) < (prev.impliedValue ?? 99)) {
      byEvent.set(event, row);
    }
  }

  const seenQ = new Set<string>();
  const unique: Longshot[] = [];
  for (const row of byEvent.values()) {
    const q = normQuestion(row.question);
    if (!q || seenQ.has(q)) continue;
    seenQ.add(q);
    unique.push(row);
  }

  const seed = Math.floor(Date.now() / (30 * 60 * 1000));
  return seededShuffle(unique, seed).slice(0, limit);
}

function eventKey(row: Longshot): string {
  const href = row.href ?? "";
  const hit = href.match(/\/(?:event|market)\/([^/?#]+)/i);
  if (hit) return hit[1].toLowerCase();
  const event = row.question.split(" — ")[0] ?? row.question;
  return normQuestion(event);
}

function normQuestion(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .slice(0, 56);
}

function seededShuffle<T>(list: T[], seed: number): T[] {
  const out = [...list];
  let s = seed + 1;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
