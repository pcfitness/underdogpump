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
import { payoutFromImplied } from "@/lib/odds";

function WhyTheDogPays({ payout }: { payout: number }) {
  const pile = Math.max(2, Math.round(payout));
  return (
    <div className="mt-8 max-w-lg">
      <p className="text-[0.65rem] font-semibold tracking-widest text-subtle uppercase">
        Same $1.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-md border border-line bg-bg/70 px-4 py-5">
          <p className="text-[0.65rem] font-semibold tracking-widest text-muted uppercase">
            Everybody's team
          </p>
          <p className="mt-4 font-display text-5xl leading-none tracking-wide text-muted">snack</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            The famous team. They win all the time.
          </p>
        </div>
        <div className="rounded-md border border-accent/50 bg-accent/10 px-4 py-5">
          <p className="text-[0.65rem] font-semibold tracking-widest text-accent uppercase">
            The little dog
          </p>
          <div className="mt-4 flex items-center gap-2">
            <img
              src="/token-avatar.jpg"
              alt=""
              className="size-9 rounded-full border border-accent object-contain"
            />
            <p className="font-display text-5xl leading-none tracking-wide text-accent">${pile}</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-fg">
            Nobody thinks he wins. If he does, you get the whole pizza.
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Harder thing. Bigger prize. That’s betting on the underdog.
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
  const payout = payoutFromImplied(market.impliedValue ?? 0);
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
            {classroom ? "Classroom example" : `${market.source} example`}
          </p>
        </div>
        <article className="mt-6 overflow-hidden rounded-xl border border-line bg-elevated">
          <div className="grid gap-0 md:grid-cols-[1.3fr_0.7fr]">
            <div className="relative bg-elevated px-5 py-6 sm:px-8 sm:py-8">
              <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                {classroom ? "Classroom ticket" : `${market.source} ticket`}
              </p>
              <p className="mt-4 text-lg leading-snug font-medium text-muted">{parts.event}</p>
              <h3 className="mt-1 font-display text-5xl leading-none tracking-wide text-fg">
                {parts.pick}
              </h3>
              <p className="mt-6 max-w-lg text-xl leading-snug text-fg">
                This ticket pays{" "}
                <span className="text-accent">${payout} for every $1</span> if the dog hits.
              </p>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">
                A {payout}-to-1 underdog is priced to win about{" "}
                <span className="text-fg">1 time in {payout}</span>. That’s why it pays. Not because
                it’s a secret. Because it usually loses.
              </p>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">
                Only interesting if you think the dog wins <span className="text-fg">more often</span>{" "}
                than 1 in {payout}.
              </p>
              <WhyTheDogPays payout={payout} />
            </div>
            <div className="flex flex-col justify-between gap-6 border-t border-line bg-elevated px-5 py-6 sm:px-8 sm:py-8 md:border-t-0 md:border-l">
              <p className="text-sm leading-relaxed text-muted">
                {classroom
                  ? "A made-up ticket so the math is obvious. Same idea as a real long shot on ClashPicks or Polymarket. Not a bet. A question."
                  : `Public price from ${market.source}. $UNDERDOG is not affiliated. Nothing here is a recommendation to buy the pick or the token. Not a bet. A question.`}
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
