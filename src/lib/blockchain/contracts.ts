/**
 * Address + ABI bindings for the deployed Shipd contracts.
 *
 * Pairs each deployed address (`addresses.ts`) with its generated ABI
 * (`abis/`) so call sites can pass one binding to viem's `readContract` /
 * `writeContract` instead of wiring address and abi separately. Purely
 * metadata — no client, no keys.
 */
import { shipdRegistryAbi, workReceiptAbi, reputationAbi } from "./abis";
import { CONTRACT_ADDRESSES } from "./addresses";

export const shipdRegistryContract = {
  address: CONTRACT_ADDRESSES.ShipdRegistry,
  abi: shipdRegistryAbi,
} as const;

export const workReceiptContract = {
  address: CONTRACT_ADDRESSES.WorkReceipt,
  abi: workReceiptAbi,
} as const;

export const reputationContract = {
  address: CONTRACT_ADDRESSES.Reputation,
  abi: reputationAbi,
} as const;
