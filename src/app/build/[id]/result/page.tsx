"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

import { ConnectGate } from "@/components/ui/connect-gate";
import { useBuild } from "@/hooks/use-build";
import type { CheckResult, VerificationResult } from "@/lib/builds/metadata";

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <ConnectGate>
      <Result id={id} />
    </ConnectGate>
  );
}

function Result({ id }: { id: string }) {
  const { loading, meta, verification, receipt } = useBuild(id);
  const [stashed, setStashed] = useState<VerificationResult | null>(null);

  // The failed path has no on-chain record; recover it from the verify response.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`shipd:verify:${id}`);
      if (raw) setStashed((JSON.parse(raw).result as VerificationResult) ?? null);
    } catch {}
  }, [id]);

  if (loading) return <Centered>Loading result…</Centered>;

  const result = verification ?? stashed;
  const verified = verification?.passed === true;

  if (!result) return <Centered>No verification has run for this build yet.</Centered>;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-[var(--hair-soft)] px-4 py-5 sm:px-8">
        <span />
        <Link href={`/build/${id}`} className="font-mono text-[12px] uppercase tracking-[0.06em] text-text-muted">
          Build detail
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-[clamp(36px,7vh,80px)]">
        <div className="w-full max-w-[520px]">
          {verified ? (
            <>
              <span className="shpd-pill mb-6" style={{ borderColor: "var(--signal-border)" }}>
                <span className="h-[7px] w-[7px] flex-none rounded-full bg-signal" />
                <span className="text-text">VERIFIED</span>
              </span>
              <h1 className="mb-7 text-[clamp(30px,6.5vw,42px)] font-semibold leading-[1.05] tracking-[-0.03em] text-text">
                {meta?.name} is verified.
              </h1>
              <div className="mb-6 flex items-baseline gap-2.5 border-b border-[var(--hair)] pb-6">
                <span className="text-[clamp(56px,13vw,76px)] font-semibold leading-[0.9] tracking-[-0.04em] text-signal">
                  {result.score}
                </span>
                <span className="font-mono text-[20px] text-text-muted">/ 100</span>
              </div>
              <div className="mb-8 flex flex-col gap-3">
                {result.checks.map((c) => (
                  <ResultRow key={c.key} check={c} />
                ))}
              </div>
              <p className="mb-8 text-[16px] leading-relaxed text-text-muted">
                This is now a Work Receipt. Anyone can check it.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                {receipt && (
                  <Link href={`/receipt/${receipt.receiptId.toString()}`} className="shpd-btn">
                    View Work Receipt
                  </Link>
                )}
                <Link href="/dashboard" className="shpd-btn-ghost">
                  Go to Dashboard
                </Link>
              </div>
            </>
          ) : (
            <>
              <span className="shpd-pill mb-6" style={{ borderColor: "var(--danger-border)" }}>
                <span className="h-[7px] w-[7px] flex-none rounded-full bg-danger" />
                <span className="text-text">VERIFICATION FAILED</span>
              </span>
              <h1 className="mb-6 text-[clamp(30px,6.5vw,42px)] font-semibold leading-[1.05] tracking-[-0.03em] text-text">
                {meta?.name} didn&apos;t pass verification.
              </h1>
              <p className="mb-4 text-[16px] leading-relaxed text-text-muted">Here&apos;s what didn&apos;t check out:</p>
              <div className="shpd-card mb-7 overflow-hidden">
                {result.checks
                  .filter((c) => !c.passed)
                  .map((c, i) => (
                    <div
                      key={c.key}
                      className="flex gap-3.5 px-5 py-[18px]"
                      style={{ borderTop: i === 0 ? undefined : "1px solid var(--hair-soft)" }}
                    >
                      <span className="mt-0.5 inline-flex h-[15px] w-[15px] flex-none items-center justify-center rounded-full bg-danger">
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                          <path d="M3 3l4 4M7 3l-4 4" stroke="#090A0B" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 text-[15px] font-semibold tracking-tight text-text">{c.label}</div>
                        <div className="text-[14px] leading-relaxed text-text-muted">{c.evidence}</div>
                      </div>
                    </div>
                  ))}
              </div>
              <p className="mb-8 text-[16px] leading-relaxed text-text-muted">Fix what&apos;s listed and resubmit when ready.</p>
              <div className="flex items-center gap-4">
                <Link href={`/build/${id}/submit`} className="shpd-btn">
                  Fix and Resubmit
                </Link>
                <Link href={`/build/${id}`} className="text-[15px] font-medium text-text-muted">
                  Back to Build Detail
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function ResultRow({ check }: { check: CheckResult }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex h-[15px] w-[15px] flex-none items-center justify-center rounded-full bg-signal">
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
          <path d="M2 5.2l2 2L8 3" stroke="#090A0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="flex-1 text-[14px] text-text">{check.label}</span>
      <span className="font-mono text-[12px] text-text-muted">{check.evidence}</span>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24 text-center font-mono text-sm text-text-muted">
      {children}
    </main>
  );
}
