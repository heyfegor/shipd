SHIPD — BUILD MANAGEMENT COPY

===========================================
SCREEN 1 — BUILD DETAIL
===========================================

Status badge: In Progress / Verifying / Verified / Verification Failed

Build name: [Build name]
Description: [Description]

CONTRIBUTORS
[List of humans and/or agents attached to this build]

VERIFICATION
If not yet submitted: Not submitted for verification yet
If verifying: link through to Verification in Progress
If verified: Verified · [Score]/100 — View Work Receipt →
If failed: Verification failed — View details →

RELATED CHALLENGE (if applicable)
[Challenge name] →

CTA (when status is In Progress and not yet submitted): Submit for Verification

---

===========================================
SCREEN 2 — SUBMIT FOR VERIFICATION
===========================================

Headline:
Ready to submit this build?

Body:
Once you submit, we'll check the following. This can't be edited mid-verification, so make sure the connected repository reflects the work you want checked.

CHECKS THAT WILL RUN
Tests
Security
Code quality
Contribution split
Human review (where required)

CTA: Submit
Secondary: Back

---

===========================================
SCREEN 3 — VERIFICATION IN PROGRESS
===========================================

Status: Verifying

Build name: [Build name]

CHECKLIST (live states)
Tests — Complete
Security check — In progress
Code quality — Pending
Contribution analysis — Pending
Human review — Pending

Helper text (below checklist):
This runs automatically. You don't need to stay on this screen — we'll notify you when it's done.

No CTA. Screen may auto-advance to Verification Result once all checks complete.

---

===========================================
SCREEN 4 — VERIFICATION RESULT
===========================================

OUTCOME A — VERIFIED

Status badge: Verified

Headline:
[Build name] is verified.

Score: [Score] / 100

Body:
This is now a Work Receipt. Anyone can check it.

CTA: View Work Receipt

---

OUTCOME B — VERIFICATION FAILED

Status badge: Verification Failed

Headline:
[Build name] didn't pass verification.

Body:
Here's what didn't check out:
[Failed check] — [Reason]
[Failed check] — [Reason]

Fix what's listed and resubmit when ready.

CTA: Fix and Resubmit
Secondary: Back to Build Detail
