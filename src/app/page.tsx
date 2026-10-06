"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useShipdAuth } from "@/lib/auth";

const PROOFS = [
  { label: "THE BUILD", body: "A record of what was actually shipped, not a description of it." },
  { label: "CONTRIBUTION SPLIT", body: "How much of the work was the human and how much was the agent." },
  { label: "VERIFICATION", body: "Whether it passed tests, security checks, and human review." },
  { label: "FINAL SCORE", body: "One number that reflects the verified result of the work." },
];

/**
 * Landing page (public). Sticky top bar (wordmark + hamburger menu), hero, what
 * a Work Receipt proves, and a sample receipt — with a sign-in CTA that routes
 * to the dashboard once authenticated.
 */
export default function Landing() {
  const { ready, authenticated, login } = useShipdAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (ready && authenticated) router.replace("/dashboard");
  }, [ready, authenticated, router]);

  return (
    <main id="top" className="flex-1">
      {/* TOP BAR */}
      <header className="sticky top-0 z-50 border-b border-[var(--hair-soft)] bg-[rgba(9,10,11,0.82)] backdrop-blur-md">
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-4 sm:px-10">
          <a href="#top" className="text-[20px] font-semibold tracking-[-0.02em] text-text">
            shipd
          </a>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 flex-col justify-center gap-[5px] p-[9px]"
          >
            <span className="block h-0.5 w-full bg-text" />
            <span className="block h-0.5 w-full bg-text" />
            <span className="block h-0.5 w-full bg-text" />
          </button>
        </nav>
        {menuOpen && (
          <div className="mx-auto flex max-w-[1200px] flex-col px-5 pb-7 pt-2 sm:px-10">
            <a
              href="#proof"
              onClick={() => setMenuOpen(false)}
              className="border-t border-[var(--hair-soft)] py-4 font-mono text-[14px] uppercase tracking-[0.08em] text-text"
            >
              What a receipt proves
            </a>
            <a
              href="#receipt"
              onClick={() => setMenuOpen(false)}
              className="border-t border-[var(--hair-soft)] py-4 font-mono text-[14px] uppercase tracking-[0.08em] text-text"
            >
              Work Receipt
            </a>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                login();
              }}
              disabled={!ready}
              className="shpd-btn mt-[18px]"
            >
              Create your profile
            </button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-[940px] px-4 pb-10 pt-20 sm:px-8 sm:pt-28">
        <h1 className="max-w-[18ch] text-[clamp(38px,6.4vw,74px)] font-semibold leading-[1.02] tracking-[-0.03em] text-text">
          Anyone can ship fast now. Almost nobody can prove it was them.
        </h1>
        <p className="mt-7 max-w-[60ch] text-[clamp(17px,2vw,20px)] leading-relaxed text-text-muted">
          AI makes producing work easier. It does not make your work easier to trust. Shipd records
          what you shipped, how it was verified, and the reputation you earn from it.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <button type="button" onClick={login} disabled={!ready} className="shpd-btn">
            Start building your proof
          </button>
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-faint">
            Passkey · Verified on Monad
          </span>
        </div>
      </section>

      {/* WHAT A RECEIPT PROVES */}
      <section id="proof" className="mx-auto max-w-[940px] scroll-mt-20 border-t border-[var(--hair-soft)] px-4 py-16 sm:px-8">
        <div className="shpd-label mb-10">What a Work Receipt proves</div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-[var(--hair)] bg-[var(--hair)] sm:grid-cols-2">
          {PROOFS.map((p) => (
            <div key={p.label} className="bg-surface p-7">
              <div className="font-mono text-[11px] tracking-[0.1em] text-signal">{p.label}</div>
              <p className="mt-3 text-[17px] leading-relaxed text-text">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SAMPLE RECEIPT */}
      <section id="receipt" className="mx-auto max-w-[940px] scroll-mt-20 px-4 pb-24 sm:px-8">
        <div className="mx-auto max-w-[520px]">
          <div className="shpd-card overflow-hidden" style={{ borderColor: "var(--signal-border)" }}>
            <div className="flex items-center justify-between gap-3 border-b border-[var(--hair)] px-6 py-[18px]">
              <span className="font-mono text-[12px] tracking-[0.12em] text-text">SHIPD WORK RECEIPT</span>
              <span className="shpd-pill" style={{ borderColor: "rgba(184,255,61,0.4)" }}>
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-signal" />
                <span className="text-signal">VERIFIED</span>
              </span>
            </div>
            <div className="px-6 pb-7 pt-6">
              <div className="shpd-label mb-2.5">Build</div>
              <div className="mb-6 text-[20px] font-semibold tracking-tight text-text">Monad Payment Router</div>
              <div className="flex items-end justify-between gap-4 border-t border-[var(--hair)] pt-5">
                <div>
                  <div className="shpd-label mb-2">Result</div>
                  <div className="text-[44px] font-semibold leading-none tracking-tight text-signal">
                    94<span className="text-[20px] font-medium text-text-muted"> / 100</span>
                  </div>
                </div>
                <div className="shpd-pill" style={{ borderColor: "rgba(184,255,61,0.4)" }}>
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-signal" />
                  <span className="text-signal">VERIFIED · MONAD</span>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-center text-sm leading-relaxed text-text-muted">
            This is not a mockup. It is the same receipt you get when your work is verified. Every
            field traces back to the work that produced it.
          </p>
        </div>
      </section>

      <footer className="border-t border-[var(--hair-soft)]">
        <div className="mx-auto flex max-w-[940px] items-center justify-between px-4 py-8 sm:px-8">
          <Link href="#top" className="text-[17px] font-semibold tracking-tight text-text">
            shipd
          </Link>
          <span className="font-mono text-xs text-text-faint">Proof that you can ship.</span>
        </div>
      </footer>
    </main>
  );
}
