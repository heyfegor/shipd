"use client";

import { useCallback, useEffect, useState } from "react";

import { getBuild, getReceiptByBuild, type OnchainBuild, type OnchainReceipt } from "@/lib/blockchain/reads";
import {
  decodeBuildMetadata,
  decodeVerification,
  type BuildMetadata,
  type VerificationResult,
} from "@/lib/builds/metadata";

export interface BuildView {
  loading: boolean;
  error: string | null;
  notFound: boolean;
  build: OnchainBuild | null;
  meta: BuildMetadata | null;
  /** Decoded on-chain verification result (set once verified). */
  verification: VerificationResult | null;
  receipt: OnchainReceipt | null;
  reload: () => void;
}

/**
 * Load a build and its derived state (metadata, on-chain verification, receipt)
 * from the chain. Verification state is authoritative: a non-empty
 * `verificationRef` means the build is verified and carries a receipt.
 */
export function useBuild(buildId: string | null): BuildView {
  const [state, setState] = useState<BuildView>({
    loading: true,
    error: null,
    notFound: false,
    build: null,
    meta: null,
    verification: null,
    receipt: null,
    reload: () => {},
  });

  const load = useCallback(async () => {
    if (buildId === null) return;
    let id: bigint;
    try {
      id = BigInt(buildId);
    } catch {
      setState((s) => ({ ...s, loading: false, notFound: true }));
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const build = await getBuild(id);
      if (!build) {
        setState((s) => ({ ...s, loading: false, notFound: true }));
        return;
      }
      const meta = decodeBuildMetadata(build.metadataURI);
      const verification = build.verificationRef ? decodeVerification(build.verificationRef) : null;
      const receipt = verification?.passed ? await getReceiptByBuild(id) : null;
      setState((s) => ({ ...s, loading: false, build, meta, verification, receipt }));
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: err instanceof Error ? err.message : "Failed to load build." }));
    }
  }, [buildId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}
