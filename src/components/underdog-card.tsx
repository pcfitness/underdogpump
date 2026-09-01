import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy, Share2 } from "lucide-react";
import { FALLBACK_CLASHPICKS, type Longshot } from "@/lib/content";
import { getClashPicks } from "@/lib/clashpicks";
import { nFromImplied, pickMoment, shareCopy, splitQuestion } from "@/lib/moment";

export function UnderdogCard() {
  const [row, setRow] = useState<Longshot | null>(null);
  const [asOf, setAsOf] = useState("");
  const [copied, setCopied] = useState<"link" | "card" | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const preferred =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("dog") : null;

    const pull = () => {
      getClashPicks()
        .then((data) => {
          if (cancelled) return;
          const pick = pickMoment(data.length ? data : FALLBACK_CLASHPICKS, preferred);
          setRow(pick);
          setLive(data.length >= 3);
          setAsOf(formatAsOf(new Date()));
        })
        .catch(() => {
          if (cancelled) return;
          setRow((prev) => prev ?? pickMoment(FALLBACK_CLASHPICKS, preferred));
          setLive(false);
          setAsOf(formatAsOf(new Date()));
        });
    };
    pull();
    const timer = window.setInterval(pull, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  if (!row) {
    return (
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
            Dog of the moment
          </p>
          <div className="mt-4 h-40 rounded-xl border border-line bg-elevated" />
        </div>
      </section>
    );
  }

  const parts = splitQuestion(row.question);
  const p = row.impliedValue ?? 0;
  const n = nFromImplied(p);
  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/?dog=${encodeURIComponent(row.id)}`
      : `https://underdogpump.xyz/?dog=${encodeURIComponent(row.id)}`;

  const flash = (kind: "link" | "card") => {
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1600);
  };

  const onShare = async () => {
    const text = shareCopy(row, pageUrl);
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "$UNDERDOG · Dog of the moment", text, url: pageUrl });
        return;
      } catch {
        /* fall through to copy */
      }
    }
    await navigator.clipboard.writeText(text);
    flash("card");
  };

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(pageUrl);
    flash("link");
  };

  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-accent">
              Dog of the moment
            </p>
            <h2 className="font-display text-4xl tracking-wide text-fg">The ticket</h2>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
            {live ? "Live · ClashPicks" : "Classroom example"}
            {asOf ? ` · ${asOf}` : ""}
          </p>
        </div>

        <article className="mt-6 overflow-hidden rounded-xl border border-line bg-elevated">
          <div className="grid gap-0 md:grid-cols-[1.3fr_0.7fr]">
            <div className="relative px-5 py-6 sm:px-8 sm:py-8">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">
                {row.source} ticket
              </p>
              <p className="mt-4 text-lg font-medium leading-snug text-muted">{parts.event}</p>
              <h3 className="mt-1 font-display text-5xl leading-none tracking-wide text-fg">{parts.pick}</h3>

              <p className="mt-6 max-w-lg text-xl leading-snug text-fg">
                {row.source} will pay you{" "}
                <span className="text-accent">${n} for every $1</span> if this hits.
              </p>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">
                Things priced like this hit about <span className="text-fg">1 time in {n}</span>.
                That’s why it pays. Not because it’s a secret. Because it usually loses.
              </p>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">
                Only interesting if you think it happens <span className="text-fg">more often</span> than
                1 in {n}.
              </p>

              <div className="mt-8">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-subtle">
                  1 red hit · {n - 1} misses
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5" aria-hidden="true">
                  {Array.from({ length: n }, (_, i) => (
                    <li
                      key={i}
                      className={`size-3 rounded-full ${i === 0 ? "bg-accent" : "bg-line"}`}
                    />
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 border-t border-line px-5 py-6 md:border-l md:border-t-0 sm:px-8 sm:py-8">
              <p className="text-sm leading-relaxed text-muted">
                Public price from {row.source}. $UNDERDOG is not affiliated. Nothing here is a
                recommendation to buy the pick or the token. Not a bet. A question.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={onShare}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg hover:bg-accent-dim"
                >
                  <Share2 className="size-4" />
                  {copied === "card" ? "Copied the take" : "Share this ticket"}
                </button>
                <button
                  type="button"
                  onClick={onCopyLink}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-bg/60 px-4 py-2.5 text-sm font-semibold text-fg hover:border-accent"
                >
                  {copied === "link" ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied === "link" ? "Link copied" : "Copy link"}
                </button>
                {row.href ? (
                  <a
                    href={row.href}
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

function formatAsOf(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
