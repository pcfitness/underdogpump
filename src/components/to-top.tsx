import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="to-top fixed right-4 bottom-5 z-50 inline-flex size-12 items-center justify-center rounded-full border border-accent bg-accent text-accent-fg hover:bg-accent-dim sm:right-6 sm:bottom-6"
    >
      <span className="to-top-ring" aria-hidden="true" />
      <span className="to-top-ring to-top-ring-2" aria-hidden="true" />
      <ArrowUp className="relative size-5" />
    </button>
  );
}
