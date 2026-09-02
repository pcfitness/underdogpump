import { ArrowUpRight, Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

const SHARE_PATH = "/odds-101#parlays";
const CLASHPICKS_URL = "https://www.clashpicks.com/";

const PICKS = [
  { n: "1", event: "UFC Fight 1", side: "Favorite", result: "hit" as const },
  { n: "2", event: "UFC Fight 2", side: "Favorite", result: "miss" as const },
  { n: "3", event: "UFC Fight 3", side: "Favorite", result: "hit" as const },
];

export function Parlays() {
  const [copied, setCopied] = useState<"card" | "link" | null>(null);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${SHARE_PATH}`
      : `https://underdogpump.xyz${SHARE_PATH}`;

  const shareText =
    "A parlay is more than one pick on the same ticket. Every pick has to win. If one pick loses, you get nothing. " +
    shareUrl;

  const flash = (kind: "card" | "link") => {
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  };

  return (
    <section className="border-y border-line" id="parlays">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
          Next lesson
        </p>
        <h2 className="font-display text-5xl tracking-wide text-fg sm:text-6xl">Parlays</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          A parlay is more than one pick on the same ticket. Every pick has to win. If one pick
          loses, the whole ticket pays $0.
        </p>

        <article className="mt-8 overflow-hidden rounded-xl border border-line bg-elevated">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line px-5 py-4 sm:px-8">
            <div>
              <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                Example ticket
              </p>
              <p className="font-display text-2xl tracking-wide text-fg">3 favorites, one slip</p>
            </div>
            <p className="font-mono text-xs tracking-widest text-muted uppercase">Saturday card</p>
          </div>

          <ol className="divide-y divide-line">
            {PICKS.map((pick) => {
              const missed = pick.result === "miss";
              return (
                <li
                  key={pick.n}
                  className={`flex items-center gap-4 px-5 py-4 sm:px-8 ${
                    missed ? "bg-accent/10" : "bg-transparent"
                  }`}
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 font-display text-lg ${
                      missed
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-line bg-bg text-muted"
                    }`}
                  >
                    {missed ? "X" : pick.n}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-display text-xl tracking-wide ${
                        missed ? "text-fg line-through" : "text-fg"
                      }`}
                    >
                      {pick.event}
                    </p>
                    <p className="text-sm text-muted">{pick.side}</p>
                  </div>
                  <p
                    className={`shrink-0 font-mono text-xs tracking-widest uppercase ${
                      missed ? "text-accent" : "text-muted"
                    }`}
                  >
                    {missed ? "Missed" : "Won"}
                  </p>
                </li>
              );
            })}
          </ol>

          <div className="flex flex-wrap items-end justify-between gap-3 border-t border-line bg-bg/55 px-5 py-5 sm:px-8">
            <div>
              <p className="text-[0.7rem] font-semibold tracking-widest text-muted uppercase">
                If every pick hits
              </p>
              <p className="font-display text-3xl tracking-wide text-muted line-through">+$480</p>
            </div>
            <div className="text-right">
              <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                What you get
              </p>
              <p className="font-display text-5xl leading-none tracking-wide text-accent">$0</p>
            </div>
          </div>

          <p className="border-t border-line px-5 py-4 text-base leading-relaxed text-fg sm:px-8">
            Two wins do not matter. Fight 2 lost, so the ticket is dead. That is why a parlay can
            pay a lot. It is also why it usually pays nothing.
          </p>

          <div className="flex flex-wrap gap-2 border-t border-line px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={async () => {
                if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
                  try {
                    await navigator.share({
                      title: "$UNDERDOG \u00b7 Parlays",
                      text: shareText,
                      url: shareUrl,
                    });
                    return;
                  } catch {
                    /* fall through */
                  }
                }
                await navigator.clipboard.writeText(shareText);
                flash("card");
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg hover:bg-accent-dim"
            >
              <Share2 className="size-4" />
              {copied === "card" ? "Copied" : "Share this ticket"}
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
            <a
              href={CLASHPICKS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-fg no-underline hover:border-accent"
            >
              Open ClashPicks
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
