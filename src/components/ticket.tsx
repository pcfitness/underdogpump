import { useState } from "react";
import { ArrowUpRight, Check, Copy, Share2 } from "lucide-react";
import { splitQuestion } from "@/lib/odds";
import { isFight, isOpen, ticketShareText, type LivePick } from "@/lib/markets";

function eventTitle(event: string) {
  return event.replace(/^Tennis:\s*/i, "").replace(/\s*Winner$/i, "").trim() || event;
}

export function Ticket({ pick }: { pick: LivePick }) {
  const parts = splitQuestion(pick.question);
  const live = pick.source === "Kalshi" && !!pick.href;
  const fight = isFight(pick.question);
  const open = isOpen(pick.question);
  const noun = fight ? "fighter" : "player";
  const kicker = fight
    ? "UFC · Kalshi"
    : open
      ? "US Open · Kalshi"
      : live
        ? "Kalshi ticket"
        : "UFC example";
  const setup = fight
    ? "In a UFC fight, one fighter is the favorite and the other is the underdog."
    : open
      ? "At the US Open, one player is the favorite and the other is the underdog."
      : "One side is the favorite and the other is the underdog.";
  const favorite = pick.favorite?.trim() || null;
  const underdog = parts.pick && parts.pick !== "Long shot" ? parts.pick : null;
  const [copied, setCopied] = useState<"card" | "link" | null>(null);

  function flash(kind: "card" | "link") {
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  }

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?dog=${encodeURIComponent(pick.id)}#ticket`
      : `https://underdogpump.xyz/?dog=${encodeURIComponent(pick.id)}#ticket`;

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
            {live ? "Live · Kalshi" : "Example"}
          </p>
        </div>
        <article className="mt-6 overflow-hidden rounded-xl border border-line bg-elevated">
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
              {kicker}
            </p>
            <h3 className="mt-2 font-display text-4xl tracking-wide text-fg sm:text-5xl">
              {eventTitle(parts.event)}
            </h3>
            <div className="mt-6 max-w-xl text-base leading-6 text-muted">
              <p className="text-fg">{setup}</p>
              <ul className="mt-4 space-y-1.5 border-l-2 border-accent pl-4 leading-snug">
                <li>The favorite is the {noun} expected to win.</li>
                <li>The underdog is the {noun} expected to lose.</li>
              </ul>
              <p className="mt-5 text-fg">
                Now imagine you wager $5 on the favorite or $5 on the underdog.
              </p>
              <ul className="mt-4 space-y-1.5 border-l-2 border-accent pl-4 leading-snug">
                <li>If the favorite wins, your $5 wager wins you less money.</li>
                <li>
                  If the underdog wins, your $5 wager wins you{" "}
                  <span className="text-accent">more money</span>.
                </li>
              </ul>
              <p className="mt-5 text-fg">Why? Because the underdog was considered less likely to win.</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-line bg-bg/70 px-4 py-5">
                <p className="text-[0.7rem] font-semibold tracking-widest text-muted uppercase">
                  The favorite
                </p>
                <p className="mt-2 font-display text-3xl leading-none tracking-wide text-muted">
                  {favorite ?? "expected to win"}
                </p>
                <p className="mt-3 text-sm text-muted">Expected to win.</p>
                <p className="mt-2 font-mono text-sm tracking-wide text-muted">
                  $5 wager<span className="mx-2 text-subtle">→</span>lower potential profit
                </p>
              </div>
              <div className="rounded-lg border border-accent/60 bg-accent/10 px-4 py-5">
                <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                  The underdog
                </p>
                <p className="mt-2 font-display text-3xl leading-none tracking-wide text-accent">
                  {underdog ?? "expected to lose"}
                </p>
                <p className="mt-3 text-sm text-fg">Expected to lose.</p>
                <p className="mt-2 font-mono text-sm tracking-wide text-fg">
                  $5 wager<span className="mx-2 text-accent">→</span>higher potential profit
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-line px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={async () => {
                const text = ticketShareText(shareUrl, pick);
                if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
                  try {
                    await navigator.share({
                      title: "$UNDERDOG · Dog of the moment",
                      text,
                      url: shareUrl,
                    });
                    return;
                  } catch {
                    /* fall through */
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
            {pick.href ? (
              <a
                href={pick.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-fg no-underline hover:border-accent"
              >
                Open on Kalshi
                <ArrowUpRight className="size-4" />
              </a>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}
