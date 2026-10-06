"use client";

import Link from "next/link";

import { AppHeader } from "@/components/layout/app-header";
import { ConnectGate } from "@/components/ui/connect-gate";
import { useShipdAuth } from "@/lib/auth";
import { useShipdWallet } from "@/hooks/use-shipd-wallet";
import { useProfile, type ProfileBuild } from "@/hooks/use-profile";
import { humanizeReason, reasonFromBytes32 } from "@/lib/reputation/policy";

export default function DashboardPage() {
  return (
    <ConnectGate>
      <AppHeader />
      <Dashboard />
    </ConnectGate>
  );
}

function Dashboard() {
  const { identity } = useShipdAuth();
  const { address, ready: walletReady } = useShipdWallet();
  const profile = useProfile(address);

  const handle = identity?.email?.split("@")[0] ?? identity?.wallet?.slice(0, 8) ?? "you";
  const name = identity?.email?.split("@")[0] ?? "Your identity";

  if (walletReady && !address) {
    return (
      <Centered>
        <p>Setting up your wallet… if this persists, enable Embedded Wallets in your Privy dashboard.</p>
      </Centered>
    );
  }

  const active = profile.builds.filter((b) => !b.verified);
  const verified = profile.builds.filter((b) => b.verified);

  return (
    <main className="mx-auto max-w-[940px] px-4 pb-20 pt-[clamp(24px,4vw,40px)] sm:px-8">
      {/* IDENTITY + REPUTATION */}
      <section className="shpd-card mb-4 overflow-hidden">
        <div className="flex flex-wrap items-center gap-5 border-b border-[var(--hair)] px-6 py-6">
          <span className="inline-flex h-14 w-14 flex-none items-center justify-center rounded-full border border-[var(--hair-strong)] bg-background font-mono text-[22px] text-text">
            {name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[20px] font-semibold tracking-tight text-text">{name}</div>
            <div className="mt-0.5 font-mono text-[13px] text-text-muted">@{handle}</div>
            {address && <div className="mt-1 font-mono text-[12px] text-text-faint">{address}</div>}
          </div>
          <Link href="/reputation" className="whitespace-nowrap rounded-md border border-[var(--hair-strong)] px-3.5 py-2.5 font-mono text-[12px] tracking-[0.06em] text-text">
            Reputation →
          </Link>
        </div>
        <div className="flex flex-wrap items-end gap-x-7 gap-y-4 px-6 py-[22px]">
          <div className="flex items-end gap-4">
            <div className="text-[52px] font-semibold leading-[0.9] tracking-[-0.03em] text-text">
              {profile.loading ? "—" : profile.score}
            </div>
            <div className="pb-1">
              <div className="shpd-label">Reputation</div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="h-[7px] w-[7px] flex-none rounded-full bg-signal" />
                <span className="font-mono text-[12.5px] tracking-[0.04em] text-text">{profile.status}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEXT STEP / EMPTY */}
      {!profile.loading && profile.builds.length === 0 ? (
        <section className="mb-9">
          <div className="shpd-card p-[clamp(22px,3vw,30px)]">
            <h2 className="mb-3 text-[clamp(21px,3vw,26px)] font-semibold tracking-tight text-text">
              Start with no reputation. That&apos;s intentional.
            </h2>
            <p className="mb-6 max-w-[56ch] text-[16px] leading-relaxed text-text-muted">
              Your reputation is earned through work you actually ship and have verified. Start a
              build to create your first Work Receipt.
            </p>
            <Link href="/build/new" className="shpd-btn">Start a build</Link>
          </div>
        </section>
      ) : (
        <section className="mb-9">
          <div className="shpd-label mb-3">Your next step</div>
          <div className="shpd-card p-[clamp(22px,3vw,30px)]">
            <h2 className="mb-3 text-[clamp(21px,3vw,26px)] font-semibold tracking-tight text-text">
              {active.length > 0 ? "You have work to verify" : "Keep shipping"}
            </h2>
            <p className="mb-6 max-w-[56ch] text-[16px] leading-relaxed text-text-muted">
              {active.length > 0
                ? "Submit an in-progress build for verification to turn it into a Work Receipt."
                : "Every verified build adds another piece of evidence to your record."}
            </p>
            <Link href="/build/new" className="shpd-btn">Start a build</Link>
          </div>
        </section>
      )}

      {/* ACTIVE WORK */}
      {active.length > 0 && (
        <Section label="Active Work">
          <div className="shpd-card overflow-hidden">
            {active.map((b, i) => (
              <BuildRow key={b.build.buildId.toString()} b={b} first={i === 0} />
            ))}
          </div>
        </Section>
      )}

      {/* VERIFIED WORK */}
      {verified.length > 0 && (
        <Section label="Recent Verified Work">
          <div className="shpd-card overflow-hidden">
            {verified.map((b, i) => (
              <BuildRow key={b.build.buildId.toString()} b={b} first={i === 0} />
            ))}
          </div>
        </Section>
      )}

      {/* REPUTATION ACTIVITY */}
      {profile.events.length > 0 && (
        <Section label="Reputation Activity">
          <div className="shpd-card overflow-hidden">
            {[...profile.events].reverse().map((e, i) => {
              const positive = Number(e.value) >= 0;
              return (
                <div
                  key={e.eventId.toString()}
                  className="flex items-center gap-4 px-6 py-4"
                  style={{ borderTop: i === 0 ? undefined : "1px solid var(--hair-soft)" }}
                >
                  <span className={`w-11 flex-none font-mono text-[14px] font-semibold ${positive ? "text-signal" : "text-text-muted"}`}>
                    {positive ? "+" : ""}
                    {Number(e.value)}
                  </span>
                  <div className="min-w-0 flex-1 text-[15px] text-text">{humanizeReason(reasonFromBytes32(e.eventType))}</div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {profile.error && (
        <p className="mt-6 font-mono text-xs text-danger">Could not load on-chain data: {profile.error}</p>
      )}
    </main>
  );
}

function BuildRow({ b, first }: { b: ProfileBuild; first: boolean }) {
  const name = b.meta?.name ?? `Build #${b.build.buildId}`;
  return (
    <Link
      href={`/build/${b.build.buildId.toString()}`}
      className="shpd-row flex flex-wrap items-center justify-between gap-x-5 gap-y-3.5 px-6 py-5"
      style={{ borderTop: first ? undefined : "1px solid var(--hair-soft)" }}
    >
      <div className="min-w-0">
        <div className="mb-1.5 text-[16px] font-semibold tracking-tight text-text">{name}</div>
        <div className="flex items-center gap-2 font-mono text-[12px] text-text-muted">
          {b.verified ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-signal" /> Verified · {b.score}/100
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-text-muted" /> In progress
            </>
          )}
        </div>
      </div>
      <span className="whitespace-nowrap font-mono text-[12px] tracking-[0.04em] text-text">
        {b.verified ? "View Work Receipt →" : "Open build →"}
      </span>
    </Link>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-9">
      <div className="shpd-label mb-3">{label}</div>
      {children}
    </section>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex max-w-[940px] flex-1 items-center justify-center px-6 py-24 text-center font-mono text-sm text-text-muted">
      {children}
    </main>
  );
}
