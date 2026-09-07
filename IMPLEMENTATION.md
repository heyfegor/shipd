# Shipd — Implementation Guide

A build spec for turning the Shipd design prototypes into a functional product. Written for Claude Code (or any engineer) to implement against. The HTML files in this repo are the **source of truth for UI**: fields, hierarchy, copy, states, and visual language. This document describes the system that must sit behind them.

---

## 1. What Shipd is

Shipd is a **verifiable reputation layer for humans and AI agents**. Work is submitted, verified through automated + human checks, and — if it passes — turned into a permanent, publicly checkable **Work Receipt**. Reputation is earned only through verified work. Agents earn reputation the same way humans do, and are registered on-chain via **ERC-8004**.

The product's whole reason to exist is the Work Receipt: real, checkable evidence of what happened. Everything else (dashboard, challenges, reputation, agents) exists to produce, explain, or point at receipts.

### Core objects

| Object | Description |
|--------|-------------|
| **Identity** | A human or agent account. Created via passkey (humans) or ERC-8004 registration (agents). Owns a reputation score. |
| **Build** | A unit of work tied to a Git repository, with one or more contributors (human + agent). Moves through a lifecycle. |
| **Verification** | A run of checks against a submitted build. Produces a pass/fail result and a score. |
| **Work Receipt** | The immutable record produced by a passing verification. Publicly viewable, downloadable, on-chain referenced. |
| **Reputation event** | A single scored change to an identity's reputation, always caused by a verifiable event. |
| **Challenge** | An open brief a user can join; submitting a verified build to it is how work gets sourced. |
| **Agent** | A non-human identity with capabilities, an ERC-8004 reference, and its own reputation + work history. |

---

## 2. Build lifecycle (state machine)

This is the spine of the product. Build Management screens render each state.

```
draft ──▶ in_progress ──▶ submitted ──▶ verifying ──▶ verified
                                              │
                                              └──────▶ failed ──▶ (fix) ──▶ submitted …
```

| State | Meaning | UI |
|-------|---------|----|
| `in_progress` | Build exists, repo connected, contributors added, not yet submitted. | Build Detail → "Submit for Verification" CTA. |
| `submitted` | User confirmed submission; queued for checks. Repo is frozen at the submitted commit. | Transient; moves to `verifying`. |
| `verifying` | Checks are actively running. | Verification in Progress — live per-check status. |
| `verified` | All required checks passed. Work Receipt minted. | Verification Result (verified) + Work Receipt. |
| `failed` | One or more required checks failed. No receipt. | Verification Result (failed) with per-check reasons; can fix + resubmit. |

**Rules**
- A build's connected repo/commit is **immutable once `submitted`**. Resubmission after `failed` creates a new verification run against a new commit.
- A Work Receipt is minted **only** on `verified`. `failed` builds carry no public record.
- Reputation events fire on verification completion (see §5).

---

## 3. Verification engine

The Verification in Progress screen must show **real work happening**, not a fake progress bar. Each check is an independent job with its own state: `pending → running → complete(pass|fail)`.

### Required checks

| Check | What it does | Passing evidence to surface |
|-------|-------------|-----------------------------|
| **Tests** | Runs the repo's test suite in an isolated runner. | `N tests passed` / `M of N failed in <area>` |
| **Security** | Scans dependencies + code for known advisories, unpinned deps, secrets. | `No vulnerabilities found` / `<advisory> in <dep>` |
| **Code quality** | Static analysis; returns a 0–100 quality sub-score. | `No blocking issues` + numeric sub-score |
| **Contribution split** | Attributes commits/diff to each contributor (human vs agent). | `Ada 68% · codegen 32%` |
| **Human review** | Where required, routes to a reviewer for approval. | `Approved by @reviewer` |

### Implementation notes
- Model each check as an async job. Stream status to the client (SSE or WebSocket) — the UI subscribes and updates each row independently. The prototype fakes this with timers; replace with a real event stream.
- The overall **score (0–100)** is a weighted composite of check results. Define the weighting explicitly in config; surface the final integer on the receipt.
- A single required check failing → build `failed`. Non-required checks (e.g. human review when not required) don't block.
- Verification must be **reproducible**: store the commit SHA, runner image, check versions, and raw outputs so "View raw verification data" resolves to the actual artifacts.
- Do not animate progress for its own sake. A check shows `running` only while its job is genuinely in flight.

---

## 4. Work Receipt

The core deliverable. Must be a **real, checkable document**, not a badge.

### Fields (match `Work Receipt.dc.html` exactly)
- **Build** name
- **Contributors** split (human % / agent %) with the visual bar
- **Verification** results: Tests, Security, Code quality, Human review — each PASS/FAIL + evidence
- **Result**: score `/ 100` (verified) or "Not verified" (failed)
- **Verified badge**: `VERIFIED · <network>` + date
- **Receipt ID**: stable, e.g. `SHPD-7F3A-91C4`
- Footer actions: Copy link, View raw verification data, Download receipt

### Requirements
- Every receipt has a **public, shareable URL** (`/receipt/:id`) viewable with no account. Someone who has never used Shipd must understand what happened without explanation.
- **Download** produces a self-contained artifact (PDF or signed JSON+HTML). The prototype uses `window.print()`; wire this to a server-rendered PDF endpoint for fidelity and signing.
- Receipts are **immutable** once minted. Corrections require a new receipt that references the prior one.
- **On-chain reference**: anchor a hash of the receipt (and the verification data) on Monad so "View raw verification data" and the receipt can be independently checked. Store the tx reference on the receipt.
- Failed builds render the receipt shell in a "Not verified" variant with per-check failure reasons and **no** public record / no on-chain anchor.

---

## 5. Reputation

Reputation is an **audit trail**, not a game. Every change is caused by a verifiable event and is fully itemized (see `Reputation.dc.html`).

### Model
```
ReputationEvent {
  id
  identityId          // human or agent
  delta               // signed integer, e.g. +12, -2
  reason              // enum: build_verified | challenge_completed | verification_failed | peer_review | identity_created
  refId               // build / challenge / receipt this resolves to
  balanceAfter        // running total after this event
  createdAt
}
```
- Current score = sum of all deltas (or `balanceAfter` of the latest event). The number shown here **must equal** the score shown on the Dashboard and elsewhere — single source of truth.
- Status label (e.g. "Verified Builder") is derived from thresholds on the score. Define thresholds in config. **No levels, badges, or streaks** — status is a plain derived label.
- Every event links to its cause (a receipt, a challenge). The history is the point.
- Agents have their own independent reputation ledger, computed identically.

### Delta sources (examples)
| Reason | Trigger | Sign |
|--------|---------|------|
| `identity_created` | Account created | + (onboarding grant) |
| `build_verified` | Build reaches `verified` | + (scaled by score) |
| `challenge_completed` | Verified build submitted to a challenge | + |
| `peer_review` | Completing a review for others | + (small) |
| `verification_failed` | Build reaches `failed` | − (small) |

Weighting is policy — keep it in one config module so it can be tuned without touching UI.

---

## 6. Agents

An agent is a first-class identity with a **résumé of verified work**, not a managed device.

### Fields (match `Agents.dc.html`)
- Agent ID (`Shipd Agent #1842`), type (`Coding agent`), handle (`@codegen`)
- Activity status: `active` / `available` / `idle`
- Reputation score, verified task count, success rate
- **ERC-8004 reference**: registry ID, network, registration date, on-chain link
- Capabilities (e.g. Solidity, TypeScript, React, Monad)
- Work history — each entry links to its Work Receipt

### Notes
- Register agents on-chain via **ERC-8004**; the registry ID is the canonical identifier. "View on-chain record" resolves to the registry entry.
- Success rate = verified tasks / total submitted tasks. Reputation computed via the same engine as humans (§5).
- Agents appear as contributors in Build Flow; the contribution-split check attributes work to them, and their share flows into their own work history + reputation.
- No anthropomorphizing — status and capabilities only.

---

## 7. Challenges

A **worklist**, not a marketplace. Three sections (see `Challenges.dc.html`): Open, Joined, Submitted Work.

```
Challenge {
  id, title, description, deadline (date), status
  submissions: [ { buildId, identityId, receiptId? } ]
}
```
- Sort/separate strictly by the user's relationship to each challenge: open (joinable) → joined (working) → submitted (shipped).
- Deadline is a **plain date** ("Ends in 4 days"). No countdown gimmicks, no urgency banners.
- Joining a challenge creates (or links) a build. Submitting that build to verification, and passing, moves it to Submitted Work with its receipt.
- Empty state when a user has no open/joined challenges: point them to start a build.

---

## 8. Screen → route map

| Screen (prototype file) | Route | Backing data |
|-------------------------|-------|--------------|
| `landing/Landing Page.dc.html` | `/` | static + sample receipt |
| `onboarding screens/*` | `/onboarding` | passkey / identity creation |
| `Dashboard/dashboard-active.dc.html` | `/dashboard` | identity, reputation, builds, agents |
| `Dashboard/dashboard-empty.dc.html` | `/dashboard` (new user) | empty states |
| `Build Flow/01…04` | `/build/new` | build creation, repo connect, contributors |
| `Build Management/01-build-detail` | `/build/:id` | build + verification state |
| `Build Management/02-submit-for-verification` | `/build/:id/submit` | pre-submit confirmation |
| `Build Management/03-verification-in-progress` | `/build/:id/verifying` | live check stream |
| `Build Management/04-verification-result` | `/build/:id/result` | result (verified/failed) |
| `Work Receipt.dc.html` | `/receipt/:id` | **public**, no auth |
| `Reputation.dc.html` | `/reputation/:handle` | reputation ledger |
| `Challenges.dc.html` | `/challenges` | challenge lists |
| `Agents.dc.html` | `/agents`, `/agents/:id` | agent list + detail |

---

## 9. Suggested backend shape

- **Auth**: passkeys (WebAuthn) for humans; ERC-8004 registration for agents. Sessions scoped to an identity.
- **Data**: Postgres for identities, builds, verifications, reputation events, challenges. Object storage for raw verification artifacts.
- **Verification workers**: queue-backed job runners (one job per check) in isolated containers. Emit events to a stream the client subscribes to.
- **Realtime**: SSE or WebSocket channel per verification run → drives the in-progress screen.
- **Chain**: Monad for on-chain receipt anchoring + ERC-8004 agent registry. Store tx refs alongside records; never block UI on chain latency (anchor async, show "pending" then confirmed).
- **Receipts**: server-rendered PDF/HTML endpoint, content-hashed, hash anchored on-chain.

### API sketch
```
POST   /builds                      create build
POST   /builds/:id/repo             connect repo
POST   /builds/:id/contributors     add human/agent
POST   /builds/:id/submit           freeze commit, enqueue verification
GET    /builds/:id                  build + current state
GET    /verifications/:id/stream    SSE: per-check status
GET    /receipts/:id                public receipt (JSON)
GET    /receipts/:id/download       PDF
GET    /identities/:handle/reputation   ledger + score
GET    /agents  /  /agents/:id      agent list + profile
GET    /challenges                  open/joined/submitted for current user
POST   /challenges/:id/join         join
```

---

## 10. Non-negotiables (design + product)

Pulled from the brand and rejection lists — enforce these in implementation:

- **Lime `#B8FF3D` only for verified / pass / positive states.** Never decorative.
- **No fake progress.** A check shows `running` only while genuinely working.
- **Evidence over celebration.** No congratulatory copy, confetti, badges, levels, or streaks. The result speaks for itself.
- **One score, everywhere.** Dashboard, Reputation, profiles all read the same number from one source.
- **Receipts are public and checkable** without an account, and immutable once minted.
- **Failed builds carry no public record** and no on-chain anchor.
- **Copy is fixed.** Use the strings in the prototype and the `*-copy.md` files verbatim; do not rewrite.
- Colors: Obsidian `#090A0B` background, Carbon `#131517` surface, off-white `#F3F3EE` text, `#8B9095` secondary, Inter for UI, JetBrains Mono for IDs/metadata/status.
