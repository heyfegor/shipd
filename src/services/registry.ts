/**
 * Build registration against ShipdRegistry.
 *
 * `registerBuild` is the on-chain entry point of the Shipd flow
 * (USER -> BUILD -> ...). It is callable by anyone and records the caller as the
 * builder, so it is sent from the user's own wallet (not an authorized protocol
 * key). The assigned `buildId` is read back from the `BuildRegistered` event in
 * the mined transaction's logs.
 */
import { parseEventLogs, type Hash, type WalletClient } from "viem";

import { shipdRegistryContract } from "@/lib/blockchain/contracts";
import { getPublicClient } from "@/lib/blockchain/public-client";

export interface RegisterBuildParams {
  /** A viem wallet client bound to the builder's wallet and Monad Testnet. */
  walletClient: WalletClient;
  /** Off-chain build metadata reference (e.g. an IPFS/URL pointer). */
  metadataURI: string;
  /** Off-chain submission reference (e.g. repo + commit). */
  submissionRef: string;
}

export interface RegisterBuildResult {
  /** The submitted transaction hash. */
  hash: Hash;
  /** The build id assigned on-chain, parsed from the BuildRegistered event. */
  buildId: bigint;
}

/**
 * Register a build on-chain. Submits the transaction from the builder's wallet,
 * waits for it to be mined, and returns the transaction hash and the assigned
 * build id.
 *
 * @throws if the wallet client has no account or the event cannot be found.
 */
export async function registerBuild({
  walletClient,
  metadataURI,
  submissionRef,
}: RegisterBuildParams): Promise<RegisterBuildResult> {
  const account = walletClient.account;
  if (!account) throw new Error("Wallet client has no account.");

  const publicClient = getPublicClient();

  const hash = await walletClient.writeContract({
    ...shipdRegistryContract,
    chain: walletClient.chain,
    account,
    functionName: "registerBuild",
    args: [metadataURI, submissionRef],
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  const logs = parseEventLogs({
    abi: shipdRegistryContract.abi,
    eventName: "BuildRegistered",
    logs: receipt.logs,
  });

  const event = logs[0];
  if (!event) {
    throw new Error("registerBuild succeeded but no BuildRegistered event was found.");
  }

  return { hash, buildId: event.args.buildId };
}
