/**
 * Authorized protocol writes — SERVER ONLY.
 *
 * These three actions are the `onlyAuthorized` steps of the Shipd flow and must
 * be sent by the protocol account (see `signer.ts`), never the user's wallet:
 *
 *   recordVerification  (ShipdRegistry)  VERIFICATION
 *   createReceipt       (WorkReceipt)    WORK RECEIPT
 *   recordReputation    (Reputation)     REPUTATION
 *
 * Each submits the transaction, waits for it to be mined, and returns the hash
 * (plus any id parsed from the emitted event). Keep this module out of client
 * bundles — import it only from route handlers / server actions.
 */
import {
  keccak256,
  parseEventLogs,
  stringToHex,
  toHex,
  type Hash,
  type Hex,
} from "viem";

import {
  reputationContract,
  shipdRegistryContract,
  workReceiptContract,
} from "../contracts";
import { getPublicClient } from "../public-client";
import { getProtocolWalletClient } from "./signer";

/** Encode a short label (e.g. a reputation reason) as a bytes32 value. */
export function toBytes32(label: string): Hex {
  return stringToHex(label, { size: 32 });
}

/** keccak256 hash of arbitrary off-chain evidence, as a bytes32 value. */
export function hashEvidence(evidence: string): Hex {
  return keccak256(toHex(evidence));
}

/**
 * Record a verification reference for a build (ShipdRegistry.recordVerification).
 * @returns the mined transaction hash.
 */
export async function recordVerification(
  buildId: bigint,
  verificationRef: string,
): Promise<{ hash: Hash }> {
  const walletClient = getProtocolWalletClient();
  const publicClient = getPublicClient();

  const hash = await walletClient.writeContract({
    ...shipdRegistryContract,
    chain: walletClient.chain,
    account: walletClient.account!,
    functionName: "recordVerification",
    args: [buildId, verificationRef],
  });
  await publicClient.waitForTransactionReceipt({ hash });
  return { hash };
}

export interface CreateReceiptParams {
  buildId: bigint;
  /** Worker / agent credited by the receipt. */
  worker: `0x${string}`;
  verificationRef: string;
  /** bytes32 hash of the off-chain evidence (see {@link hashEvidence}). */
  evidenceHash: Hex;
}

/**
 * Create a work receipt for a verified build (WorkReceipt.createReceipt).
 * @returns the mined transaction hash and the assigned receipt id.
 */
export async function createReceipt({
  buildId,
  worker,
  verificationRef,
  evidenceHash,
}: CreateReceiptParams): Promise<{ hash: Hash; receiptId: bigint }> {
  const walletClient = getProtocolWalletClient();
  const publicClient = getPublicClient();

  const hash = await walletClient.writeContract({
    ...workReceiptContract,
    chain: walletClient.chain,
    account: walletClient.account!,
    functionName: "createReceipt",
    args: [buildId, worker, verificationRef, evidenceHash],
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  const logs = parseEventLogs({
    abi: workReceiptContract.abi,
    eventName: "ReceiptCreated",
    logs: receipt.logs,
  });
  const event = logs[0];
  if (!event) {
    throw new Error("createReceipt succeeded but no ReceiptCreated event was found.");
  }
  return { hash, receiptId: event.args.receiptId };
}

export interface RecordReputationParams {
  /** Subject the reputation event is about (human or agent address). */
  subject: `0x${string}`;
  /** Work receipt this event derives from. */
  receiptId: bigint;
  /** Signed reputation delta (may be negative). */
  value: bigint;
  /** Reason tag, e.g. `build_verified` (encoded to bytes32). */
  reason: string;
}

/**
 * Record a reputation event derived from a receipt (Reputation.recordReputation).
 * @returns the mined transaction hash and the assigned event id.
 */
export async function recordReputation({
  subject,
  receiptId,
  value,
  reason,
}: RecordReputationParams): Promise<{ hash: Hash; eventId: bigint }> {
  const walletClient = getProtocolWalletClient();
  const publicClient = getPublicClient();

  const hash = await walletClient.writeContract({
    ...reputationContract,
    chain: walletClient.chain,
    account: walletClient.account!,
    functionName: "recordReputation",
    args: [subject, receiptId, value, toBytes32(reason)],
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  const logs = parseEventLogs({
    abi: reputationContract.abi,
    eventName: "ReputationRecorded",
    logs: receipt.logs,
  });
  const event = logs[0];
  if (!event) {
    throw new Error("recordReputation succeeded but no ReputationRecorded event was found.");
  }
  return { hash, eventId: event.args.eventId };
}
