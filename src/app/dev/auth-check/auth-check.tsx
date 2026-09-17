"use client";

import { isPrivyConfigured, useShipdAuth } from "@/lib/auth";

/**
 * Client-side probe for the Shipd auth layer. Renders the raw `ready`,
 * `authenticated`, and identity values coming out of `useShipdAuth`, plus
 * login/logout controls, so a developer can eyeball that Privy is wired up.
 */
export function AuthCheck() {
  const { ready, authenticated, identity, login, logout } = useShipdAuth();

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-16">
      <header className="flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-muted">
          Dev · auth check
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-text">
          Privy validation
        </h1>
        <p className="text-sm leading-relaxed text-text-muted">
          Not the real login screen — just confirms the auth layer initializes.
        </p>
      </header>

      {!isPrivyConfigured && (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 font-mono text-xs text-amber-300">
          NEXT_PUBLIC_PRIVY_APP_ID is not set. Add it to .env.local and restart
          the dev server to initialize Privy.
        </p>
      )}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 font-mono text-sm">
        <dt className="text-text-muted">ready</dt>
        <dd className="text-text">{String(ready)}</dd>

        <dt className="text-text-muted">authenticated</dt>
        <dd className="text-text">{String(authenticated)}</dd>

        <dt className="text-text-muted">identity.id</dt>
        <dd className="break-all text-text">{identity?.id ?? "—"}</dd>

        <dt className="text-text-muted">identity.email</dt>
        <dd className="break-all text-text">{identity?.email ?? "—"}</dd>

        <dt className="text-text-muted">identity.wallet</dt>
        <dd className="break-all text-text">{identity?.wallet ?? "—"}</dd>
      </dl>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={login}
          disabled={!ready || authenticated}
          className="rounded border border-text/20 px-4 py-2 text-sm text-text disabled:opacity-40"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => void logout()}
          disabled={!ready || !authenticated}
          className="rounded border border-text/20 px-4 py-2 text-sm text-text disabled:opacity-40"
        >
          Log out
        </button>
      </div>
    </main>
  );
}
