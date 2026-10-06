"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ConnectGate } from "@/components/ui/connect-gate";
import { useBuild } from "@/hooks/use-build";
import type { CheckResult } from "@/lib/builds/metadata";

const CHECK_LABELS = ["Tests", "Security", "Code quality", "Contribution split", "Human review"];

type VerifyResponse = {
  passed: boolean;
  result: { passed: boolean; score: number; checks: CheckResult[] };
  receiptId?: string;
  displayId?: string;
  error?: string;
};

export default function VerifyingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <ConnectGate>
      <Verifying id={id} />
    </ConnectGate>
  );
}

function Verifying({ id }: { id: string }) {
  const router = useRouter();
  const { meta } = useBuild(id);

  const [checks, setChecks] = useState<CheckResult[] | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(false);

  // Kick off the real verification once.
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);

    (async () => {
      try {
        const res = await fetch(`/api/builds/${id}/verify`, { method: "POST" });
        const data = (await res.json()) as VerifyResponse;
        if (!res.ok || data.error) throw new Error(data.error ?? "Verification failed to run.");

        // Persist for the result screen (the failed path has no on-chain record).
        try {
          sessionStorage.setItem(`shipd:verify:${id}`, JSON.stringify(data));
        } catch {}

        setChecks(data.result.checks);
        // Reveal completed checks in sequence for legibility (the work is done).
        data.result.checks.forEach((_, i) => {
          setTimeout(() => setRevealed(i + 1), 450 * (i + 1));
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Verification failed to run.");
      } finally {
        clearInterval(timer);
      }
    })();

    return () => clearInterval(timer);
  }, [id]);

  const finished = checks !== null && revealed >= checks.length;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-[var(--hair-soft)] px-4 py-5 sm:px-8">
        <span />
        <Link href={`/build/${id}`} className="font-mono text-[12px] uppercase tracking-[0.06em] text-text-muted">
          Close
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center px-6 py-[clamp(32px,6vh,72px)]">
        <div className="w-full max-w-[560px]">
          <span className="shpd-pill mb-6" style={{ borderColor: "var(--hair-strong)" }}>
            <span
              className="h-[7px] w-[7px] flex-none rounded-full bg-text-muted"
              style={{ animation: finished ? undefined : "shpPulse 1.6s ease-in-out infinite" }}
            />
            <span className="text-text">{finished ? "COMPLETE" : "VERIFYING"}</span>
          </span>

          <h1 className="mb-2 text-[clamp(26px,5.5vw,36px)] font-semibold leading-[1.06] tracking-[-0.03em] text-text">
            {meta?.name ?? "Verifying build"}
          </h1>
          <div className="mb-7 font-mono text-[12px] text-text-muted">{meta?.repo ?? "…"}</div>

          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="font-mono text-[12px] text-text-muted">
              {revealed} of {CHECK_LABELS.length} checks complete
            </span>
            <span className="font-mono text-[12px] text-text-muted">{elapsed}s</span>
          </div>
          <div className="mb-7 flex gap-1.5">
            {CHECK_LABELS.map((_, i) => (
              <span
                key={i}
                className="h-1 flex-1 rounded transition-colors duration-300"
                style={{ background: i < revealed ? "var(--signal)" : "var(--track)" }}
              />
            ))}
          </div>

          {error ? (
            <div className="rounded-xl border border-[var(--danger-border)] bg-[rgba(229,103,94,0.08)] p-6 font-mono text-sm text-danger">
              {error}
            </div>
          ) : (
            <div className="shpd-card overflow-hidden">
              {CHECK_LABELS.map((label, i) => {
                const check = checks?.[i];
                const isDone = i < revealed && check;
                const isRunning = !isDone && !error;
                return (
                  <div
                    key={label}
                    className="flex items-center gap-4 px-5 py-[18px]"
                    style={{ borderTop: i === 0 ? undefined : "1px solid var(--hair-soft)" }}
                  >
                    <span className="flex h-5 w-5 flex-none items-center justify-center">
                      {isDone ? (
                        <CheckOrX pass={check!.passed} />
                      ) : isRunning ? (
                        <span
                          className="h-4 w-4 rounded-full border-[1.6px] border-[rgba(243,243,238,0.16)]"
                          style={{ borderTopColor: "var(--text)", animation: "shpRing 0.8s linear infinite" }}
                        />
                      ) : (
                        <span className="h-3.5 w-3.5 rounded-full border-[1.5px] border-[rgba(243,243,238,0.22)]" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-medium text-text">{label}</div>
                      {isDone && <div className="mt-0.5 font-mono text-[12px] text-text-muted">{check!.evidence}</div>}
                    </div>
                    <span className="whitespace-nowrap font-mono text-[11px] tracking-[0.08em]" style={{ color: isDone ? (check!.passed ? "var(--signal)" : "var(--danger)") : "var(--text-muted)" }}>
                      {isDone ? (check!.passed ? "PASS" : "FAIL") : isRunning ? "RUNNING" : "PENDING"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {!finished && !error && (
            <p className="mx-0.5 mt-5 text-sm leading-relaxed text-text-muted">
              This runs automatically. You don&apos;t need to stay on this screen.
            </p>
          )}

          {finished && (
            <div
              className="mt-5 flex flex-wrap items-center justify-between gap-3.5 rounded-xl border bg-surface p-[18px]"
              style={{ borderColor: "var(--signal-border)" }}
            >
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 flex-none rounded-full bg-signal" />
                <span className="text-[15px] font-semibold tracking-tight text-text">All checks complete</span>
              </div>
              <button type="button" onClick={() => router.push(`/build/${id}/result`)} className="shpd-btn px-[22px] py-[11px] text-sm">
                View result
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function CheckOrX({ pass }: { pass: boolean }) {
  return (
    <span
      className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full"
      style={{ background: pass ? "var(--signal)" : "var(--danger)" }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        {pass ? (
          <path d="M2 5.2l2 2L8 3" stroke="#090A0B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M3 3l4 4M7 3l-4 4" stroke="#090A0B" strokeWidth="1.8" strokeLinecap="round" />
        )}
      </svg>
    </span>
  );
}
