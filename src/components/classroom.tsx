import { CLASSROOM } from "@/lib/site";

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <li className="min-w-0 rounded-md border border-line bg-bg/55 px-2 py-3">
      <p className="font-display text-xl leading-none tracking-wide text-accent sm:text-2xl">{n}</p>
      <p className="mt-1 text-[0.6rem] font-semibold tracking-wide text-muted uppercase">{label}</p>
    </li>
  );
}

export function Classroom() {
  return (
    <section className="border-y border-line">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">Classroom</p>
        <h2 className="font-display text-5xl tracking-wide text-fg sm:text-6xl">
          Favorites pay less
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          A favorite is the fighter or team expected to win. Because the favorite has the better chance on paper, the payout is smaller. You usually have to risk more money to win the same amount you could win by betting less on an underdog.
        </p>
        <ul className="mt-6 grid w-full max-w-lg grid-cols-3 gap-2">
        <Stat n="$10" label="Your bet" />
        <Stat n="+$$" label="If the favorite wins" />
        <Stat n="+$$$$" label="If the underdog wins" />
        </ul>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {CLASSROOM.map((card) => (
            <article
              key={card.n}
              className="rounded-lg border border-line bg-surface/80 px-4 py-4 shadow-[inset_3px_0_0_var(--color-accent)]"
            >
              <p className="font-mono text-xs text-accent">{card.n}</p>
              <p className="mt-1 font-display text-2xl tracking-wide text-fg">{card.label}</p>
              <p className="text-base font-medium text-fg">{card.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
