"use client";

// This is a development-only Privy validation harness (see `page.tsx`, which
// 404s it in production). Unlike feature components — which must go through the
// `@/lib/auth` boundary — this probe intentionally reads Privy's `useWallets`
// directly to inspect the live wallet/chain connection. It does not submit
// transactions or request funds.
import { useWallets } from "@privy-io/react-auth";

import { isPrivyConfigured, useShipdAuth } from "@/lib/auth";
import { MONAD_TESTNET_CHAIN_ID } from "@/lib/blockchain";

/**
 * Parse an EIP-155 CAIP-2 chain id (e.g. `"eip155:10143"`) into its numeric
 * chain id. Also tolerates a bare numeric string. Returns null if unparseable.
 */
function parseEvmChainId(chainId: string | undefined): number | null {
  if (!chainId) return null;
  const raw = chainId.includes(":") ? chainId.split(":").pop() : chainId;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Client-side probe for the Shipd auth layer. Renders the raw `ready`,
 * `authenticated`, and identity values coming out of `useShipdAuth`, plus
 * login/logout controls, so a developer can eyeball that Privy is wired up.
 *
 * It also surfaces the first connected wallet's address and current chain id
 * (via Privy's `useWallets`) and flags whether that chain is Monad Testnet, so
 * a developer can confirm wallet + network connectivity end to end.
 */
export function AuthCheck() {
  const { ready, authenticated, identity, login, logout } = useShipdAuth();
  const { wallets, ready: walletsReady } = useWallets();

  // The primary connected wallet, when one is present. Email-only logins have
  // no connected wallet, so this can be undefined even while authenticated.
  const wallet = wallets[0];
  const walletAddress = wallet?.address ?? null;
  const walletChainId = parseEvmChainId(wallet?.chainId);
  const isMonadTestnet = walletChainId === MONAD_TESTNET_CHAIN_ID;

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

        <dt className="text-text-muted">wallets.ready</dt>
        <dd className="text-text">{String(walletsReady)}</dd>

        <dt className="text-text-muted">wallet.address</dt>
        <dd className="break-all text-text">{walletAddress ?? "—"}</dd>

        <dt className="text-text-muted">wallet.chainId</dt>
        <dd className="break-all text-text">
          {wallet?.chainId ?? "—"}
          {walletChainId !== null && (
            <span className="text-text-muted"> ({walletChainId})</span>
          )}
        </dd>
      </dl>

      {authenticated && walletAddress && (
        <p
          className={
            isMonadTestnet
              ? "rounded border border-signal/40 bg-signal/10 px-3 py-2 font-mono text-xs text-signal"
              : "rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 font-mono text-xs text-amber-300"
          }
        >
          {isMonadTestnet
            ? `✓ Connected to Monad Testnet (chain ${MONAD_TESTNET_CHAIN_ID})`
            : `Active chain is not Monad Testnet — expected ${MONAD_TESTNET_CHAIN_ID}, got ${
                walletChainId ?? "unknown"
              }`}
        </p>
      )}

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
