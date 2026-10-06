/**
 * Contract ABIs for the currently deployed Shipd contracts.
 *
 * Each ABI is generated from the compiled Foundry artifact under
 * `contracts/out/` (the source of truth) — never hand-authored — so the
 * frontend and the on-chain contracts cannot drift. Regenerate with
 * `forge build --root contracts` after changing any Solidity source.
 */
export { shipdRegistryAbi } from "./shipd-registry";
export { workReceiptAbi } from "./work-receipt";
export { reputationAbi } from "./reputation";
