import { NextResponse } from "next/server";

import { recordVerification } from "@/lib/blockchain/server/protocol";

/**
 * POST /api/verification
 * Record a verification reference for a build (authorized protocol write).
 *
 * Body: { buildId: string | number, verificationRef: string }
 * Returns: { hash }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { buildId, verificationRef } = body ?? {};

    if (buildId === undefined || buildId === null || typeof verificationRef !== "string") {
      return NextResponse.json(
        { error: "buildId and verificationRef are required." },
        { status: 400 },
      );
    }

    const { hash } = await recordVerification(BigInt(buildId), verificationRef);
    return NextResponse.json({ hash });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
