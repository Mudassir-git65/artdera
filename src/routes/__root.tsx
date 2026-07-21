import {
  Outlet,
  createRootRoute,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AuthProvider } from "@/marketplace/auth";
import { Toaster } from "@/components/ui/sonner";

const safeImageFallbackScript = `document.addEventListener("error",function(event){var image=event.target;if(!(image instanceof HTMLImageElement))return;var fallback=image.dataset.fallbackSrc;if(!fallback||image.dataset.fallbackApplied==="true")return;image.dataset.fallbackApplied="true";var picture=image.parentElement;if(picture&&picture.tagName==="PICTURE")picture.querySelectorAll("source").forEach(function(source){source.remove()});image.removeAttribute("srcset");image.src=fallback},true);`;
const deferredStylesScript = `var styles=document.getElementById("artdera-styles");if(styles){styles.addEventListener("load",function(){styles.media="all"});if(styles.sheet)styles.media="all"}`;
const criticalCss = `:root{--ink:#171717;--ivory:#f6f1e8;--porcelain:#fffdfc;--oxblood:#6e2334;--header-height:6.5rem}*{box-sizing:border-box}html{-webkit-font-smoothing:antialiased}body{margin:0;background:var(--ivory);color:var(--ink);font-family:ui-sans-serif,system-ui,sans-serif}a{color:inherit;text-decoration:none}header{position:fixed;inset:0 0 auto;z-index:50;height:var(--header-height);color:var(--ivory)}header>div{width:100%;max-width:86rem;margin:auto;padding:1.25rem}.home-page>section:first-of-type{position:relative;min-height:100svh;overflow:hidden;background:var(--ink);color:#fff}.home-page>section:first-of-type>span{position:absolute;inset:0;display:block;width:100%;height:100%;overflow:hidden}.home-page>section:first-of-type picture{display:contents}.home-page>section:first-of-type img{width:100%;height:100%;object-fit:cover;object-position:center}.home-page>section:first-of-type>div:nth-of-type(1){position:absolute;inset:0;background:linear-gradient(90deg,rgba(23,23,23,.82),rgba(23,23,23,.2)),linear-gradient(0deg,rgba(23,23,23,.78),transparent 55%)}.home-page>section:first-of-type>div:nth-of-type(2){position:relative;z-index:1;display:flex;min-height:100svh;align-items:flex-end}.home-page>section:first-of-type>div:nth-of-type(2)>div{width:100%;max-width:86rem;margin:auto;padding:9rem 1.25rem 6rem}.home-page h1{max-width:48rem;margin:1.25rem 0 0;font-family:Georgia,ui-serif,serif;font-size:clamp(3.3rem,8vw,7.7rem);font-weight:400;line-height:.92}.hero-reveal{display:block;opacity:1;transform:none}.home-page>section:first-of-type p{max-width:36rem;margin:1.75rem 0 0;line-height:1.65;color:rgba(255,255,255,.78)}.home-page>section:first-of-type a{display:inline-flex;min-height:2.75rem;align-items:center;margin-top:1.5rem;border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:.7rem 1.25rem;font-size:.875rem;font-weight:700}.home-page>section:first-of-type a:first-child{border-color:var(--oxblood);background:var(--oxblood);color:#fff}@media(min-width:768px){header>div,.home-page>section:first-of-type>div:nth-of-type(2)>div{padding-left:2rem;padding-right:2rem}}`;

function NotFoundComponent() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow">404</div>
        <h1 className="mt-3 font-display text-4xl">This page is off the wall.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The work you're looking for may have moved or is no longer listed.
        </p>
        <a href="/" className="btn-primary mt-6">
          Return home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow">Something interrupted the gallery</div>
        <h1 className="mt-3 font-display text-3xl">This page didn't load.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Try again in a moment, or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary"
          >
            Try again
          </button>
          <a href="/" className="btn-ghost">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ArtDera - Discover Art. Shape Your Space." },
      {
        name: "description",
        content:
          "A premium marketplace for original works, prints, calligraphy, photography and curated decor from independent creators and galleries.",
      },
      { name: "author", content: "ArtDera" },
      { name: "theme-color", content: "#171717" },
      { property: "og:site_name", content: "ArtDera" },
      { property: "og:title", content: "ArtDera - Discover Art. Shape Your Space." },
      {
        property: "og:description",
        content:
          "A premium marketplace for original works, prints, calligraphy, photography and curated decor from independent creators and galleries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ArtDera - Discover Art. Shape Your Space." },
      {
        name: "twitter:description",
        content:
          "A premium marketplace for original works, prints, calligraphy, photography and curated decor from independent creators and galleries.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/728bf8e1-0c30-454a-a6bd-0ea9ccfc3b0b/id-preview-4a587064--5d6fbfd4-0a83-449d-8bfd-633e37dff06b.lovable.app-1783799770673.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/728bf8e1-0c30-454a-a6bd-0ea9ccfc3b0b/id-preview-4a587064--5d6fbfd4-0a83-449d-8bfd-633e37dff06b.lovable.app-1783799770673.png",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
        <link rel="preload" href={appCss} as="style" />
        <link id="artdera-styles" rel="stylesheet" href={appCss} media="print" />
        <script dangerouslySetInnerHTML={{ __html: deferredStylesScript }} />
        <noscript>
          <link rel="stylesheet" href={appCss} />
        </noscript>
        <script dangerouslySetInnerHTML={{ __html: safeImageFallbackScript }} />
      </head>
      <body>
        {children}
        <SpeedInsights />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isHome = pathname === "/";
  const privateWorkspace =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/artist/dashboard") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/admin") ||
    [
      "/artist/verify",
      "/artist/checkout",
      "/artist/payment-success",
      "/artist/payment-failed",
      "/artist/onboarding",
      "/artist/store-created",
    ].includes(pathname);
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className={`flex-1 ${isHome ? "" : "pt-[var(--header-height)]"}`}>
          <Outlet />
        </main>
        {!privateWorkspace && <Footer />}
      </div>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
