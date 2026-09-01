import { createServerFn } from "@tanstack/react-start";
import type { Longshot } from "@/lib/content";
import { diverseLongshots } from "@/lib/feed";

export const getClashPicks = createServerFn({ method: "GET" }).handler(async (): Promise<Longshot[]> => {
  const res = await fetch("https://www.clashpicks.com/", {
    headers: {
      Accept: "text/html",
      "User-Agent": "UnderdogPump/1.0 (public market display; +https://underdogpump.xyz)",
    },
  });
  if (!res.ok) throw new Error(`clashpicks ${res.status}`);
  const html = await res.text();
  return parseClashHome(html);
});

function parseClashHome(html: string): Longshot[] {
  const u = html.replace(/\\"/g, '"').replace(/\\\//g, "/");
  const events = [...u.matchAll(/"title":"([^"]+)","slug":"([^"]+)"/g)].map((m) => ({
    title: decodeEscapes(m[1]),
    slug: m[2],
    index: m.index ?? 0,
  }));

  const out: Longshot[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const start = u.indexOf(`"slug":"${event.slug}"`, event.index);
    if (start < 0) continue;
    const end = i + 1 < events.length ? u.indexOf(`"slug":"${events[i + 1].slug}"`, start + 10) : start + 12000;
    const block = u.slice(start, end > start ? end : start + 12000);
    const markets = [...block.matchAll(/"title":"([^"]+)"[\s\S]{0,280}?"yesPercentage":([0-9.]+)/g)];

    for (const mk of markets) {
      const pick = decodeEscapes(mk[1]);
      if (!pick || pick === event.title) continue;
      if (/^other$/i.test(pick)) continue;
      const pct = Number(mk[2]);
      if (!(pct >= 1.5) || pct > 28) continue;
      const key = `${event.slug}:${pick}`.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const implied = pct / 100;
      out.push({
        id: key,
        question: `${event.title} — ${pick}`,
        implied: formatImplied(implied),
        impliedValue: implied,
        source: "ClashPicks",
        href: `https://www.clashpicks.com/event/${event.slug}`,
      });
    }
  }

  return diverseLongshots(out, 8);
}

function formatImplied(p: number): string {
  const pct = p * 100;
  if (pct < 10) return `${pct.toFixed(1)}%`;
  return `${Math.round(pct)}%`;
}

function decodeEscapes(value: string): string {
  return value
    .replace(/\\u003e/gi, ">")
    .replace(/\\u003c/gi, "<")
    .replace(/\\u0026/gi, "&")
    .replace(/&/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/"/g, '"');
}
