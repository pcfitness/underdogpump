import { ArrowUpRight, Check, Copy, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CLASHPICKS_EXAMPLES,
  clockLabel,
  pickDog,
  shareTicketText,
  splitQuestion,
  type Market,
} from "@/lib/markets";
import { loadClashPicks } from "@/lib/load-markets";
import { payoutFromImplied } from "@/lib/odds";

function HitStrip({ payout }: { payout: number }) {
  const total = Math.max(2, Math.round(payout));
  const shown = Math.min(total, 32);
  const misses = total - 1;
  return (
    <div className="mt-8">
      <p className="text-[0.65rem] font-semibold tracking-widest text-subtle uppercase">
        1 red hit · {misses} {misses === 1 ? "miss" : "misses"}
      </p>
      <div
        className="mt-3 grid h-2 w-full gap-px sm:h-2.5"
        style={{ gridTemplateColumns: `repeat(${shown}, minmax(0, 1fr))` }}
        aria-hidden="true"
      >
        {Array.from({ length: shown }, (_, index) => (
          <span
            key={index}
            className={index === 0 ? "hit-pip rounded-sm bg-accent" : "rounded-sm bg-line"}
          />
        ))}
      </div>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
        {shown} pips. One red. That is a {total}x. It hits about{" "}
        <span className="text-fg">1 time in {total}</span>
        {total > shown ? ` — strip shows the first ${shown}.` : "."} That is why it pays.
      </p>
    </div>
  );
}

export function DogTicket() {
  const [market, setMarket] = useState<Market | null>(() => pickDog(CLASHPICKS_EXAMPLES, null));
  const [clock, setClock] = useState("");
  const [copied, setCopied] = useState<"card" | "link" | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const dog =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("dog") : null;
    const pull = () => {
      loadClashPicks()
        .then((list) => {
          if (cancelled) return;
          const rows = Array.isArray(list) ? list : CLASHPICKS_EXAMPLES;
          const next = pickDog(rows.length ? rows : CLASHPICKS_EXAMPLES, dog);
          setMarket(next);
          setLive(rows.length >= 3);
          setClock(clockLabel(new Date()));
        })
        .catch(() => {
          if (cancelled) return;
          setMarket((current) => current ?? pickDog(CLASHPICKS_EXAMPLES, dog));
          setLive(false);
          setClock(clockLabel(new Date()));
        });
    };
    pull();
    const timer = window.setInterval(pull, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  if (!market) {
    return (
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
            Dog of the moment
          </p>
          <div className="mt-4 h-40 rounded-xl border border-line bg-elevated" />
        </div>
      </section>
    );
  }

  const parts = splitQuestion(market.question);
  const payout = payoutFromImplied(market.impliedValue ?? 0);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?dog=${encodeURIComponent(market.id)}`
      : `https://underdogpump.xyz/?dog=${encodeURIComponent(market.id)}`;

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
            {live ? "Live · ClashPicks" : "Classroom example"}
            {clock ? ` · ${clock}` : ""}
          </p>
        </div>
        <article className="mt-6 overflow-hidden rounded-xl border border-line bg-elevated">
          <div className="grid gap-0 md:grid-cols-[1.3fr_0.7fr]">
            <div className="relative bg-elevated px-5 py-6 sm:px-8 sm:py-8">
              <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                {market.source} ticket
              </p>
              <p className="mt-4 text-lg leading-snug font-medium text-muted">{parts.event}</p>
              <h3 className="mt-1 font-display text-5xl leading-none tracking-wide text-fg">
                {parts.pick}
              </h3>
              <p className="mt-6 max-w-lg text-xl leading-snug text-fg">
                {market.source} will pay you{" "}
                <span className="text-accent">${payout} for every $1</span> if this hits.
              </p>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">
                Things priced like this hit about{" "}
                <span className="text-fg">1 time in {payout}</span>. That’s why it pays. Not because
                it’s a secret. Because it usually loses.
              </p>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">
                Only interesting if you think it happens <span className="text-fg">more often</span>{" "}
                than 1 in {payout}.
              </p>
              <HitStrip payout={payout} />
            </div>
            <div className="flex flex-col justify-between gap-6 border-t border-line bg-elevated px-5 py-6 sm:px-8 sm:py-8 md:border-t-0 md:border-l">
              <p className="text-sm leading-relaxed text-muted">
                Public price from {market.source}. $UNDERDOG is not affiliated. Nothing here is a
                recommendation to buy the pick or the token. Not a bet. A question.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const text = shareTicketText(market, shareUrl);
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
