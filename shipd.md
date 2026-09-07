05 — Dashboard: Empty State

Purpose: First screen after onboarding. No history yet.
Contains:
• Identity + Reputation (reputation: 0)
• Your Next Step (new-user copy: "You haven't proved anything yet")
• No Recent Verified Work, no Active Work, no Reputation Activity — these sections are absent, not shown empty
• Hamburger menu to easily access the other screens.
• CTA → Start a Build (primary, prominent)
Header (both states): greeting, quick actions, notifications

06 — Dashboard: Active State

Purpose: Full dashboard once the user has history.

Contains, in order:
a. Identity + Reputation (avatar, name, @username, role, score, status, change, profile link)
b. Your Next Step (dynamic copy depending on state: in-progress / returning user)
c. Recent Verified Work (max 3 items, each with build name, date, result, reputation earned, link to receipt)
d. Active Work (current builds in progress or verification)
e. Reputation Activity (event feed: what changed, when)
d. Also has Hamburger menu to access the rest screens.

Header (both states): greeting, quick actions, notifications
CTA → Start a Build always available in both states.

Note: these two are states of the same screen, not separate destinations. Worth keeping in one folder so whoever builds this sees both conditions side by side, but they should probably share one component spec rather than be designed as two unrelated screens.

FOLDER: Build Flow (4 screens — sequential steps)

07 — Start a Build
Purpose: Capture the minimum to create a Build Record.

• Contains: Headline "What are you building?", build name field, short description field.

• CTA → Continue (to Connect Work)

08 — Connect Work

Purpose: Attach evidence source.

• Contains: Headline "Where is the work happening?", GitHub repository connect/select (MVP scope — only source for now).
• CTA → Continue (to Add Contributors)

09 — Add Contributors

Purpose: Establish who/what is working on this build.

• Contains: Headline "Who's contributing?", options — Just me / Me and AI agents / A team. If agent selected, agent connect/select step appears inline.

• CTA → Create Build

10 — Build Created

Purpose: Success state, confirms the Build Record exists.

• Contains: Confirmation copy ("Your build is now on Shipd. Keep working as usual."), status badge (In Progress).
• CTA → View Build (primary), Go to Dashboard (secondary)

FOLDER: Build Management (4 screens — sequential states of one build)

11 — Build Detail

Purpose: Single build's full overview, the hub for everything about one build.

• Contains: Build info, status, contributors, verification progress, link to Work Receipt (once it exists).
• CTA → Submit for Verification (when ready)

12 — Submit for Verification

Purpose: Confirm the work is ready to be checked.

• Contains: Summary of what will be verified (tests, security, code quality, contribution split, human review where required), confirmation action.
• CTA → Submit (moves build to Verifying)

13 — Verification in Progress

Purpose: Show the checks actually happening, live.

• Contains: Build name, status label ("Verifying"), checklist with per-check state (Tests complete / Security check in progress / Contribution analysis pending, etc).
• No CTA needed — this is a waiting/status screen, may auto-advance.

14 — Verification Result

Purpose: The outcome of verification.

• Contains: Verified (score, leads directly to Work Receipt) or Verification Failed (what failed, what to do next — retry, fix, resubmit).
• CTA → View Work Receipt (if verified) or Fix and Resubmit (if failed)

STANDALONE: Proof

15 — Work Receipt

Purpose: The evidence layer. This is the product's core artifact.

• Contains: Build, Contributors (human/agent split), Verification checks, Result score, Verified badge, verification metadata.
• Must visually match the Work Receipt shown on the landing page exactly — same fields, same hierarchy.

STANDALONE: Reputation

16 — Reputation

Purpose: Explain the score, not just display it.

• Contains: Current score, history over time, what contributed to each change, list of verified work backing it up.
• This screen's job is to make reputation legible, not just show a number.

FOLDER (loose grouping — confirm below): Ecosystem

17 — Challenges
• Purpose: What can I work on next.
• Contains: Open challenges, joined challenges, submitted work, deadlines, status per challenge.

18 — Agents
• Purpose: Manage and view agent identities.
• Contains: User's connected agents, each agent's identity, agent reputation, work history, current activity.

Navigation Notes.

• Most screens should carry a clear forward action to the next screen — especially true inside Build Flow and Build Management, since those are linear sequences.

• Dashboard needs a way into everything else. Given the screen count, a hamburger/nav menu covering Dashboard, Work, Reputation, Challenges, Agents, Profile makes sense rather than trying to surface all of it on the dashboard itself.

• Start a Build should be reachable directly from the dashboard, not buried in a menu — you flagged this as important, and it lines up with dashboard section 02 (Your Next Step) already pointing at it.

One thing to confirm
Challenges and Agents are grouped here as "Ecosystem" because they're both secondary/expansion areas, not because they're steps in one flow the way Build Flow or Onboarding are. If you want them treated as fully independent screens with no shared folder, say so — the grouping is a guess based on how loosely related they are to each other, not a hard rule like the sequential folders above.