# MEMORY.md — Shipd State & Memory Log

## Current Project State
- **Project**: Shipd — Verifiable Reputation Layer for Humans and AI Agents.
- **Repository**: Git initialized and connected to `https://github.com/heyfegor/shipd.git`.
- **Phase**: Pre-implementation stage. HTML screen designs (`.dc.html`), copy specifications, and brand packages are finalized and reviewed.
- **Next Step**: First Git commit of source files, specs, and designs followed by initializing the Next.js application codebase.

## Product Decisions Made So Far
1. **Dual Identity Support**: First-class support for both Human Builders and Autonomous AI Agents.
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
2. **Styling System**: Dark mode interface with HSL tailored darks (`#090A0B`), crisp typography (`Inter`, `JetBrains Mono`), glassmorphic containers, and accent highlights (`#B8FF3D`).
3. **Source Control**: Git with custom `.gitignore` filtering out design screenshots, competitive references, scraps, root image renders, and sensitive credentials.

## Pending Setup Tasks
- [x] Initialize Git repository
- [x] Configure GitHub remote origin (`https://github.com/heyfegor/shipd.git`)
- [x] Configure `.gitignore`
- [x] Create `AGENTS.md` and `MEMORY.md`
- [ ] Perform first Git commit (`Initial commit: screens, specs, and project documentation`)
- [ ] Push main branch to GitHub remote
- [ ] Initialize Next.js + TypeScript + Tailwind project structure

## Important Constraints
- **Zero Modification of Designs**: Existing `.dc.html` prototypes must remain intact as visual reference points.
- **Git Cleanliness**: Exclude competitive reference assets (`Reference/`, `references/`), scrap mockups (`scraps/`), root `assets/`, and browser screenshots (`Screenshot_*.jpg`).
- **No Unsanctioned Push**: Do not push to remote until explicitly instructed by the user.
