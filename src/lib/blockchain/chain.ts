/**
 * Monad Testnet chain configuration for Shipd.
 *
 * Shipd's V1 contracts (ShipdRegistry, WorkReceipt, Reputation) are deployed to
 * Monad Testnet. This module defines the chain metadata the frontend needs to
 * read chain data and, later, to prompt wallet network switching.
 *
 * The shape mirrors viem's `Chain` type so it can be passed straight to viem /
 * wagmi once a wallet layer is added, but it is a plain typed object — no
 * blockchain dependency is required to consume it.
 */

/** Monad Testnet EVM chain id. */
export const MONAD_TESTNET_CHAIN_ID = 10143 as const;

/**
 * Public Monad Testnet JSON-RPC endpoint.
 *
 * Defaults to the public Monad RPC. Deployments may override it with the public
 * `NEXT_PUBLIC_MONAD_TESTNET_RPC_URL` env var (e.g. a dedicated provider). This
 * is a public read endpoint, never a secret.
 */
export const MONAD_TESTNET_RPC_URL =
  process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC_URL ?? "https://testnet-rpc.monad.xyz";

/** Public Monad Testnet block explorer. */
export const MONAD_TESTNET_EXPLORER_URL = "https://testnet.monadexplorer.com";

/**
 * Monad Testnet chain descriptor.
 *
 * `as const` preserves literal types (id, urls) so downstream typed clients
 * infer the exact chain rather than widening to `number`/`string`.
 */
export const monadTestnet = {
  id: MONAD_TESTNET_CHAIN_ID,
  name: "Monad Testnet",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [MONAD_TESTNET_RPC_URL] },
    public: { http: [MONAD_TESTNET_RPC_URL] },
  },
  blockExplorers: {
    default: {
      name: "Monad Explorer",
      url: MONAD_TESTNET_EXPLORER_URL,
    },
  },
  testnet: true,
} as const;

export type MonadTestnet = typeof monadTestnet;
