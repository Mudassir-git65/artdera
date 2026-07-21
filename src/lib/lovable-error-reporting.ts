type LovableErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type LovableEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: LovableErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __lovableEvents?: LovableEvents;
  }
}

export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}

const reportedImageErrors = new Set<string>();

export function reportImageError(source: string, section: string) {
  if (typeof window === "undefined") return;
  let safeSource = source;
  try {
    const url = new URL(source, window.location.origin);
    safeSource = `${url.origin === window.location.origin ? "" : url.origin}${url.pathname}`;
  } catch {
    safeSource = source.split(/[?#]/, 1)[0];
  }
  const key = `${section}:${safeSource}`;
  if (reportedImageErrors.has(key)) return;
  reportedImageErrors.add(key);
  if (import.meta.env.DEV) {
    console.warn(`[ArtDera image] ${section}: ${safeSource}`);
    return;
  }
  window.__lovableEvents?.captureException?.(
    new Error("A public image failed to load"),
    { source: "safe_image", route: window.location.pathname, section, image: safeSource },
    { mechanism: "manual", handled: true, severity: "warning" },
  );
}
