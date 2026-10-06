"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ConnectGate } from "@/components/ui/connect-gate";
import { useShipdAuth } from "@/lib/auth";
import { useRegisterBuild } from "@/hooks/use-register-build";
import type { BuildMetadata, Contributor } from "@/lib/builds/metadata";

type ContribChoice = "just-me" | "agents" | "team";

export default function NewBuildPage() {
  return (
    <ConnectGate>
      <NewBuildWizard />
    </ConnectGate>
  );
}

function NewBuildWizard() {
  const router = useRouter();
  const { identity } = useShipdAuth();
  const { status, error, submit, buildId } = useRegisterBuild();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [repo, setRepo] = useState("");
  const [choice, setChoice] = useState<ContribChoice>("just-me");
  const [teamHandle, setTeamHandle] = useState("");

  const me = useMemo(() => {
    const handle = identity?.email?.split("@")[0] ?? identity?.wallet?.slice(0, 8) ?? "you";
    const name = identity?.email?.split("@")[0] ?? "You";
    return { name, handle: `@${handle}` };
  }, [identity]);

  const pending = status === "pending";

  function buildMetadata(): BuildMetadata {
    let contributors: Contributor[];
    let split: { human: number; agent: number };
    if (choice === "agents") {
      contributors = [
        { name: me.name, handle: me.handle, kind: "human" },
        { name: "codegen", handle: "@codegen", kind: "agent" },
      ];
      split = { human: 68, agent: 32 };
    } else if (choice === "team") {
      contributors = [
        { name: me.name, handle: me.handle, kind: "human" },
        { name: teamHandle.replace("@", "") || "teammate", handle: teamHandle || "@teammate", kind: "human" },
      ];
      split = { human: 100, agent: 0 };
    } else {
      contributors = [{ name: me.name, handle: me.handle, kind: "human" }];
      split = { human: 100, agent: 0 };
    }
    return { name: name.trim(), description: description.trim(), repo: repo.trim(), contributors, split };
  }

  async function handleCreate() {
    const newId = await submit(buildMetadata());
    if (newId !== null) setStep(4); // show the "build created" confirmation
  }

  return (
    <div className="flex min-h-screen flex-col">
      {step < 4 && (
        <header className="flex items-center justify-between gap-4 border-b border-[var(--hair-soft)] px-4 py-5 sm:px-8">
          <span />
          <Link href="/dashboard" className="font-mono text-[12px] uppercase tracking-[0.06em] text-text-muted">
            Cancel
          </Link>
        </header>
      )}

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-[clamp(36px,7vh,80px)]">
        <div className="w-full max-w-[460px]">
          <StepBar step={step} />

          {step === 1 && (
            <>
              <h1 className="mb-3 text-[clamp(28px,6.5vw,38px)] font-semibold leading-[1.06] tracking-[-0.03em] text-text">
                What are you building?
              </h1>
              <p className="mb-9 text-[17px] leading-relaxed text-text-muted">
                Give your build a name and a short description. This is the record that gets verified
                later.
              </p>
              <div className="mb-9 flex flex-col gap-5">
                <Field label="BUILD NAME">
                  <input
                    className="shpd-input"
                    placeholder="e.g. Monad Payment Router"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
                <Field label="DESCRIPTION">
                  <textarea
                    className="shpd-input"
                    rows={3}
                    placeholder="A short line on what this build does."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Field>
              </div>
              <Nav
                backHref="/dashboard"
                backLabel="Cancel"
                onNext={() => setStep(2)}
                nextLabel="Continue"
                nextDisabled={!name.trim()}
              />
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="mb-3 text-[clamp(28px,6.5vw,38px)] font-semibold leading-[1.06] tracking-[-0.03em] text-text">
                Where is the work happening?
              </h1>
              <p className="mb-9 text-[17px] leading-relaxed text-text-muted">
                Connect the repository where this build actually lives. This is what gets checked when
                you submit for verification.
              </p>
              <Field label="REPOSITORY">
                <input
                  className="shpd-input"
                  placeholder="owner/repository"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                />
              </Field>
              <div className="mt-10">
                <Nav onBack={() => setStep(1)} onNext={() => setStep(3)} nextLabel="Continue" nextDisabled={!repo.trim()} />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="mb-3 text-[clamp(28px,6.5vw,38px)] font-semibold leading-[1.06] tracking-[-0.03em] text-text">
                Who&apos;s contributing?
              </h1>
              <p className="mb-8 text-[17px] leading-relaxed text-text-muted">
                This becomes part of the record. It shows how much of the work was you, an agent, or a
                team.
              </p>
              <div className="mb-9 flex flex-col gap-3">
                <ChoiceRow label="Just me" selected={choice === "just-me"} onSelect={() => setChoice("just-me")} />
                <ChoiceRow label="Me and AI agents" selected={choice === "agents"} onSelect={() => setChoice("agents")} />
                <ChoiceRow label="A team" selected={choice === "team"} onSelect={() => setChoice("team")}>
                  {choice === "team" && (
                    <input
                      className="shpd-input mt-4"
                      placeholder="@username"
                      value={teamHandle}
                      onChange={(e) => setTeamHandle(e.target.value)}
                    />
                  )}
                </ChoiceRow>
              </div>

              {error && (
                <p className="mb-5 rounded border border-[var(--danger-border)] bg-[rgba(229,103,94,0.08)] px-3 py-2 font-mono text-xs text-danger">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between gap-4">
                <button type="button" onClick={() => setStep(2)} disabled={pending} className="text-[15px] font-medium text-text-muted disabled:opacity-40">
                  Back
                </button>
                <button type="button" onClick={handleCreate} disabled={pending} className="shpd-btn">
                  {pending ? "Confirm in your wallet…" : "Create Build"}
                </button>
              </div>
              {pending && (
                <p className="mt-4 font-mono text-[11px] leading-relaxed text-text-faint">
                  Registering your build on Monad Testnet. Approve the transaction in your wallet.
                </p>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <span className="shpd-pill mb-7" style={{ borderColor: "var(--hair-strong)" }}>
                <span className="h-[7px] w-[7px] flex-none rounded-full bg-signal" />
                <span className="text-text">IN PROGRESS</span>
              </span>
              <h1 className="mb-4 text-[clamp(30px,7vw,40px)] font-semibold leading-[1.05] tracking-[-0.03em] text-text">
                Your build is now on Shipd.
              </h1>
              <p className="mb-9 text-[17px] leading-relaxed text-text-muted">
                Keep working as usual. When you&apos;re ready, come back and submit it for verification.
              </p>
              <div className="shpd-card mb-9 p-[22px]">
                <div className="mb-2 text-[17px] font-semibold tracking-tight text-text">{name || "Untitled build"}</div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px] text-text-muted">
                  <span>{repo}</span>
                  <span>Not yet submitted</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {buildId !== null && (
                  <Link href={`/build/${buildId.toString()}`} className="shpd-btn">
                    View Build
                  </Link>
                )}
                <Link href="/dashboard" className="shpd-btn-ghost">
                  Go to Dashboard
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function StepBar({ step }: { step: number }) {
  return (
    <div className="mb-10 flex h-0.5 gap-[5px]">
      {[1, 2, 3].map((n) => (
        <span key={n} className={`h-0.5 flex-1 rounded ${n <= step ? "bg-text" : "bg-track"}`} />
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2.5 block font-mono text-[12px] tracking-[0.06em] text-text">{label}</label>
      {children}
    </div>
  );
}

function Nav({
  backHref,
  backLabel = "Back",
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
}: {
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      {backHref ? (
        <Link href={backHref} className="text-[15px] font-medium text-text-muted">
          {backLabel}
        </Link>
      ) : (
        <button type="button" onClick={onBack} className="text-[15px] font-medium text-text-muted">
          {backLabel}
        </button>
      )}
      <button type="button" onClick={onNext} disabled={nextDisabled} className="shpd-btn disabled:opacity-40">
        {nextLabel}
      </button>
    </div>
  );
}

function ChoiceRow({
  label,
  selected,
  onSelect,
  children,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-[10px] border bg-surface p-[18px] transition-colors"
      style={{ borderColor: selected ? "rgba(243,243,238,0.4)" : "var(--hair)" }}
    >
      <button type="button" onClick={onSelect} className="flex w-full items-center gap-3.5 text-left">
        <span
          className="h-[18px] w-[18px] flex-none rounded-full border-2"
          style={{
            borderColor: selected ? "var(--signal)" : "rgba(243,243,238,0.3)",
            background: selected ? "var(--signal)" : "transparent",
          }}
        />
        <span className="text-[16px] font-medium text-text">{label}</span>
      </button>
      {children}
    </div>
  );
}
