import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Atmosphere } from "@/components/atmosphere";
import { BackToTop } from "@/components/back-to-top";
import appCss from "../styles.css?url";

const APP_NAME = "$UNDERDOG";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${APP_NAME} · Bet on the Dog` },
      { name: "theme-color", content: "#070708" },
      {
        name: "description",
        content:
          "OzGaming education desk for prediction markets, long shots, and underdogs. Pre-launch on Pump.fun.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Bebas+Neue&family=IBM+Plex+Mono:wght@500&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <div id="app-root">
            <Atmosphere />
            <Outlet />
            <BackToTop />
          </div>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
