import { ArrowUpRight, Check, Copy, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CLASSROOM_TICKET,
  CLASHPICKS_EXAMPLES,
  pickDog,
  shareTicketText,
  splitQuestion,
  type Market,
} from "@/lib/markets";
import { loadClashPicks } from "@/lib/load-markets";

function UnderdogMeans() {
  return (
    <div className="mt-8 max-w-lg">
      <p className="text-[0.65rem] font-semibold tracking-widest text-subtle uppercase">
        What an underdog is
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-md border border-line bg-bg/70 px-4 py-5">
          <p className="text-[0.65rem] font-semibold tracking-widest text-muted uppercase">
            The favorite
          </p>
          <p className="mt-4 font-display text-3xl leading-none tracking-wide text-muted">
            expected to win
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">Same $1 pays less.</p>
        </div>
        <div className="rounded-md border border-accent/50 bg-accent/10 px-4 py-5">
          <p className="text-[0.65rem] font-semibold tracking-widest text-accent uppercase">
            The underdog
          </p>
          <p className="mt-4 font-display text-3xl leading-none tracking-wide text-accent">
            expected to lose
          </p>
          <p className="mt-3 text-sm leading-relaxed text-fg">Same $1 generally pays more.</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        That’s the word. It does not change because of where you put the wager.
      </p>
    </div>
  );
}

export function DogTicket() {
  const [market, setMarket] = useState<Market>(CLASSROOM_TICKET);
  const [copied, setCopied] = useState<"card" | "link" | null>(null);

  useEffect(() => {
    const dog =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("dog") : null;
    if (!dog) return;
    let cancelled = false;
    loadClashPicks()
      .then((list) => {
        if (cancelled) return;
        const rows = Array.isArray(list) ? list : CLASHPICKS_EXAMPLES;
        setMarket(pickDog(rows, dog));
      })
      .catch(() => {
        if (!cancelled) setMarket(pickDog(CLASHPICKS_EXAMPLES, dog));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const parts = splitQuestion(market.question);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?dog=${encodeURIComponent(market.id)}`
      : `https://underdogpump.xyz/?dog=${encodeURIComponent(market.id)}`;
  const classroom = market.id === CLASSROOM_TICKET.id;

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
            {classroom ? "The word" : `${market.source} example`}
          </p>
        </div>
        <article className="mt-6 overflow-hidden rounded-xl border border-line bg-elevated">
          <div className="grid gap-0 md:grid-cols-[1.3fr_0.7fr]">
            <div className="relative bg-elevated px-5 py-6 sm:px-8 sm:py-8">
              <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                UFC example
              </p>
              <p className="mt-4 text-lg leading-snug font-medium text-muted">{parts.event}</p>
              <h3 className="mt-1 font-display text-5xl leading-none tracking-wide text-fg">
                {parts.pick}
              </h3>
              <p className="mt-6 max-w-lg text-xl leading-snug text-fg">
                Two fighters. Same $1. One is expected to win. One is expected to lose.
              </p>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">
                The favorite is the fighter everyone expects to win. The underdog is the fighter
                everyone expects to lose.
              </p>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">
                Put the same wager on either one. If the underdog wins, that wager generally{" "}
                <span className="text-fg">pays more</span>.
              </p>
              <UnderdogMeans />
            </div>
            <div className="flex flex-col justify-between gap-6 border-t border-line bg-elevated px-5 py-6 sm:px-8 sm:py-8 md:border-t-0 md:border-l">
              <p className="text-sm leading-relaxed text-muted">
                Not a tip. A definition. Sportsbook, fight night, anywhere you can put a wager — the
                word is the same.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const text = shareTicketText(market, shareUrl);
                    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
                      try {
                        await navigator.share({
                          title: "$UNDERDOG · What an underdog is",
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
                    Open this pick
                    <ArrowUpRight className="size-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
