"use client";

import { usePrivy } from "@privy-io/react-auth";

import { toShipdIdentity } from "./identity";
import type { ShipdSession } from "./types";

/** Shipd's authentication surface for client components. */
export interface ShipdAuth extends ShipdSession {
  /** Open the Privy login flow. */
  login: () => void;
  /** Log the current user out. */
  logout: () => Promise<void>;
}

/**
 * Shipd-friendly auth hook. Wraps Privy's `usePrivy` and exposes a stable,
 * provider-agnostic surface so feature components never import Privy directly.
 *
 * Must be used within the Shipd provider tree (see `ShipdProviders`).
 */
export function useShipdAuth(): ShipdAuth {
  const { ready, authenticated, user, login, logout } = usePrivy();

  return {
    ready,
    authenticated,
    identity: user ? toShipdIdentity(user) : null,
    login,
    logout,
  };
}
