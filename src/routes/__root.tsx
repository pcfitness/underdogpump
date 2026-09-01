import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "$UNDERDOG · Bet on the Dog";
const DESCRIPTION =
  "OzGaming long-term project for prediction markets, long shots, and underdogs. Pre-launch on Pump.fun.";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "description", content: DESCRIPTION },
      { name: "theme-color", content: "#070708" },
      { name: "apple-mobile-web-app-title", content: "$UNDERDOG" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Bebas+Neue&family=IBM+Plex+Mono:wght@500&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preload", as: "image", href: "/red-fog.jpg" },
      { rel: "preload", as: "image", href: "/token-avatar.jpg" },
      { rel: "preload", as: "image", href: "/hero-mobile.jpg" },
      { rel: "preload", as: "image", href: "/hero-dog-v4.jpg" },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <div id="app-root">
            <div
              className="pointer-events-none fixed inset-0 z-0 isolate overflow-hidden"
              aria-hidden="true"
            >
              <div className="fog-wash absolute inset-0 max-md:opacity-40" />
              <div className="fog-shift absolute inset-y-[-8%] -right-[8%] hidden w-[min(34vw,26rem)] md:block">
                <img
                  src="/red-fog.jpg"
                  alt=""
                  className="size-full object-cover object-right opacity-30"
                />
              </div>
            </div>
            <div className="relative z-10">
              <Outlet />
            </div>
          </div>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
