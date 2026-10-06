/**
 * viem `Chain` descriptor for Monad Testnet.
 *
 * `chain.ts` holds the dependency-free chain metadata (and is what Privy
 * consumes). This module derives a proper viem `Chain` from those same
 * constants so viem clients (public reads + wallet writes) share one source of
 * truth for the chain id, RPC endpoint, and explorer. Keeping the viem-typed
 * chain separate means `chain.ts` stays free of any blockchain dependency.
 */
import { defineChain } from "viem";

import {
  MONAD_TESTNET_CHAIN_ID,
  MONAD_TESTNET_EXPLORER_URL,
  MONAD_TESTNET_RPC_URL,
} from "./chain";

/** Monad Testnet as a viem `Chain`, built from the shared chain constants. */
export const monadTestnetViem = defineChain({
  id: MONAD_TESTNET_CHAIN_ID,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: [MONAD_TESTNET_RPC_URL] },
  },
  blockExplorers: {
    default: { name: "Monad Explorer", url: MONAD_TESTNET_EXPLORER_URL },
  },
  testnet: true,
});
