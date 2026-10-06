/**
 * Shipd blockchain layer — public surface.
 *
 * A small, dependency-free module holding everything the frontend needs to talk
 * to Shipd's on-chain contracts on Monad Testnet: the chain config, the deployed
 * contract addresses, and the contract ABIs (generated from the compiled
 * artifacts). Feature code should import from here.
 *
 * Scope: chain config, deployed addresses, ABIs, the shared viem clients, and
 * read helpers. Transaction submission lives in `@/services` (user wallet) and
 * `./server` (authorized protocol key — server only, never re-exported here).
 */
export {
  monadTestnet,
  MONAD_TESTNET_CHAIN_ID,
  MONAD_TESTNET_RPC_URL,
  MONAD_TESTNET_EXPLORER_URL,
} from "./chain";
export type { MonadTestnet } from "./chain";

export { monadTestnetViem } from "./viem-chain";
export { getPublicClient } from "./public-client";

export { CONTRACT_ADDRESSES, CONTRACTS_CHAIN_ID } from "./addresses";
export type { ShipdContractName } from "./addresses";

export { shipdRegistryAbi, workReceiptAbi, reputationAbi } from "./abis";
export {
  shipdRegistryContract,
  workReceiptContract,
  reputationContract,
} from "./contracts";

export {
  getBuild,
  getBuilds,
  getBuildsByBuilder,
  getBuildCount,
  getReceipt,
  getReceipts,
  getReceiptByBuild,
  getReceiptCount,
  getReputationEvent,
  getReputationEvents,
  getReputationEventCount,
  getReputationScore,
} from "./reads";
export type {
  OnchainBuild,
  OnchainReceipt,
  OnchainReputationEvent,
} from "./reads";
