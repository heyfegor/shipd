# MEMORY.md — Shipd State & Memory Log

## Current Project State
- **Project**: Shipd — Verifiable Reputation Layer for Humans and AI Agents.
- **Repository**: Git initialized and connected to `https://github.com/heyfegor/shipd.git`.
- **Phase**: Pre-implementation stage. HTML screen designs (`.dc.html`), copy specifications, and brand packages are finalized and reviewed.
- **Next Step**: First Git commit of source files, specs, and designs followed by initializing the Next.js application codebase.

## Product Decisions Made So Far
1. **Dual Identity Support**: First-class support for both Human Builders and Autonomous AI Agents. Humans onboard via a passkey-based flow (no Human/AI selection in onboarding). AI agents are registered separately (ERC-8004) as their own first-class identities with independent reputation, and are connected to work during the Build Flow — not created through human onboarding.
2. **Verifiable Proof of Work**: Reputation is earned strictly through verified build activity and cryptographic work receipts.
3. **Core Product Flows**:
   - Onboarding (Welcome -> Create Identity -> Set Up Profile -> Identity Created)
   - Dashboard (Active vs Empty states)
   - Build Initialization (Start Build -> Connect Work -> Add Contributors -> Build Created)
   - Verification Pipeline (Build Detail -> Submit -> In Progress -> Result)
   - Reputation & Agent Roster (Agents, Reputation Score, Challenges, Work Receipts)

## Screen Inventory
- **Landing Page**: `landing/Landing Page.dc.html`
- **Onboarding Flow**: `onboarding screens/01-welcome.dc.html` through `04-identity-created.dc.html`
- **Dashboard**: `Dashboard/dashboard-active.dc.html`, `dashboard-empty.dc.html`
- **Build Flow**: `Build Flow/01-start-a-build.dc.html` through `04-build-created.dc.html`
- **Build Management**: `Build Management/01-build-detail.dc.html` through `04-verification-result.dc.html`
- **Core App Views**: `Agents.dc.html`, `Challenges.dc.html`, `Reputation.dc.html`, `Work Receipt.dc.html`

## Technical Decisions
1. **Framework & Stack**: Next.js (App Router), TypeScript, and Tailwind CSS.
2. **Styling System**: Dark mode interface with flat, restrained, high-contrast surfaces — Obsidian background (`#090A0B`), Carbon surfaces (`#131517`). No glassmorphism, gradients, or decorative effects (per `docs/brand/rejection-list.md`). Crisp typography (`Inter`, `JetBrains Mono`). Signal lime (`#B8FF3D`) is used strictly for verified/pass/positive states, not decoration.
3. **Source Control**: Git with custom `.gitignore` filtering out design screenshots, competitive references, scraps, root image renders, and sensitive credentials.

## Pending Setup Tasks
- [x] Initialize Git repository
- [x] Configure GitHub remote origin (`https://github.com/heyfegor/shipd.git`)
- [x] Configure `.gitignore`
- [x] Create `AGENTS.md` and `MEMORY.md`
- [x] Create GitHub repository
- [x] Push relevant project files to GitHub
- [x] Initialize Next.js (App Router) + TypeScript + Tailwind foundation
- [x] Select Supabase as provider and verify connection
- [x] Establish Privy source implementation
- [ ] Commit the current Next.js/Supabase/Privy foundation
- [ ] Complete Privy dependency installation and runtime verification
- [ ] Set up Foundry
- [ ] Configure Monad testnet/mainnet
- [ ] Finalize environment variable structure
- [ ] Inventory all 18 screens and their routes
- [ ] Produce final architecture diagram

## Important Constraints
- **Zero Modification of Designs**: Existing `.dc.html` prototypes must remain intact as visual reference points.
- **Git Cleanliness**: Exclude competitive reference assets (`Reference/`, `references/`), scrap mockups (`scraps/`), root `assets/`, and browser screenshots (`Screenshot_*.jpg`).
- **No Unsanctioned Push**: Do not push to remote until explicitly instructed by the user.
