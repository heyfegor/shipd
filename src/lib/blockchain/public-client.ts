/**
 * Shared viem public client for Monad Testnet.
 *
 * A read-only client (HTTP transport) used for on-chain reads and for waiting on
 * transaction receipts. Safe to use in the browser and on the server — it only
 * ever reads from the public RPC endpoint; it holds no keys and sends no
 * transactions.
 *
 * The client is memoized per process so repeated calls reuse one transport.
 */
import { createPublicClient, http, type PublicClient } from "viem";

import { monadTestnetViem } from "./viem-chain";

let cached: PublicClient | undefined;

/** Get the shared Monad Testnet public (read) client, creating it on first use. */
export function getPublicClient(): PublicClient {
  if (!cached) {
    cached = createPublicClient({
      chain: monadTestnetViem,
      transport: http(),
    });
  }
  return cached;
}
