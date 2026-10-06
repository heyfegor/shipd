/**
 * Build & verification metadata encoding.
 *
 * Shipd's V1 contracts store off-chain references as opaque strings
 * (`metadataURI`, `submissionRef`, `verificationRef`). To keep the product fully
 * reconstructable from chain reads alone — no separate database — we encode the
 * structured metadata as JSON `data:` URIs into those string fields. Small
 * payloads, cheap on Monad Testnet, and self-contained: anyone reading a build
 * or receipt on-chain can rebuild the full record.
 *
 * Pure functions — safe on client and server.
 */

/** A single contributor on a build. */
export interface Contributor {
  name: string;
  handle: string;
  kind: "human" | "agent";
}

/** Structured build metadata encoded into ShipdRegistry's `metadataURI`. */
export interface BuildMetadata {
  name: string;
  description: string;
  /** Connected repository reference, e.g. `ada/monad-payment-router`. */
  repo: string;
  contributors: Contributor[];
  /** Contribution split percentages (sum to 100). */
  split: { human: number; agent: number };
}

/** Result of a single verification check. */
export interface CheckResult {
  key: "tests" | "security" | "quality" | "contribution" | "review";
  label: string;
  passed: boolean;
  /** Human-readable evidence string surfaced on the receipt. */
  evidence: string;
}

/** Full verification outcome encoded into ShipdRegistry's `verificationRef`. */
export interface VerificationResult {
  passed: boolean;
  /** Composite 0–100 score. */
  score: number;
  /** Code-quality sub-score (0–100). */
  qualityScore: number;
  checks: CheckResult[];
  /** ISO timestamp when verification completed. */
  verifiedAt: string;
}

const JSON_DATA_PREFIX = "data:application/json,";

function encodeJsonDataUri(value: unknown): string {
  return JSON_DATA_PREFIX + encodeURIComponent(JSON.stringify(value));
}

function decodeJsonDataUri<T>(raw: string): T | null {
  try {
    const payload = raw.startsWith(JSON_DATA_PREFIX)
      ? decodeURIComponent(raw.slice(JSON_DATA_PREFIX.length))
      : raw;
    return JSON.parse(payload) as T;
  } catch {
    return null;
  }
}

export function encodeBuildMetadata(meta: BuildMetadata): string {
  return encodeJsonDataUri(meta);
}

export function decodeBuildMetadata(raw: string): BuildMetadata | null {
  return decodeJsonDataUri<BuildMetadata>(raw);
}

export function encodeVerification(result: VerificationResult): string {
  return encodeJsonDataUri(result);
}

export function decodeVerification(raw: string): VerificationResult | null {
  if (!raw) return null;
  return decodeJsonDataUri<VerificationResult>(raw);
}

/**
 * Stable, human-facing receipt id in the form `SHPD-7F3A-91C4`, derived from the
 * build and receipt ids so the same receipt always renders the same label.
 */
export function receiptDisplayId(buildId: bigint, receiptId: bigint): string {
  const mix = (BigInt(buildId) * BigInt(1000003) + BigInt(receiptId) + BigInt(0x7f3a91c4))
    .toString(16)
    .toUpperCase()
    .padStart(8, "0");
  const a = mix.slice(-8, -4);
  const b = mix.slice(-4);
  return `SHPD-${a}-${b}`;
}
