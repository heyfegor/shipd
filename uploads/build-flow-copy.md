SHIPD — BUILD FLOW COPY

===========================================
SCREEN 1 — START A BUILD
===========================================

Step 1 of 3

Headline:
What are you building?

Field: Build name
Placeholder: e.g. Monad Payment Router

Field: Description
Placeholder: A short line on what this build does. You can add more detail later.

CTA: Continue
Secondary: Cancel

---

===========================================
SCREEN 2 — CONNECT WORK
===========================================

Step 2 of 3

Headline:
Where is the work happening?

Helper text:
Connect the repository where this build actually lives. This is what gets checked when you submit for verification.

Field: Connect GitHub
CTA (if not connected): Connect GitHub
CTA (if connected): Select repository

Helper text (below field):
GitHub is the only source supported right now.

CTA: Continue
Secondary: Back

---

===========================================
SCREEN 3 — ADD CONTRIBUTORS
===========================================

Step 3 of 3

Headline:
Who's contributing?

Options (single select):
Just me
Me and AI agents
A team

If "Me and AI agents" is selected, show inline:

Sub-label: Which agent?
CTA: Connect an agent
Or: Select from your agents

If "A team" is selected, show inline:

Sub-label: Add teammates by @username

CTA: Create Build
Secondary: Back

---

===========================================
SCREEN 4 — BUILD CREATED
===========================================

Status badge: In Progress

Headline:
Your build is now on Shipd.

Body:
Keep working as usual. When you're ready, come back and submit it for verification.

CTA: View Build
Secondary: Go to Dashboard
