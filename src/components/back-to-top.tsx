import { useEffect, useState } from "react";
import { ChevronsUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed z-30 flex size-12 items-center justify-center rounded-full border-2 border-accent bg-bg/85 text-accent shadow-[0_0_24px_color-mix(in_oklab,var(--color-accent)_45%,transparent)] backdrop-blur-sm transition-all duration-300 hover:bg-accent hover:text-accent-fg hover:shadow-[0_0_32px_color-mix(in_oklab,var(--color-accent)_70%,transparent)] ${
        show ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"
      }`}
      style={{ right: 20, bottom: 20 }}
    >
      <span className="absolute inset-0 animate-ping rounded-full border border-accent/40" aria-hidden="true" />
      <ChevronsUp className="relative size-6" strokeWidth={2.5} />
    </button>
  );
}
