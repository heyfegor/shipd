/**
 * Shipd-facing identity and session types.
 *
 * These deliberately do not re-export Privy's own types. Application code should
 * depend on Shipd's identity shape, not on the auth provider's SDK, so the
 * provider can evolve (or be swapped) without touching feature components.
 */

/** A resolved Shipd identity, normalized from the auth provider's user record. */
export interface ShipdIdentity {
  /** Stable Shipd user id. Currently backed by the Privy DID (`did:privy:...`). */
  id: string;
  /** Primary email address, when the user has linked one. */
  email: string | null;
  /** Primary wallet address, when the user has linked one. */
  wallet: string | null;
  /** When the underlying identity was first created. */
  createdAt: Date | null;
}

/** The current authentication/session state, provider-agnostic. */
export interface ShipdSession {
  /** True once the auth provider has initialized and auth state is known. */
  ready: boolean;
  /** Whether a user is currently authenticated. */
  authenticated: boolean;
  /** The resolved identity, or null when unauthenticated. */
  identity: ShipdIdentity | null;
}
