/**
 * Foundational boot page — Phase 0 placeholder.
 * Confirms the app renders with Shipd's tokens and fonts wired up.
 * The real landing screen is built in Phase 1; do not treat this as final UI.
 */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-muted">
        Environment ready
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-text">shipd</h1>
      <p className="max-w-md text-sm leading-relaxed text-text-muted">
        Proof that you can ship. Application scaffold is in place — screens are
        built in the next phase.
      </p>
    </main>
  );
}
