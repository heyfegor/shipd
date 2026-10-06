import type { PrivyClientConfig } from "@privy-io/react-auth";

import { monadTestnet } from "@/lib/blockchain";

/**
 * Privy configuration for Shipd.
 *
 * Privy is Shipd's primary user authentication and identity provider. This
 * config is intentionally minimal: we do not enable extra login methods or
 * embedded-wallet features here yet.
 *
 * - Available login methods are governed by the Privy dashboard (Login Methods),
 *   so we do not hard-code `loginMethods` here.
 * - `embeddedWallets` creates an on-device Ethereum wallet for any user who logs
 *   in without one (e.g. passkey/email-only humans). Shipd needs a wallet so the
 *   builder can sign `registerBuild` on Monad Testnet. `showWalletUIs` keeps
 *   Privy's confirmation modal on transactions so signing stays explicit.
 *   (Embedded wallets must also be enabled for the app in the Privy dashboard.)
 * - Appearance is aligned to Shipd's dark brand; the signal-lime accent is the
 *   only brand color used and is reserved for positive/action affordances.
 * - `supportedChains`/`defaultChain` register Shipd's Monad Testnet — reusing the
 *   single source-of-truth chain descriptor from `@/lib/blockchain`. Privy's
 *   `Chain` type is viem/wagmi-compatible, so the descriptor is passed directly.
 *   This only tells Privy which network Shipd operates on; it does not create
 *   wallets or submit transactions.
 */
export const privyConfig: PrivyClientConfig = {
  appearance: {
    theme: "dark",
    accentColor: "#B8FF3D",
  },
  supportedChains: [monadTestnet],
  defaultChain: monadTestnet,
  embeddedWallets: {
    ethereum: {
      createOnLogin: "users-without-wallets",
    },
    showWalletUIs: true,
  },
};

/**
 * The public Privy app id. Safe to expose to the browser (it is the client
 * identifier, not a secret). Empty when the environment variable is unset.
 *
 * A Privy app id is a lowercase-alphanumeric CUID-style handle (~25 chars). A
 * non-empty but malformed value makes `PrivyProvider` throw "Cannot initialize
 * the Privy provider with an invalid Privy app ID", which crashes the static
 * prerender and fails the whole build (e.g. on Vercel for `/_not-found`).
 *
 * So we normalize and validate here, and treat any value we cannot trust as
 * "unconfigured" rather than letting it reach Privy:
 *   1. Strip surrounding quotes and stray whitespace/newlines — the two most
 *      common env-paste mistakes.
 *   2. Require the remaining string to match the Privy app-id shape. Anything
 *      else (a leftover placeholder like `your-privy-app-id`, a truncated
 *      fragment, embedded punctuation) collapses to "" so the provider is
 *      skipped and the app still boots, instead of crashing the build.
 */
const PRIVY_APP_ID_PATTERN = /^[a-z0-9]{20,}$/;

function readRawPrivyAppId(): string {
  let id = (process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "").trim();
  if (
    id.length >= 2 &&
    ((id.startsWith('"') && id.endsWith('"')) || (id.startsWith("'") && id.endsWith("'")))
  ) {
    id = id.slice(1, -1).trim();
  }
  return id;
}

function readPrivyAppId(): string {
  const id = readRawPrivyAppId();
  if (id.length === 0) return "";
  if (PRIVY_APP_ID_PATTERN.test(id)) return id;

  // Non-empty but not a valid app id: warn (this surfaces in the Vercel build
  // log, the one place a deploy debugger looks) and disable Privy rather than
  // crash the prerender.
  console.warn(
    "[shipd] NEXT_PUBLIC_PRIVY_APP_ID is set but does not look like a valid " +
      "Privy app id — Privy is disabled. Check the value in your environment " +
      "(it should be the lowercase app id from the Privy dashboard, with no " +
      "quotes or surrounding text).",
  );
  return "";
}

export const PRIVY_APP_ID = readPrivyAppId();

/** Whether a Privy app id is present so the provider can initialize. */
export const isPrivyConfigured = PRIVY_APP_ID.length > 0;
