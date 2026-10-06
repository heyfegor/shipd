import { NextResponse } from "next/server";

import { decodeBuildMetadata, encodeVerification, receiptDisplayId } from "@/lib/builds/metadata";
import { getBuild } from "@/lib/blockchain/reads";
import {
  createReceipt,
  hashEvidence,
  recordReputation,
  recordVerification,
} from "@/lib/blockchain/server/protocol";
import { buildVerifiedDelta } from "@/lib/reputation/policy";
import { runVerification } from "@/lib/verification/engine";

// This route sends three sequential on-chain txs (verification → receipt →
// reputation) and waits for each to mine, so it needs headroom beyond the
// default serverless timeout. Always run it dynamically (never cached).
export const maxDuration = 60;
export const dynamic = "force-dynamic";

/**
 * POST /api/builds/:id/verify
 *
 * Runs verification for a build and, ONLY on pass, records the full chain of
 * authorized protocol writes: verification reference → work receipt →
 * reputation event. A failed build is returned to the client for display but
 * writes nothing on-chain (failed builds carry no public record).
 *
 * The build id and its metadata are read from the chain (source of truth); the
 * client cannot forge the inputs or the result.
 */
export async function POST(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    let buildId: bigint;
    try {
      buildId = BigInt(id);
    } catch {
      return NextResponse.json({ error: "Invalid build id." }, { status: 400 });
    }

    const build = await getBuild(buildId);
    if (!build) {
      return NextResponse.json({ error: "Build not found." }, { status: 404 });
    }

    const meta = decodeBuildMetadata(build.metadataURI);
    if (!meta) {
      return NextResponse.json({ error: "Build metadata could not be decoded." }, { status: 422 });
    }

    const result = runVerification(meta);

    if (!result.passed) {
      // No on-chain record for a failed build.
      return NextResponse.json({ passed: false, result });
    }

    const verificationRef = encodeVerification(result);
    const evidenceHash = hashEvidence(verificationRef);

    await recordVerification(buildId, verificationRef);
    const { receiptId } = await createReceipt({
      buildId,
      worker: build.builder,
      verificationRef,
      evidenceHash,
    });
    const { eventId } = await recordReputation({
      subject: build.builder,
      receiptId,
      value: BigInt(buildVerifiedDelta(result.score)),
      reason: "build_verified",
    });

    return NextResponse.json({
      passed: true,
      result,
      receiptId: receiptId.toString(),
      eventId: eventId.toString(),
      displayId: receiptDisplayId(buildId, receiptId),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
