import type { ReactNode } from "react";
import { DISCLAIMER, SITE, pumpLink } from "@/lib/site";

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-bg px-4 py-3">
      <p className="text-[0.65rem] font-semibold tracking-widest text-accent uppercase">{label}</p>
      <p className="mt-1 truncate font-mono text-sm text-fg">{children}</p>
    </div>
  );
}

export function SiteFooter() {
  const ca = SITE.contract.trim();
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <a
            href={SITE.builderUrl}
            target="_blank"
            rel="noreferrer"
            className="oz-chip mb-3 mr-4 size-24 overflow-hidden rounded-full border-2 border-accent no-underline sm:size-28"
          >
            <img
              src="/oz-doxxed.jpg"
              alt="Oz, founder of OzGaming.net"
              className="size-full object-cover object-[center_18%]"
            />
          </a>
          <div className="overflow-hidden">
          <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">Doxxed</p>
          <h2 className="mt-1 font-display text-4xl leading-none tracking-wide text-fg [text-wrap:unset]">
            Built by{" "}
            <a
              href={SITE.builderUrl}
              target="_blank"
              rel="noreferrer"
              className="text-fg no-underline hover:text-accent"
            >
              <span className="text-accent">OzGaming</span>
              <span className="text-fg">.net</span>
            </a>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {SITE.mission} The photo is the builder: Oz, the same person behind{" "}
            <a
              href={SITE.builderUrl}
              target="_blank"
              rel="noreferrer"
              className="whitespace-nowrap text-[0.7rem] font-normal tracking-widest text-accent no-underline hover:text-accent"
            >
              OzGaming.net
            </a>
            .
          </p>
          </div>
          <div className="clear-both" />
        </div>
        <aside className="border-t border-l-0 border-line pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <p className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
            {SITE.mindsetTitle}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {SITE.mindset.split("$UNDERDOG").map((part, i) =>
              i === 0 ? (
                part
              ) : (
                <span key="ticker">
                  <span className="text-[0.7rem] font-semibold tracking-widest text-accent uppercase">
                    {SITE.ticker}
                  </span>
                  {part}
                </span>
              ),
            )}
          </p>
        </aside>
      </div>
      <div className="mx-auto grid max-w-5xl gap-3 px-4 pb-8 sm:grid-cols-3">
        <Meta label="Launch platform">
          <a
            href={pumpLink()}
            target="_blank"
            rel="noreferrer"
            className="text-fg no-underline hover:text-accent"
          >
            {SITE.platform}
          </a>
        </Meta>
        <Meta label="Project status">{SITE.status}</Meta>
        <Meta label="Contract">{ca || "To be announced"}</Meta>
      </div>
      <p className="mx-auto max-w-5xl px-4 pb-10 text-xs leading-relaxed text-subtle">{DISCLAIMER}</p>
    </footer>
  );
}
