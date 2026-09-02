import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/hero";
import { HowToBuy } from "@/components/how-to-buy";
import { SiteChrome } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [{ title: "$UNDERDOG · Coming soon" }],
  }),
});

function Home() {
  return (
    <SiteChrome>
      <main>
        <Hero variant="soon" />
        <HowToBuy />
      </main>
    </SiteChrome>
  );
}
