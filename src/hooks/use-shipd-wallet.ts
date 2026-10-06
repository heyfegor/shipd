"use client";

import { useCallback, useMemo } from "react";
import { useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom, type WalletClient } from "viem";

import { MONAD_TESTNET_CHAIN_ID } from "@/lib/blockchain";
import { monadTestnetViem } from "@/lib/blockchain/viem-chain";

/**
 * Parse an EIP-155 CAIP-2 chain id (e.g. `"eip155:10143"`) into its numeric
 * chain id. Also tolerates a bare numeric string. Returns null if unparseable.
 */
function parseEvmChainId(chainId: string | undefined): number | null {
  if (!chainId) return null;
  const raw = chainId.includes(":") ? chainId.split(":").pop() : chainId;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export interface ShipdWallet {
  /** True once Privy's wallet list has resolved. */
  ready: boolean;
  /** The active wallet's address, or null when no wallet is connected. */
  address: `0x${string}` | null;
  /** The active wallet's current numeric chain id, or null. */
  chainId: number | null;
  /** Whether the active wallet is currently on Monad Testnet. */
  isMonadTestnet: boolean;
  /**
   * Ensure the active wallet is on Monad Testnet, switching it if needed.
   * Throws if there is no connected wallet.
   */
  ensureMonadTestnet: () => Promise<void>;
  /**
   * Build a viem `WalletClient` bound to Monad Testnet and the active wallet,
   * backed by the wallet's EIP-1193 provider. Switches the wallet to Monad
   * first. Throws if there is no connected wallet.
   */
  getWalletClient: () => Promise<WalletClient>;
}

/**
 * Shipd's on-chain wallet surface for client components.
 *
 * Wraps Privy's `useWallets` to expose the single active wallet (preferring the
 * embedded Privy wallet), its network status relative to Monad Testnet, and a
 * viem `WalletClient` factory for sending transactions. Feature code uses this
 * rather than touching Privy or viem wallet plumbing directly.
 *
 * Must be used within the Shipd provider tree (see `ShipdProviders`).
 */
export function useShipdWallet(): ShipdWallet {
  const { wallets, ready } = useWallets();

  // Prefer Privy's embedded wallet (passkey/email users), else the first
  // connected wallet (an external wallet the user linked).
  const wallet = useMemo(() => {
    if (wallets.length === 0) return undefined;
    return wallets.find((w) => w.walletClientType === "privy") ?? wallets[0];
  }, [wallets]);

  const address = (wallet?.address as `0x${string}` | undefined) ?? null;
  const chainId = parseEvmChainId(wallet?.chainId);
  const isMonadTestnet = chainId === MONAD_TESTNET_CHAIN_ID;

  const ensureMonadTestnet = useCallback(async () => {
    if (!wallet) throw new Error("No wallet connected.");
    if (parseEvmChainId(wallet.chainId) !== MONAD_TESTNET_CHAIN_ID) {
      await wallet.switchChain(MONAD_TESTNET_CHAIN_ID);
    }
  }, [wallet]);

  const getWalletClient = useCallback(async (): Promise<WalletClient> => {
    if (!wallet) throw new Error("No wallet connected.");
    await ensureMonadTestnet();
    const provider = await wallet.getEthereumProvider();
    return createWalletClient({
      account: wallet.address as `0x${string}`,
      chain: monadTestnetViem,
      transport: custom(provider),
    });
  }, [wallet, ensureMonadTestnet]);

  return {
    ready,
    address,
    chainId,
    isMonadTestnet,
    ensureMonadTestnet,
    getWalletClient,
  };
}
