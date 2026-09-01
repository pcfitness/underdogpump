import { Link } from "@tanstack/react-router";
import { PROJECT } from "@/lib/content";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img
            src="/token-avatar.jpg"
            alt="$UNDERDOG"
            className="size-10 rounded-full border border-accent bg-bg object-contain p-[3px]"
          />
          <span className="font-display text-2xl tracking-wide text-accent">
            {PROJECT.ticker}
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-muted sm:inline">
            {PROJECT.tagline}
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            className="rounded-sm px-3 py-2 text-muted no-underline hover:text-fg"
            activeProps={{ className: "text-fg" }}
          >
            Live
          </Link>
          <Link
            to="/odds-101"
            className="rounded-sm px-3 py-2 text-muted no-underline hover:text-fg"
            activeProps={{ className: "text-fg" }}
          >
            Odds 101
          </Link>
        </nav>
      </div>
    </header>
  );
}
