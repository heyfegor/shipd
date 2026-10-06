/**
 * Server-side protocol signer.
 *
 * SERVER ONLY. Builds a viem wallet client from the Shipd protocol key
 * (`MONAD_DEPLOYER_PRIVATE_KEY`) — the address authorized on ShipdRegistry /
 * WorkReceipt / Reputation to record verifications, create receipts, and record
 * reputation events. The private key is read from a non-`NEXT_PUBLIC` env var so
 * it is never bundled for the browser; this module must only be imported from
 * server code (route handlers / server actions).
 *
 * The user-facing `registerBuild` call does NOT use this signer — it is sent
 * from the user's own wallet (see `services/registry.ts`).
 */
import {
  createWalletClient,
  http,
  type PrivateKeyAccount,
  type WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { monadTestnetViem } from "../viem-chain";

/** Server RPC endpoint. Falls back to the public Monad Testnet RPC. */
const SERVER_RPC_URL =
  process.env.MONAD_TESTNET_RPC_URL ?? "https://testnet-rpc.monad.xyz";

let cachedClient: WalletClient | undefined;
let cachedAccount: PrivateKeyAccount | undefined;

/** Normalize the configured key to a 0x-prefixed hex string. */
function readKey(): `0x${string}` {
  if (typeof window !== "undefined") {
    throw new Error("The protocol signer must never run in the browser.");
  }
  const raw = process.env.MONAD_DEPLOYER_PRIVATE_KEY?.trim();
  if (!raw) {
    throw new Error(
      "MONAD_DEPLOYER_PRIVATE_KEY is not set. The protocol signer cannot record on-chain events.",
    );
  }
  return (raw.startsWith("0x") ? raw : `0x${raw}`) as `0x${string}`;
}

/** The authorized protocol account (derived from the protocol key). */
export function getProtocolAccount(): PrivateKeyAccount {
  if (!cachedAccount) {
    cachedAccount = privateKeyToAccount(readKey());
  }
  return cachedAccount;
}

/** A viem wallet client for the authorized protocol account on Monad Testnet. */
export function getProtocolWalletClient(): WalletClient {
  if (!cachedClient) {
    cachedClient = createWalletClient({
      account: getProtocolAccount(),
      chain: monadTestnetViem,
      transport: http(SERVER_RPC_URL),
    });
  }
  return cachedClient;
}
