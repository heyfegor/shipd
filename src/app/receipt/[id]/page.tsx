import Link from "next/link";

import { MONAD_TESTNET_EXPLORER_URL } from "@/lib/blockchain";
import { CONTRACT_ADDRESSES } from "@/lib/blockchain/addresses";
import { getBuild, getReceipt } from "@/lib/blockchain/reads";
import {
  decodeBuildMetadata,
  decodeVerification,
  receiptDisplayId,
  type CheckResult,
} from "@/lib/builds/metadata";

import { ReceiptActions } from "./receipt-actions";

export const metadata = { title: "Work Receipt · Shipd" };

function formatDate(secs: bigint): string {
  return new Date(Number(secs) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Public, no-auth Work Receipt (`/receipt/:id`). Server-rendered from on-chain
 * data so anyone — with or without a Shipd account — can independently check
 * what happened. Immutable: it renders exactly what the chain holds.
 */
export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let receiptId: bigint;
  try {
    receiptId = BigInt(id);
  } catch {
    return <Shell>Invalid receipt id.</Shell>;
  }

  const receipt = await getReceipt(receiptId);
  if (!receipt) return <Shell>Receipt #{id} was not found on-chain.</Shell>;

  const build = await getBuild(receipt.buildId);
  const meta = build ? decodeBuildMetadata(build.metadataURI) : null;
  const verification = decodeVerification(receipt.verificationRef);
  const display = receiptDisplayId(receipt.buildId, receiptId);
  const explorerUrl = `${MONAD_TESTNET_EXPLORER_URL}/address/${CONTRACT_ADDRESSES.WorkReceipt}`;

  const findCheck = (key: CheckResult["key"]) => verification?.checks.find((c) => c.key === key);
  const human = meta?.split.human ?? 100;
  const agent = meta?.split.agent ?? 0;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="noprint flex items-center justify-between gap-4 border-b border-[var(--hair-soft)] px-4 py-5 sm:px-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.06em] text-text-muted">
          ← Dashboard
        </Link>
        <span className="text-[15px] font-semibold tracking-tight text-text">shipd</span>
      </header>

      <main className="flex flex-1 justify-center px-4 pb-24 pt-[clamp(28px,5vw,64px)] sm:px-8">
        <div className="w-full max-w-[560px]">
          <div className="shpd-card overflow-hidden" style={{ borderColor: "var(--signal-border)" }}>
            {/* HEAD */}
            <div className="flex items-center justify-between gap-3 border-b border-[var(--hair)] px-6 py-[18px]">
              <span className="font-mono text-[12px] tracking-[0.12em] text-text">SHIPD WORK RECEIPT</span>
              <span className="shpd-pill" style={{ borderColor: "rgba(184,255,61,0.4)" }}>
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-signal" />
                <span className="text-signal">VERIFIED</span>
              </span>
            </div>

            <div className="px-6 pb-7 pt-6">
              {/* BUILD */}
              <div className="mb-6">
                <div className="shpd-label mb-2.5">Build</div>
                <div className="text-[20px] font-semibold tracking-tight text-text">{meta?.name ?? `Build #${receipt.buildId}`}</div>
              </div>

              {/* CONTRIBUTORS */}
              <div className="mb-6">
                <div className="shpd-label mb-3">Contributors</div>
                <div className="mb-3 flex h-2 overflow-hidden rounded-sm bg-track">
                  <div className="h-full bg-text" style={{ width: `${human}%` }} />
                  <div className="h-full bg-[#3a3e42]" style={{ width: `${agent}%` }} />
                </div>
                <div className="flex justify-between font-mono text-[13px]">
                  <span className="text-text">Human <span className="text-text-muted">{human}%</span></span>
                  <span className="text-text">Agent <span className="text-text-muted">{agent}%</span></span>
                </div>
              </div>

              {/* VERIFICATION */}
              <div className="mb-6">
                <div className="shpd-label mb-3">Verification</div>
                <div className="flex flex-col font-mono text-[13.5px]">
                  <VRow label="Tests" check={findCheck("tests")} />
                  <VRow label="Security" check={findCheck("security")} />
                  <VRow label="Code quality" value={verification ? String(verification.qualityScore) : "—"} />
                  <VRow label="Human review" check={findCheck("review")} last />
                </div>
              </div>

              {/* RESULT */}
              <div className="flex items-end justify-between gap-4 border-t border-[var(--hair)] pt-[22px]">
                <div>
                  <div className="shpd-label mb-2">Result</div>
                  <div className="text-[44px] font-semibold leading-none tracking-tight text-signal">
                    {verification?.score ?? "—"}
                    <span className="text-[20px] font-medium text-text-muted"> / 100</span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="shpd-pill mb-2" style={{ borderColor: "rgba(184,255,61,0.4)" }}>
                    <span className="h-1.5 w-1.5 flex-none rounded-full bg-signal" />
                    <span className="text-signal">VERIFIED · MONAD</span>
                  </div>
                  <div className="text-[11.5px] text-text-muted">{formatDate(receipt.issuedAt)}</div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-[var(--hair)] px-6 py-4">
              <span className="font-mono text-[11.5px] text-text-muted">Receipt ID: {display}</span>
              <ReceiptActions explorerUrl={explorerUrl} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function VRow({
  label,
  check,
  value,
  last,
}: {
  label: string;
  check?: CheckResult;
  value?: string;
  last?: boolean;
}) {
  const display = value ?? (check ? (check.passed ? "PASS" : "FAIL") : "—");
  const color = value ? "var(--text)" : check?.passed ? "var(--signal)" : check ? "var(--danger)" : "var(--text-muted)";
  return (
    <div
      className="flex justify-between py-2"
      style={{ borderBottom: last ? undefined : "1px solid var(--hair-soft)" }}
    >
      <span className="text-text-muted">{label}</span>
      <span style={{ color, letterSpacing: "0.06em" }}>{display}</span>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center px-6 py-24 text-center font-mono text-sm text-text-muted">
      {children}
    </main>
  );
}
