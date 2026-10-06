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
 */
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";

/** Whether a Privy app id is present so the provider can initialize. */
export const isPrivyConfigured = PRIVY_APP_ID.length > 0;
