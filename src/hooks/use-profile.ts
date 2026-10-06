"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getBuildsByBuilder,
  getReputationEvents,
  type OnchainBuild,
  type OnchainReputationEvent,
} from "@/lib/blockchain/reads";
import { decodeBuildMetadata, decodeVerification, type BuildMetadata } from "@/lib/builds/metadata";
import { statusLabel } from "@/lib/reputation/policy";

export interface ProfileBuild {
  build: OnchainBuild;
  meta: BuildMetadata | null;
  verified: boolean;
  score: number | null;
}

export interface ProfileData {
  loading: boolean;
  error: string | null;
  builds: ProfileBuild[];
  events: OnchainReputationEvent[];
  score: number;
  status: string;
  reload: () => void;
}

/** Aggregate a subject's on-chain builds and reputation ledger for the UI. */
export function useProfile(address: `0x${string}` | null): ProfileData {
  const [data, setData] = useState<ProfileData>({
    loading: true,
    error: null,
    builds: [],
    events: [],
    score: 0,
    status: statusLabel(0),
    reload: () => {},
  });

  const load = useCallback(async () => {
    if (!address) return;
    setData((d) => ({ ...d, loading: true, error: null }));
    try {
      const [rawBuilds, events] = await Promise.all([
        getBuildsByBuilder(address),
        getReputationEvents(address),
      ]);
      const builds: ProfileBuild[] = rawBuilds.map((build) => {
        const meta = decodeBuildMetadata(build.metadataURI);
        const verification = build.verificationRef ? decodeVerification(build.verificationRef) : null;
        return {
          build,
          meta,
          verified: verification?.passed === true,
          score: verification?.passed ? verification.score : null,
        };
      });
      const score = events.reduce((sum, e) => sum + Number(e.value), 0);
      setData((d) => ({ ...d, loading: false, builds, events, score, status: statusLabel(score) }));
    } catch (err) {
      setData((d) => ({ ...d, loading: false, error: err instanceof Error ? err.message : "Failed to load." }));
    }
  }, [address]);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...data, reload: load };
}
