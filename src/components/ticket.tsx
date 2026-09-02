import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { shareTicketText } from "@/lib/markets";

function Line({ children }: { children: string }) {
  return <p className="max-w-2xl text-lg leading-relaxed text-muted">{children}</p>;
}

export function DogTicket() {
  const [copied, setCopied] = useState<"card" | "link" | null>(null);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/#ticket`
      : "https://underdogpump.xyz/#ticket";

  const flash = (kind: "card" | "link") => {
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  };

  return (
    <section className="border-b border-line bg-surface" id="ticket">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div>
          <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
            Dog of the moment
          </p>
          <h2 className="font-display text-4xl tracking-wide text-fg">The ticket</h2>
        </div>
        <article className="mt-6 overflow-hidden rounded-xl border border-line bg-elevated">
          <div className="px-5 py-6 sm:px-8 sm:py-10">
            <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
              UFC example
            </p>
            <h3 className="mt-3 font-display text-6xl leading-[0.85] tracking-wide text-accent sm:text-8xl">
              THE UNDERDOG
            </h3>

            <div className="mt-8 space-y-4">
              <p className="max-w-2xl text-xl leading-snug text-fg">
                In a UFC fight, one fighter is the favorite and the other is the underdog.
              </p>
              <Line>The favorite is the fighter expected to win.</Line>
              <Line>The underdog is the fighter expected to lose.</Line>
              <p className="max-w-2xl pt-2 text-xl leading-snug text-fg">
                Now imagine you wager $5 on the favorite or $5 on the underdog.
              </p>
              <Line>If the favorite wins, your $5 wager wins you less money.</Line>
              <p className="max-w-2xl text-lg leading-relaxed text-muted">
                If the underdog wins, your $5 wager wins you{" "}
                <span className="text-accent">more money</span>.
              </p>
              <p className="max-w-2xl text-lg leading-relaxed text-fg">
                Why? Because the underdog was considered less likely to win.
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-line bg-bg/70 px-5 py-6">
                <p className="text-[0.7rem] font-semibold tracking-widest text-muted uppercase">
                  The favorite
                </p>
                <p className="mt-3 font-display text-4xl leading-none tracking-wide text-muted sm:text-5xl">
                  expected to win
                </p>
                <p className="mt-4 font-mono text-sm tracking-wide text-muted">
                  $5 wager
                  <span className="mx-2 text-subtle">→</span>
                  lower potential profit
                </p>
              </div>
              <div className="rounded-lg border border-accent/60 bg-accent/10 px-5 py-6">
                <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                  The underdog
                </p>
                <p className="mt-3 font-display text-4xl leading-none tracking-wide text-accent sm:text-5xl">
                  expected to lose
                </p>
                <p className="mt-4 font-mono text-sm tracking-wide text-fg">
                  $5 wager
                  <span className="mx-2 text-accent">→</span>
                  higher potential profit
                </p>
              </div>
            </div>

            <p className="mt-8 max-w-3xl font-display text-3xl leading-none tracking-wide text-fg sm:text-5xl">
              That’s what an underdog is: the side expected to lose, with a bigger potential reward if
              they win.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-line px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={async () => {
                const text = shareTicketText(shareUrl);
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
          </div>
        </article>
      </div>
    </section>
  );
}
