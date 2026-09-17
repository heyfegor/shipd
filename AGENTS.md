# AGENTS.md — Shipd Project Guidelines

## Project Purpose
**Shipd** is a verifiable reputation layer for humans and AI agents. It enables builders, contributors, and autonomous AI agents to build, verify, and display their proof of work, reputation score, and verified project contributions.

## Current Project Status
- **Phase**: Design & Specification Complete — Implementation pending.
- **State**: Screen prototypes (`.dc.html`), copy specifications, and brand assets are established. Web application codebase implementation has not started yet.

## Tech Stack & Architecture Direction
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Design Language**: Dark mode aesthetic with flat, restrained, high-contrast surfaces (no glassmorphism, no gradients, no decorative effects — see `docs/brand/rejection-list.md`). Sleek typography (Inter, JetBrains Mono). Signal lime (`#B8FF3D`) is reserved strictly for verified/pass/positive states, never decoration.

## Current Product Screens & Inventory
1. **Landing Page** (`landing/Landing Page.dc.html`): Hero, features, proof of work overview, and onboarding trigger.
2. **Onboarding Flow** (`onboarding screens/`): Human-only, passkey-based (WebAuthn). Onboarding does **not** offer a Human/AI selection.
   - `01-welcome.dc.html`: Welcome screen & value proposition.
   - `02-create-identity.dc.html`: Human identity creation secured with a passkey (no password, credentials stay on-device).
   - `03-set-up-profile.dc.html`: Profile setup.
   - `04-identity-created.dc.html`: Onboarding confirmation screen.

   > **AI agents are not created through this onboarding flow.** Agents are first-class identities with their own reputation, registered separately (ERC-8004) and *connected to work* during the Build Flow. See `IMPLEMENTATION.md §6`.
3. **Dashboard** (`Dashboard/`):
   - `dashboard-active.dc.html`: Main dashboard with active builds, stats, and activity.
   - `dashboard-empty.dc.html`: Empty state view for new users.
4. **Build Flow** (`Build Flow/`):
   - `01-start-a-build.dc.html`: Step 1: Initialize build repository/project.
   - `02-connect-work.dc.html`: Step 2: Link GitHub repository or agent work receipts.
   - `03-add-contributors.dc.html`: Step 3: Add human and agent contributors.
   - `04-build-created.dc.html`: Step 4: Build creation confirmation.
5. **Build Management** (`Build Management/`):
   - `01-build-detail.dc.html`: Build management view, proof of work logs, and contributor breakdown.
   - `02-submit-for-verification.dc.html`: Verification submission modal/screen.
   - `03-verification-in-progress.dc.html`: Real-time verification status view.
   - `04-verification-result.dc.html`: Verification pass/fail output and badge issue screen.
6. **Agents** (`Agents.dc.html`): Connected AI agents, agent reputation scores, and activity logs (List, Detail, Empty states).
7. **Challenges & Bounties** (`Challenges.dc.html`): Open work bounties and verification challenges.
8. **Reputation** (`Reputation.dc.html`): Verifiable reputation score, proof badges, and trust graph.
9. **Work Receipt** (`Work Receipt.dc.html`): Cryptographic proof of work receipt detail view.

## Core Engineering Rules
1. **Preserve Existing Designs**: Do not alter, redesign, or delete existing `.dc.html` screens or layout structures without explicit instruction.
2. **Strict Fidelity**: Implement frontend views with 1:1 visual fidelity to the provided `.dc.html` designs and copy specifications.
3. **Modular Architecture**: Keep UI components decoupled, reusable, and type-safe using Next.js + TypeScript + Tailwind.
4. **MVP Functionality First**: Prioritize core working MVP user flows (Onboarding -> Dashboard -> Build Flow -> Verification -> Reputation & Agents) over premature optimizations.

## Directory Structure Overview
- 📂 `landing/` — Landing page `.dc.html` screen and assets.
- 📂 `onboarding screens/` & `onboarding screen copy/` — Onboarding screens and markdown copy specs.
- 📂 `Dashboard/` — Active and empty state dashboard screens.
- 📂 `Build Flow/` — Build creation flow screens (4 steps).
- 📂 `Build Management/` — Build detail and verification screens (4 steps).
- 📂 `docs/` & `uploads/brand/` — Brand guidelines, copy voice, rejection list, and visual system docs.
- 📂 `uploads/shipd-brand-package/` — Brand guide PDF, logomark, and wordmark.
- 📄 `Agents.dc.html`, `Challenges.dc.html`, `Reputation.dc.html`, `Work Receipt.dc.html` — Core feature screen HTML files.
- 📄 `IMPLEMENTATION.md`, `shipd.md`, `Shipd_ Verifiable Reputation Layer.PDF` — Product strategy and technical specification documents.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
