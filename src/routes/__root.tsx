import {
  Outlet,
  createRootRoute,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/marketplace/auth";

const Header = lazy(() =>
  import("@/components/site/Header").then((module) => ({ default: module.Header })),
);
const Footer = lazy(() =>
  import("@/components/site/Footer").then((module) => ({ default: module.Footer })),
);
const Toaster = lazy(() =>
  import("@/components/ui/sonner").then((module) => ({ default: module.Toaster })),
);

const safeImageFallbackScript = `document.addEventListener("error",function(event){var image=event.target;if(!(image instanceof HTMLImageElement))return;var fallback=image.dataset.fallbackSrc;if(!fallback||image.dataset.fallbackApplied==="true")return;image.dataset.fallbackApplied="true";var picture=image.parentElement;if(picture&&picture.tagName==="PICTURE")picture.querySelectorAll("source").forEach(function(source){source.remove()});image.removeAttribute("srcset");image.src=fallback},true);`;

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
      { rel: "stylesheet", href: appCss },
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
        <Suspense fallback={<HeaderFallback />}>
          <Header />
        </Suspense>
        <main className={`flex-1 ${isHome ? "" : "pt-[var(--header-height)]"}`}>
          <Outlet />
        </main>
        {!privateWorkspace && (
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        )}
      </div>
      <IdleToaster />
    </AuthProvider>
  );
}

function HeaderFallback() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[var(--header-height)] items-center border-b border-white/10 bg-[var(--ink)] px-5 text-[var(--ivory)]">
      <a href="/" className="font-display text-2xl" aria-label="ArtDera home">
        ArtDera
      </a>
    </header>
  );
}

function IdleToaster() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const schedule =
      window.requestIdleCallback ??
      ((callback: IdleRequestCallback) => window.setTimeout(callback, 1500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = schedule(() => setReady(true), { timeout: 2500 });
    return () => cancel(handle);
  }, []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <Toaster position="top-right" richColors />
    </Suspense>
  );
}
