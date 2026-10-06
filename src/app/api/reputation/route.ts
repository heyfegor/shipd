import { NextResponse } from "next/server";
import { isAddress } from "viem";

import { recordReputation } from "@/lib/blockchain/server/protocol";

/**
 * POST /api/reputation
 * Record a reputation event derived from a receipt (authorized protocol write).
 *
 * Body: {
 *   subject: `0x${string}`,
 *   receiptId: string | number,
 *   value: string | number,   // signed delta (may be negative)
 *   reason: string            // e.g. "build_verified"
 * }
 * Returns: { hash, eventId }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, receiptId, value, reason } = body ?? {};

    if (typeof subject !== "string" || !isAddress(subject)) {
      return NextResponse.json({ error: "subject must be a valid address." }, { status: 400 });
    }
    if (receiptId === undefined || receiptId === null || value === undefined || value === null) {
      return NextResponse.json(
        { error: "receiptId and value are required." },
        { status: 400 },
      );
    }
    if (typeof reason !== "string" || reason.length === 0) {
      return NextResponse.json({ error: "reason is required." }, { status: 400 });
    }

    const result = await recordReputation({
      subject,
      receiptId: BigInt(receiptId),
      value: BigInt(value),
      reason,
    });

    return NextResponse.json({ hash: result.hash, eventId: result.eventId.toString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
