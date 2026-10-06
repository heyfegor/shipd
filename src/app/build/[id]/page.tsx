"use client";

import { use } from "react";
import Link from "next/link";

import { ConnectGate } from "@/components/ui/connect-gate";
import { useBuild } from "@/hooks/use-build";

export default function BuildDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <ConnectGate>
      <BuildDetail id={id} />
    </ConnectGate>
  );
}

function BuildDetail({ id }: { id: string }) {
  const { loading, notFound, error, build, meta, verification, receipt } = useBuild(id);

  if (loading) return <Centered>Loading build…</Centered>;
  if (notFound) return <Centered>Build #{id} was not found on-chain.</Centered>;
  if (error || !build || !meta) return <Centered>{error ?? "Could not load this build."}</Centered>;

  const verified = verification?.passed === true;

  return (
    <main className="mx-auto max-w-[760px] px-4 pb-24 pt-[clamp(24px,4vw,44px)] sm:px-8">
      <Link href="/dashboard" className="mb-7 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.06em] text-text-muted">
        ← Dashboard
      </Link>

      <div className="mb-[18px] flex flex-wrap items-center gap-3.5">
        <span className="shpd-pill" style={{ borderColor: verified ? "var(--signal-border)" : "var(--hair-strong)" }}>
          <span className={`h-1.5 w-1.5 flex-none rounded-full ${verified ? "bg-signal" : "bg-text-muted"}`} />
          <span className="text-text">{verified ? "VERIFIED" : "IN PROGRESS"}</span>
        </span>
        <span className="font-mono text-[12px] text-text-muted">{meta.repo}</span>
      </div>

      <h1 className="mb-4 text-[clamp(30px,6vw,42px)] font-semibold leading-[1.04] tracking-[-0.03em] text-text">
        {meta.name}
      </h1>
      {meta.description && (
        <p className="mb-10 max-w-[60ch] text-[17px] leading-relaxed text-text-muted">{meta.description}</p>
      )}

      {/* CONTRIBUTORS */}
      <div className="shpd-label mb-3">Contributors</div>
      <div className="shpd-card mb-9 overflow-hidden">
        {meta.contributors.map((c, i) => (
          <div
            key={c.handle + i}
            className="flex items-center gap-3.5 px-5 py-4"
            style={{ borderTop: i === 0 ? undefined : "1px solid var(--hair-soft)" }}
          >
            <span
              className="inline-flex h-9 w-9 flex-none items-center justify-center border border-[var(--hair-strong)] bg-background font-mono text-sm text-text"
              style={{ borderRadius: c.kind === "agent" ? "8px" : "50%" }}
            >
              {c.kind === "agent" ? "▣" : c.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold tracking-tight text-text">{c.name}</div>
              <div className="mt-0.5 font-mono text-[12px] text-text-muted">{c.handle}</div>
            </div>
            <span className="whitespace-nowrap rounded border border-[var(--hair-strong)] px-2 py-0.5 font-mono text-[10.5px] tracking-[0.1em] text-text-muted">
              {c.kind.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {/* VERIFICATION */}
      <div className="shpd-label mb-3">Verification</div>
      {verified && receipt ? (
        <Link
          href={`/receipt/${receipt.receiptId.toString()}`}
          className="shpd-row mb-9 flex flex-wrap items-center justify-between gap-3.5 rounded-xl border bg-surface p-6"
          style={{ borderColor: "var(--signal-border)" }}
        >
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 flex-none rounded-full bg-signal" />
            <span className="text-[16px] font-semibold tracking-tight text-text">Verified</span>
            <span className="font-mono text-sm text-signal">{verification!.score}/100</span>
          </div>
          <span className="whitespace-nowrap font-mono text-[12px] tracking-[0.04em] text-text">View Work Receipt →</span>
        </Link>
      ) : (
        <div className="shpd-card mb-9 p-6">
          <div className="mb-5 text-[16px] text-text-muted">Not submitted for verification yet.</div>
          <Link href={`/build/${id}/submit`} className="shpd-btn">
            Submit for Verification
          </Link>
        </div>
      )}
    </main>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex max-w-[760px] flex-1 items-center justify-center px-6 py-24 text-center font-mono text-sm text-text-muted">
      {children}
    </main>
  );
}
