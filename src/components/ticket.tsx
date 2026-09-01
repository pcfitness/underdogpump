import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy, Share2 } from "lucide-react";
import { HitStrip } from "@/components/hit-strip";
import { CLASH_FALLBACK, pickDog, shareTicket, splitQuestion, type MarketRow } from "@/lib/markets";
import { loadClashPicks } from "@/lib/markets.fn";
import { payoutFromImplied } from "@/lib/odds";

export function DogTicket() {
  const [dog, setDog] = useState<MarketRow | null>(null);
  const [clock, setClock] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const wanted = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("dog") : null;
    const pull = () => {
      loadClashPicks()
        .then((rows) => {
          if (cancelled) return;
          const next = pickDog(rows.length ? rows : CLASH_FALLBACK, wanted);
          setDog(next);
          setLive(rows.length >= 3);
          setClock(formatClock(new Date()));
        })
        .catch(() => {
          if (cancelled) return;
          setDog((prev) => prev ?? pickDog(CLASH_FALLBACK, wanted));
          setLive(false);
          setClock(formatClock(new Date()));
        });
    };
    pull();
    const id = window.setInterval(pull, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  if (!dog) {
    return (
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
            Dog of the moment
          </p>
          <div className="mt-4 h-40 rounded-xl border border-line bg-elevated" />
        </div>
      </section>
    );
  }

  const parts = splitQuestion(dog.question);
  const payout = payoutFromImplied(dog.impliedValue ?? 0);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?dog=${encodeURIComponent(dog.id)}`
      : `https://underdogpump.xyz/?dog=${encodeURIComponent(dog.id)}`;

  const flash = (key: string) => {
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1600);
  };

  return (
    <section className="border-b border-line bg-surface" id="ticket">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
              Dog of the moment
            </p>
            <h2 className="font-display text-4xl tracking-wide text-fg">The ticket</h2>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            {live ? "Live · ClashPicks" : "Classroom example"}
            {clock ? ` · ${clock}` : ""}
          </p>
        </div>
        <article className="mt-6 overflow-hidden rounded-xl border border-line bg-elevated">
          <div className="grid gap-0 md:grid-cols-[1.3fr_0.7fr]">
            <div className="relative bg-elevated px-5 py-6 sm:px-8 sm:py-8">
              <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-accent">
                {dog.source} ticket
              </p>
              <p className="mt-4 text-lg font-medium leading-snug text-muted">{parts.event}</p>
              <h3 className="mt-1 font-display text-5xl leading-none tracking-wide text-fg">
                {parts.pick}
              </h3>
              <p className="mt-6 max-w-lg text-xl leading-snug text-fg">
                {dog.source} will pay you{" "}
                <span className="text-accent">
                  ${payout} for every $1
                </span>{" "}
                if this hits.
              </p>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">
                Things priced like this hit about{" "}
                <span className="text-fg">1 time in {payout}</span>. That’s why it pays. Not
                because it’s a secret. Because it usually loses.
              </p>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">
                Only interesting if you think it happens <span className="text-fg">more often</span>{" "}
                than 1 in {payout}.
              </p>
              <HitStrip payout={payout} />
            </div>
            <div className="flex flex-col justify-between gap-6 border-t border-line bg-elevated px-5 py-6 md:border-l md:border-t-0 sm:px-8 sm:py-8">
              <p className="text-sm leading-relaxed text-muted">
                Public price from {dog.source}. $UNDERDOG is not affiliated. Nothing here is a
                recommendation to buy the pick or the token. Not a bet. A question.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const text = shareTicket(dog, shareUrl);
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
                {dog.href ? (
                  <a
                    href={dog.href}
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

function formatClock(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
