import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { ToTop } from "./to-top";
import { VisitorClock } from "./visitor-clock";
import type { LivePick } from "@/lib/markets";

export function PageShell({
  children,
  picks,
}: {
  children: ReactNode;
  picks: LivePick[];
}) {
  const hash = useRouterState({ select: (s) => s.location.hash });
  useEffect(() => {
    if (hash !== "how-to-buy") return;
    const t = window.setTimeout(
      () => document.getElementById("how-to-buy")?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 isolate overflow-hidden"
        aria-hidden="true"
      >
        <div className="fog-wash absolute inset-0 max-md:opacity-40" />
        <div className="fog-shift absolute inset-y-[-8%] -right-[8%] hidden w-[min(34vw,26rem)] md:block">
          <img src="/red-fog.jpg" alt="" className="size-full object-cover object-right opacity-30" />
        </div>
      </div>
      <div className="relative z-10">
        <div className="min-h-screen bg-black text-fg">
          <SiteHeader picks={picks} />
          {children}
          <SiteFooter />
          <VisitorClock />
          <ToTop />
        </div>
      </div>
    </>
  );
}
