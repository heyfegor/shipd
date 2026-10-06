"use client";

import { isPrivyConfigured, useShipdAuth } from "@/lib/auth";

/**
 * Gate for authenticated screens. Renders children only once Privy is ready and
 * a user is signed in; otherwise shows an initializing state or a sign-in
 * prompt. Keeps every authed page from re-implementing the same guard.
 */
export function ConnectGate({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, login } = useShipdAuth();

  if (!isPrivyConfigured) {
    return (
      <Centered>
        <p className="max-w-sm rounded border border-amber-500/40 bg-amber-500/10 px-4 py-3 font-mono text-xs text-amber-300">
          NEXT_PUBLIC_PRIVY_APP_ID is not set. Add it to .env.local and restart the dev server.
        </p>
      </Centered>
    );
  }

  if (!ready) {
    return (
      <Centered>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-muted">Initializing…</p>
      </Centered>
    );
  }

  if (!authenticated) {
    return (
      <Centered>
        <div className="flex max-w-sm flex-col items-center gap-5 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">Sign in required</p>
          <h1 className="text-2xl font-semibold tracking-tight text-text">Sign in to Shipd</h1>
          <p className="text-sm leading-relaxed text-text-muted">
            Your identity and wallet are created with a passkey — credentials stay on your device.
          </p>
          <button type="button" onClick={login} className="shpd-btn">
            Sign in
          </button>
        </div>
      </Centered>
    );
  }

  return <>{children}</>;
}

function Centered({ children }: { children: React.ReactNode }) {
  return <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">{children}</main>;
}
