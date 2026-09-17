import type { User } from "@privy-io/react-auth";

import type { ShipdIdentity } from "./types";

/**
 * Adapter boundary: map a Privy `User` into Shipd's provider-agnostic identity.
 *
 * This is the only place in the codebase that reads Privy's user shape. Keeping
 * the mapping here means the rest of Shipd depends on {@link ShipdIdentity}
 * rather than on the SDK.
 */
export function toShipdIdentity(user: User): ShipdIdentity {
  return {
    id: user.id,
    email: user.email?.address ?? null,
    wallet: user.wallet?.address ?? null,
    createdAt: user.createdAt ?? null,
  };
}
