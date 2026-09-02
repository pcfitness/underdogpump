import { ArrowUpRight, Check, Copy, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { loadClashPicks } from "@/lib/load-markets";
import {
  CLASSROOM_TICKET,
  CLASHPICKS_EXAMPLES,
  isUfcQuestion,
  isUsOpenQuestion,
  pickClashTicket,
  shareTicketText,
  splitQuestion,
  type Market,
} from "@/lib/markets";

function eventLabel(event: string) {
  return event.replace(/^Tennis:\s*/i, "").replace(/\s*Winner$/i, "").trim() || event;
}

export function DogTicket() {
  const [market, setMarket] = useState<Market>(CLASSROOM_TICKET);
  const [copied, setCopied] = useState<"card" | "link" | null>(null);

  useEffect(() => {
    let cancelled = false;
    const wanted =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("dog") : null;
    const pull = () => {
      loadClashPicks()
        .then((rows) => {
          if (cancelled) return;
          const list = Array.isArray(rows) && rows.length ? rows : CLASHPICKS_EXAMPLES;
          setMarket(pickClashTicket(list, wanted));
        })
        .catch(() => {
          if (!cancelled) setMarket(pickClashTicket(CLASHPICKS_EXAMPLES, wanted));
        });
    };
    pull();
    const timer = window.setInterval(pull, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const parts = splitQuestion(market.question);
  const live = market.source === "ClashPicks" && Boolean(market.href);
  const ufc = isUfcQuestion(market.question);
  const usOpen = isUsOpenQuestion(market.question);
  const person = ufc ? "fighter" : "player";
  const kicker = ufc
    ? "UFC · ClashPicks"
    : usOpen
      ? "US Open · ClashPicks"
      : live
        ? "ClashPicks ticket"
        : "UFC example";
  const opener = ufc
    ? "In a UFC fight, one fighter is the favorite and the other is the underdog."
    : usOpen
      ? "At the US Open, one player is the favorite and the other is the underdog."
      : "One side is the favorite and the other is the underdog.";
  const favoriteName = market.favorite?.trim() || null;
  const dogName = parts.pick && parts.pick !== "Long shot" ? parts.pick : null;
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?dog=${encodeURIComponent(market.id)}#ticket`
      : `https://underdogpump.xyz/?dog=${encodeURIComponent(market.id)}#ticket`;

  const flash = (kind: "card" | "link") => {
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  };

  return (
    <section className="border-b border-line bg-surface" id="ticket">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
              Dog of the moment
            </p>
            <h2 className="font-display text-4xl tracking-wide text-fg">The ticket</h2>
          </div>
          <p className="font-mono text-xs tracking-widest text-muted uppercase">
            {live ? "Live · ClashPicks" : "Example"}
          </p>
        </div>
        <article className="mt-6 overflow-hidden rounded-xl border border-line bg-elevated">
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
              {kicker}
            </p>
            <h3 className="mt-2 font-display text-4xl tracking-wide text-fg sm:text-5xl">
              {eventLabel(parts.event)}
            </h3>

            <div className="mt-6 max-w-xl text-base leading-6 text-muted">
              <p className="text-fg">{opener}</p>
              <ul className="mt-4 space-y-1.5 border-l border-line pl-4">
                <li>The favorite is the {person} expected to win.</li>
                <li>The underdog is the {person} expected to lose.</li>
              </ul>
              <p className="mt-5 text-fg">
                Now imagine you wager $5 on the favorite or $5 on the underdog.
              </p>
              <ul className="mt-4 space-y-1.5 border-l border-accent/50 pl-4">
                <li>If the favorite wins, your $5 wager wins you less money.</li>
                <li>
                  If the underdog wins, your $5 wager wins you{" "}
                  <span className="text-accent">more money</span>.
                </li>
              </ul>
              <p className="mt-5 text-fg">
                Why? Because the underdog was considered less likely to win.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-line bg-bg/70 px-4 py-5">
                <p className="text-[0.7rem] font-semibold tracking-widest text-muted uppercase">
                  The favorite
                </p>
                <p className="mt-2 font-display text-3xl leading-none tracking-wide text-muted">
                  {favoriteName ?? "expected to win"}
                </p>
                <p className="mt-3 text-sm text-muted">Expected to win.</p>
                <p className="mt-2 font-mono text-sm tracking-wide text-muted">
                  $5 wager
                  <span className="mx-2 text-subtle">→</span>
                  lower potential profit
                </p>
              </div>
              <div className="rounded-lg border border-accent/60 bg-accent/10 px-4 py-5">
                <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                  The underdog
                </p>
                <p className="mt-2 font-display text-3xl leading-none tracking-wide text-accent">
                  {dogName ?? "expected to lose"}
                </p>
                <p className="mt-3 text-sm text-fg">Expected to lose.</p>
                <p className="mt-2 font-mono text-sm tracking-wide text-fg">
                  $5 wager
                  <span className="mx-2 text-accent">→</span>
                  higher potential profit
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-xl text-base leading-6 text-fg">
              That’s what an underdog is: the side expected to lose, with a bigger potential reward if
              they win.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-line px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={async () => {
                const text = shareTicketText(shareUrl, market);
                if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
                  try {
                    await navigator.share({
                      title: "$UNDERDOG · Dog of the moment",
                      text,
                      url: shareUrl,
                    });
                    return;
                  } catch {
                    /* fall through to clipboard */
                  }
                }
                await navigator.clipboard.writeText(text);
                flash("card");
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg hover:bg-accent-dim"
            >
              <Share2 className="size-4" />
              {copied === "card" ? "Copied the take" : "Share this ticket"}
            </button>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(shareUrl);
                flash("link");
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-bg/60 px-4 py-2.5 text-sm font-semibold text-fg hover:border-accent"
            >
              {copied === "link" ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied === "link" ? "Link copied" : "Copy link"}
            </button>
            {market.href ? (
              <a
                href={market.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-fg no-underline hover:border-accent"
              >
                Open on ClashPicks
                <ArrowUpRight className="size-4" />
              </a>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}
