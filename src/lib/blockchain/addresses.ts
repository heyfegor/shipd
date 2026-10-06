/**
 * Deployed Shipd contract addresses on Monad Testnet.
 *
 * These mirror `contracts/deployments/monad-testnet.json`. Contract addresses
 * are public information — safe to ship to the browser. No private keys or
 * deployment secrets belong here or anywhere in frontend code.
 */
import { MONAD_TESTNET_CHAIN_ID } from "./chain";

/** Name of a deployed Shipd V1 contract. */
export type ShipdContractName = "ShipdRegistry" | "WorkReceipt" | "Reputation";

/**
 * Deployed contract addresses, keyed by contract name.
 *
 * Source of truth: `contracts/deployments/monad-testnet.json`.
 */
export const CONTRACT_ADDRESSES = {
  ShipdRegistry: "0x5d7917c2066bE3015a5d44CE3654059b10407870",
  WorkReceipt: "0xb9F228729E14071f22a6a9D72a1B750450F48B4B",
  Reputation: "0x8d3F20f2232acA4daAac80184d84A700A44B322F",
} as const satisfies Record<ShipdContractName, `0x${string}`>;

/** The chain the addresses above are deployed to. */
export const CONTRACTS_CHAIN_ID = MONAD_TESTNET_CHAIN_ID;
