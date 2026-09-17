import type { PrivyClientConfig } from "@privy-io/react-auth";

/**
 * Privy configuration for Shipd.
 *
 * Privy is Shipd's primary user authentication and identity provider. This
 * config is intentionally minimal: we do not enable extra login methods or
 * embedded-wallet features here yet.
 *
 * - Available login methods are governed by the Privy dashboard (Login Methods),
 *   so we do not hard-code `loginMethods` here.
 * - `embeddedWallets` is intentionally omitted. Privy does not auto-create
 *   embedded wallets unless configured, so leaving it out keeps wallet features
 *   disabled until Shipd explicitly needs them.
 * - Appearance is aligned to Shipd's dark brand; the signal-lime accent is the
 *   only brand color used and is reserved for positive/action affordances.
 */
export const privyConfig: PrivyClientConfig = {
  appearance: {
    theme: "dark",
    accentColor: "#B8FF3D",
  },
};

/**
 * The public Privy app id. Safe to expose to the browser (it is the client
 * identifier, not a secret). Empty when the environment variable is unset.
 */
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";

/** Whether a Privy app id is present so the provider can initialize. */
export const isPrivyConfigured = PRIVY_APP_ID.length > 0;
