/**
 * Reputation policy — the single place weighting lives (IMPLEMENTATION.md §5).
 *
 * Reputation is an audit trail: every change is caused by a verifiable event.
 * Deltas and the derived status label are policy, kept here so they can be tuned
 * without touching UI or contracts. The current score is the sum of all on-chain
 * reputation deltas for a subject (see `lib/blockchain/reads.ts`).
 */
import { hexToString } from "viem";

/** Reason tags recorded on-chain as the reputation event type. */
export type ReputationReason =
  | "build_verified"
  | "challenge_completed"
  | "peer_review"
  | "verification_failed"
  | "identity_created";

/**
 * Reputation delta awarded when a build is verified, scaled by its score.
 * A 94/100 build yields +12; a 70/100 build yields +9.
 */
export function buildVerifiedDelta(score: number): number {
  return Math.max(1, Math.round(score / 8));
}

/** Status thresholds, highest first. The label is derived, not stored. */
const STATUS_THRESHOLDS: ReadonlyArray<{ min: number; label: string }> = [
  { min: 150, label: "Trusted Builder" },
  { min: 50, label: "Verified Builder" },
  { min: 1, label: "Builder" },
  { min: -Infinity, label: "New" },
];

/** Derive the plain status label for a reputation score. No levels or badges. */
export function statusLabel(score: number): string {
  return STATUS_THRESHOLDS.find((t) => score >= t.min)!.label;
}

/** Decode a bytes32 reputation reason (as stored on-chain) back to its tag. */
export function reasonFromBytes32(hex: `0x${string}`): string {
  try {
    return hexToString(hex).replace(/\u0000+$/, "");
  } catch {
    return "";
  }
}

/** Human-readable ledger title for a reputation reason tag. */
export function humanizeReason(reason: string): string {
  const map: Record<string, string> = {
    build_verified: "Build verified",
    challenge_completed: "Challenge completed",
    peer_review: "Peer review",
    verification_failed: "Verification failed",
    identity_created: "Identity created",
  };
  return map[reason] ?? reason.replace(/_/g, " ");
}
