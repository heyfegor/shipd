import { NextResponse } from "next/server";
import { isAddress } from "viem";

import { createReceipt, hashEvidence } from "@/lib/blockchain/server/protocol";

/**
 * POST /api/receipts
 * Create a work receipt for a verified build (authorized protocol write).
 *
 * Body: {
 *   buildId: string | number,
 *   worker: `0x${string}`,
 *   verificationRef: string,
 *   evidence?: string,          // raw off-chain evidence, hashed server-side
 *   evidenceHash?: `0x${string}` // or a precomputed bytes32 hash
 * }
 * Returns: { hash, receiptId }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { buildId, worker, verificationRef, evidence, evidenceHash } = body ?? {};

    if (buildId === undefined || buildId === null || typeof verificationRef !== "string") {
      return NextResponse.json(
        { error: "buildId and verificationRef are required." },
        { status: 400 },
      );
    }
    if (typeof worker !== "string" || !isAddress(worker)) {
      return NextResponse.json({ error: "worker must be a valid address." }, { status: 400 });
    }

    const hash32: `0x${string}` =
      typeof evidenceHash === "string"
        ? (evidenceHash as `0x${string}`)
        : hashEvidence(typeof evidence === "string" ? evidence : verificationRef);

    const result = await createReceipt({
      buildId: BigInt(buildId),
      worker,
      verificationRef,
      evidenceHash: hash32,
    });

    return NextResponse.json({ hash: result.hash, receiptId: result.receiptId.toString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
