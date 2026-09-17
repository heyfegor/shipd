/**
 * Shipd authentication layer — public surface.
 *
 * Feature components should import identity/session helpers from here, never
 * from `@privy-io/react-auth` directly. This keeps Privy an implementation
 * detail behind a Shipd-owned boundary.
 */
export { useShipdAuth } from "./use-shipd-auth";
export type { ShipdAuth } from "./use-shipd-auth";
export type { ShipdIdentity, ShipdSession } from "./types";
export { PRIVY_APP_ID, isPrivyConfigured } from "./config";
