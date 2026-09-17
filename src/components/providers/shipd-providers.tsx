"use client";

import { PrivyProvider } from "@privy-io/react-auth";

import { PRIVY_APP_ID, privyConfig } from "@/lib/auth/config";

/**
 * Client-side provider tree for Shipd.
 *
 * Wraps the app in Privy — Shipd's primary authentication and identity
 * provider. This is a Client Component so the root layout can stay a Server
 * Component and simply render `<ShipdProviders>` around its children.
 *
 * If `NEXT_PUBLIC_PRIVY_APP_ID` is not set, we skip mounting the provider (which
 * would otherwise throw) and render children unwrapped so the app still boots.
 * In that state `useShipdAuth().ready` never becomes true, which the dev
 * auth-check page surfaces explicitly.
 */
export function ShipdProviders({ children }: { children: React.ReactNode }) {
  if (!PRIVY_APP_ID) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[shipd] NEXT_PUBLIC_PRIVY_APP_ID is not set — Privy is disabled. " +
          "Set it in .env.local to enable authentication.",
      );
    }
    return <>{children}</>;
  }

  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={privyConfig}>
      {children}
    </PrivyProvider>
  );
}
