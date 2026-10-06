"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ConnectGate } from "@/components/ui/connect-gate";
import { useBuild } from "@/hooks/use-build";

const CHECKS = [
  { label: "Tests", note: "Automated" },
  { label: "Security", note: "Automated" },
  { label: "Code quality", note: "Automated" },
  { label: "Contribution split", note: "Automated" },
  { label: "Human review", note: "Where required" },
];

export default function SubmitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <ConnectGate>
      <Submit id={id} />
    </ConnectGate>
  );
}

function Submit({ id }: { id: string }) {
  const router = useRouter();
  const { loading, meta, verification } = useBuild(id);

  // Already verified — nothing to submit.
  if (!loading && verification?.passed) {
    router.replace(`/build/${id}`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-[var(--hair-soft)] px-4 py-5 sm:px-8">
        <span />
        <Link href={`/build/${id}`} className="font-mono text-[12px] uppercase tracking-[0.06em] text-text-muted">
          Cancel
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-[clamp(36px,7vh,80px)]">
        <div className="w-full max-w-[500px]">
          <div className="mb-[18px] font-mono text-[12px] text-text-muted">{meta?.repo ?? "…"}</div>
          <h1 className="mb-3.5 text-[clamp(28px,6.5vw,38px)] font-semibold leading-[1.06] tracking-[-0.03em] text-text">
            Ready to submit this build?
          </h1>
          <p className="mb-9 text-[16px] leading-relaxed text-text-muted">
            Once you submit, we&apos;ll check the following. This can&apos;t be edited mid-verification, so
            make sure the connected repository reflects the work you want checked.
          </p>

          <div className="shpd-label mb-3">Checks that will run</div>
          <div className="shpd-card mb-9 overflow-hidden">
            {CHECKS.map((c, i) => (
              <div
                key={c.label}
                className="flex items-center gap-3.5 px-5 py-4"
                style={{ borderTop: i === 0 ? undefined : "1px solid var(--hair-soft)" }}
              >
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#3a3e42]" />
                <span className="flex-1 text-[15px] font-medium text-text">{c.label}</span>
                <span className="font-mono text-[12px] text-text-muted">{c.note}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button type="button" onClick={() => router.push(`/build/${id}/verifying`)} className="shpd-btn">
              Submit
            </button>
            <Link href={`/build/${id}`} className="text-[15px] font-medium text-text-muted">
              Back
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
