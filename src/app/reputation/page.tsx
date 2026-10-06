"use client";

import Link from "next/link";

import { ConnectGate } from "@/components/ui/connect-gate";
import { useShipdAuth } from "@/lib/auth";
import { useShipdWallet } from "@/hooks/use-shipd-wallet";
import { useProfile } from "@/hooks/use-profile";
import { humanizeReason, reasonFromBytes32 } from "@/lib/reputation/policy";

export default function ReputationPage() {
  return (
    <ConnectGate>
      <header className="flex items-center gap-4 border-b border-[var(--hair-soft)] px-4 py-5 sm:px-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.06em] text-text-muted transition-colors hover:text-text">
          ← Dashboard
        </Link>
      </header>
      <Reputation />
    </ConnectGate>
  );
}

function Reputation() {
  const { identity } = useShipdAuth();
  const { address } = useShipdWallet();
  const profile = useProfile(address);

  const handle = identity?.email?.split("@")[0] ?? identity?.wallet?.slice(0, 8) ?? "you";
  const name = identity?.email?.split("@")[0] ?? "Your identity";
  const verifiedWork = profile.builds.filter((b) => b.verified);

  return (
    <main className="flex justify-center px-4 pb-24 pt-[clamp(28px,5vw,56px)] sm:px-8">
      <div className="w-full max-w-[600px]">
        {/* IDENTITY */}
        <div className="mb-8 flex items-center gap-3.5">
          <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-full border border-[var(--hair-strong)] bg-surface font-mono text-[17px] text-text">
            {name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="text-[16px] font-semibold tracking-tight text-text">{name}</div>
            <div className="mt-0.5 font-mono text-[12.5px] text-text-muted">@{handle}</div>
          </div>
        </div>

        {/* SCORE */}
        <div className="shpd-card mb-8 overflow-hidden">
          <div className="flex flex-wrap items-end justify-between gap-4 px-6 pb-[22px] pt-6">
            <div className="flex items-end gap-4">
              <div className="text-[clamp(52px,12vw,64px)] font-semibold leading-[0.85] tracking-[-0.03em] text-text">
                {profile.loading ? "—" : profile.score}
              </div>
              <div className="pb-1.5">
                <div className="shpd-label">Reputation</div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="h-[7px] w-[7px] flex-none rounded-full bg-signal" />
                  <span className="font-mono text-[12.5px] tracking-[0.04em] text-text">{profile.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HISTORY */}
        <div className="shpd-label mb-3">History</div>
        <div className="shpd-card mb-3.5 overflow-hidden">
          {profile.events.length === 0 ? (
            <p className="px-6 py-6 text-[14px] leading-relaxed text-text-muted">
              Your history builds as you ship and verify work. Every change to your score is recorded
              here.
            </p>
          ) : (
            [...profile.events].reverse().map((e, i) => {
              const v = Number(e.value);
              const positive = v >= 0;
              return (
                <div
                  key={e.eventId.toString()}
                  className="shpd-row flex items-start gap-3.5 px-6 py-4"
                  style={{ borderTop: i === 0 ? undefined : "1px solid var(--hair-soft)" }}
                >
                  <span className={`mt-[5px] h-[9px] w-[9px] flex-none rounded-full ${positive ? "bg-signal" : "bg-text-muted"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[14.5px] font-medium tracking-tight text-text">
                      {humanizeReason(reasonFromBytes32(e.eventType))}
                    </div>
                    <div className="mt-0.5 font-mono text-[12px] text-text-muted">
                      Receipt #{e.receiptId.toString()}
                    </div>
                  </div>
                  <div className={`whitespace-nowrap font-mono text-[14.5px] font-semibold ${positive ? "text-signal" : "text-text-muted"}`}>
                    {positive ? "+" : ""}
                    {v}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* VERIFIED WORK BACKING SCORE */}
        {verifiedWork.length > 0 && (
          <>
            <div className="shpd-label mb-3 mt-[34px]">Verified Work Backing This Score</div>
            <div className="shpd-card overflow-hidden">
              {verifiedWork.map((b, i) => (
                <Link
                  key={b.build.buildId.toString()}
                  href={`/build/${b.build.buildId.toString()}`}
                  className="shpd-row flex items-center gap-3.5 px-6 py-4"
                  style={{ borderTop: i === 0 ? undefined : "1px solid var(--hair-soft)" }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-semibold tracking-tight text-text">{b.meta?.name ?? `Build #${b.build.buildId}`}</div>
                    <div className="mt-0.5 font-mono text-[12px] text-text-muted">{b.meta?.repo}</div>
                  </div>
                  <span className="inline-flex flex-none items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                    <span className="font-mono text-[13px] text-signal">{b.score}</span>
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
