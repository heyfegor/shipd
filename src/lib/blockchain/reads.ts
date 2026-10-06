/**
 * On-chain reads for Shipd data.
 *
 * Read-only helpers over the deployed contracts, usable from the browser or the
 * server (they go through the shared public client). They return plain,
 * UI-friendly shapes so components never deal with raw tuple/BigInt decoding.
 */
import type { Hex } from "viem";

import {
  reputationContract,
  shipdRegistryContract,
  workReceiptContract,
} from "./contracts";
import { getPublicClient } from "./public-client";

export interface OnchainBuild {
  buildId: bigint;
  builder: `0x${string}`;
  metadataURI: string;
  submissionRef: string;
  /** Empty string until a verification has been recorded. */
  verificationRef: string;
  registeredAt: bigint;
}

export interface OnchainReceipt {
  receiptId: bigint;
  buildId: bigint;
  worker: `0x${string}`;
  verificationRef: string;
  evidenceHash: Hex;
  issuedAt: bigint;
}

export interface OnchainReputationEvent {
  eventId: bigint;
  subject: `0x${string}`;
  receiptId: bigint;
  value: bigint;
  eventType: Hex;
  recordedAt: bigint;
}

/** Total number of registered builds. */
export async function getBuildCount(): Promise<bigint> {
  return getPublicClient().readContract({
    ...shipdRegistryContract,
    functionName: "buildCount",
  });
}

/** Read a single build by id. Returns null if the build does not exist. */
export async function getBuild(buildId: bigint): Promise<OnchainBuild | null> {
  const [id, builder, metadataURI, submissionRef, verificationRef, registeredAt] =
    await getPublicClient().readContract({
      ...shipdRegistryContract,
      functionName: "builds",
      args: [buildId],
    });

  // Unset mapping slots return the zero address for `builder`.
  if (builder === "0x0000000000000000000000000000000000000000") return null;

  return { buildId: id, builder, metadataURI, submissionRef, verificationRef, registeredAt };
}

/** Read all registered builds, newest first. */
export async function getBuilds(): Promise<OnchainBuild[]> {
  const count = await getBuildCount();
  const ids = Array.from({ length: Number(count) }, (_, i) => BigInt(i));
  const builds = await Promise.all(ids.map((id) => getBuild(id)));
  return builds.filter((b): b is OnchainBuild => b !== null).reverse();
}

/** Builds registered by a given builder address, newest first. */
export async function getBuildsByBuilder(builder: `0x${string}`): Promise<OnchainBuild[]> {
  const all = await getBuilds();
  const target = builder.toLowerCase();
  return all.filter((b) => b.builder.toLowerCase() === target);
}

/** Read a single work receipt by id. Returns null if it does not exist. */
export async function getReceipt(receiptId: bigint): Promise<OnchainReceipt | null> {
  const [id, buildId, worker, verificationRef, evidenceHash, issuedAt] =
    await getPublicClient().readContract({
      ...workReceiptContract,
      functionName: "receipts",
      args: [receiptId],
    });

  if (worker === "0x0000000000000000000000000000000000000000") return null;

  return { receiptId: id, buildId, worker, verificationRef, evidenceHash, issuedAt };
}

/** Total number of issued work receipts. */
export async function getReceiptCount(): Promise<bigint> {
  return getPublicClient().readContract({
    ...workReceiptContract,
    functionName: "receiptCount",
  });
}

/** All issued work receipts, newest first. */
export async function getReceipts(): Promise<OnchainReceipt[]> {
  const count = await getReceiptCount();
  const ids = Array.from({ length: Number(count) }, (_, i) => BigInt(i));
  const receipts = await Promise.all(ids.map((id) => getReceipt(id)));
  return receipts.filter((r): r is OnchainReceipt => r !== null).reverse();
}

/** The work receipt issued for a build, if any (first match). */
export async function getReceiptByBuild(buildId: bigint): Promise<OnchainReceipt | null> {
  const receipts = await getReceipts();
  return receipts.find((r) => r.buildId === buildId) ?? null;
}

/** Read a single reputation event by id. Returns null if it does not exist. */
export async function getReputationEvent(
  eventId: bigint,
): Promise<OnchainReputationEvent | null> {
  const [id, subject, receiptId, value, eventType, recordedAt] =
    await getPublicClient().readContract({
      ...reputationContract,
      functionName: "events",
      args: [eventId],
    });

  if (subject === "0x0000000000000000000000000000000000000000") return null;

  return { eventId: id, subject, receiptId, value, eventType, recordedAt };
}

/** Total number of recorded reputation events. */
export async function getReputationEventCount(): Promise<bigint> {
  return getPublicClient().readContract({
    ...reputationContract,
    functionName: "eventCount",
  });
}

/** All reputation events for a subject, oldest first (ledger order). */
export async function getReputationEvents(
  subject: `0x${string}`,
): Promise<OnchainReputationEvent[]> {
  const count = await getReputationEventCount();
  const ids = Array.from({ length: Number(count) }, (_, i) => BigInt(i));
  const events = await Promise.all(ids.map((id) => getReputationEvent(id)));
  const target = subject.toLowerCase();
  return events
    .filter((e): e is OnchainReputationEvent => e !== null)
    .filter((e) => e.subject.toLowerCase() === target);
}

/** Current reputation score for a subject: the sum of all event deltas. */
export async function getReputationScore(subject: `0x${string}`): Promise<bigint> {
  const events = await getReputationEvents(subject);
  return events.reduce((sum, e) => sum + e.value, BigInt(0));
}
