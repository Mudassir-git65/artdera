import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "./types";

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function loadSession() {
  const response = await fetch("/api/auth/session", { credentials: "include" });
  if (!response.ok) return null;
  const body = (await response.json()) as { success?: boolean; data?: { user?: User | null } };
  return body.success ? (body.data?.user ?? null) : null;
}

async function initializeAuthenticatedUser(user: User | null) {
  if (!user) return null;
  const { MarketplaceService } = await import("./services");
  return MarketplaceService.initialize();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = async () => {
    setReady(false);
    const sessionUser = await loadSession();
    setUser(sessionUser);
    setUser(await initializeAuthenticatedUser(sessionUser));
    setReady(true);
  };

  useEffect(() => {
    let active = true;
    loadSession()
      .then(async (sessionUser) => {
        if (!active) return;
        setUser(sessionUser);
        const initializedUser = await initializeAuthenticatedUser(sessionUser);
        if (!active) return;
        setUser(initializedUser);
        setReady(true);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (import.meta.env.DEV) console.warn("ArtDera session initialization failed", error);
        setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      refresh,
      logout: async () => {
        setUser(null);
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      },
    }),
    [ready, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// The provider and hook intentionally share one module so the authentication
// adapter can be replaced without changing consumers.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
