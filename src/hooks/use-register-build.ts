"use client";

import { useCallback, useState } from "react";

import { useShipdWallet } from "@/hooks/use-shipd-wallet";
import type { BuildMetadata } from "@/lib/builds/metadata";
import { encodeBuildMetadata } from "@/lib/builds/metadata";
import { registerBuild } from "@/services/registry";

export type RegisterStatus = "idle" | "pending" | "success" | "error";

export interface UseRegisterBuild {
  status: RegisterStatus;
  error: string | null;
  hash: `0x${string}` | null;
  buildId: bigint | null;
  /** Register a build on-chain from the user's wallet. Returns the new buildId. */
  submit: (meta: BuildMetadata) => Promise<bigint | null>;
  reset: () => void;
}

/**
 * Drives the on-chain `registerBuild` transaction with explicit UI states
 * (pending / success / error) and surfaces the assigned build id. Ensures the
 * wallet is on Monad Testnet first, and maps common wallet errors (rejection,
 * insufficient funds) to readable messages.
 */
export function useRegisterBuild(): UseRegisterBuild {
  const { getWalletClient } = useShipdWallet();
  const [status, setStatus] = useState<RegisterStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [buildId, setBuildId] = useState<bigint | null>(null);

  const submit = useCallback(
    async (meta: BuildMetadata) => {
      setStatus("pending");
      setError(null);
      setHash(null);
      setBuildId(null);
      try {
        const walletClient = await getWalletClient();
        const result = await registerBuild({
          walletClient,
          metadataURI: encodeBuildMetadata(meta),
          submissionRef: `${meta.repo}@${Date.now()}`,
        });
        setHash(result.hash);
        setBuildId(result.buildId);
        setStatus("success");
        return result.buildId;
      } catch (err) {
        setError(readableTxError(err));
        setStatus("error");
        return null;
      }
    },
    [getWalletClient],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setHash(null);
    setBuildId(null);
  }, []);

  return { status, error, hash, buildId, submit, reset };
}

/** Map wallet/RPC errors to a short, human-readable message. */
export function readableTxError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();
  if (lower.includes("user rejected") || lower.includes("denied")) {
    return "Transaction was rejected in your wallet.";
  }
  if (lower.includes("insufficient funds")) {
    return "Insufficient MON for gas. Fund your wallet on Monad Testnet and try again.";
  }
  if (lower.includes("no wallet")) {
    return "No wallet connected. Sign in to create a wallet.";
  }
  // Keep it to the first line to avoid dumping a stack into the UI.
  return raw.split("\n")[0].slice(0, 200);
}
