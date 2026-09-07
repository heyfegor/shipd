• The Dashboard — the user's home and current state.

• The underlying product screens — where they go to actually manage work, receipts, agents, challenges, and reputation.

PART 1 — The Dashboard Hierarchy

The dashboard should have 6 primary areas

Not 10 cards. Not a wall of analytics.

01 — Identity + Reputation

Purpose: Answer: Who am I here, and what have I earned?

This is the top of the dashboard.

Contains:

• Avatar

• Name

• @username

• Primary role

• Reputation score

• Reputation status

• Reputation change

• Profile link

Example structure:

Fegor Anthony
@fegor
Product Designer

0
Reputation

Your reputation is earned through verified work.

This should be the anchor of the entire dashboard.

02 — Your Next Step

Purpose: Tell the user exactly what to do now.

This is especially important for new users.

The content changes depending on the user's state.

New user

You haven't proved anything yet.

Your reputation starts with work you actually ship. Start your first build to create a record that can be verified.

CTA: Start a build

User with work in progress

Your work is being verified

We're checking your build. Your Work Receipt will be created once verification is complete.

CTA: View verification

Returning user

Keep your record growing

Your latest verified work increased your reputation. Start another build when you're ready.

CTA: Start a build

This is a dynamic module, not a static card.

03 — Recent Verified Work

Purpose: Show the strongest evidence.

Maximum 3 items on the dashboard.

Each item:

• Build name

• Date

• Verification result

• Reputation earned

• View Work Receipt

Example:

Monad Payment Router

Verified · 92/100
+12 Reputation

View Work Receipt →

Then:

View all work

04 — Active Work

I think this should replace a separate "Verification Status" section.

Purpose: Show what is currently happening.

This can include:

• Build in progress

• Work being verified

• Human review required

• Failed verification

• Pending submission

Example:

KelPay Private Settlement

Verification in progress
3 of 5 checks complete

This gives the dashboard a sense of being alive.

05 — Reputation Activity

Purpose: Explain reputation movement.

Not a chart for the sake of having a chart.

Actual events.

Example:

+12 Reputation
Monad Payment Router verified

Today

+8 Reputation
Completed Monad Challenge

3 days ago

−2 Reputation
Verification failed

View reputation history

This makes the reputation system understandable.

06 — Explore Opportunities

This combines Active Challenges into something more useful.

The user doesn't necessarily care about "challenges" as a dashboard category.

They care about:

What can I work on next?

This can include:

• Open challenges

• Sponsored tasks

• Verification opportunities

• Community builds

Example:

Open Challenge

Build a payment experience on Monad

Ends in 4 days

View challenge

Maximum 2 on dashboard.

PART 2 — What About Agent Activity?

This needs a product decision.

I do not think Agent Activity belongs permanently on the main dashboard.

Here's why.

Shipd has two identities:

• Human identity

• Agent identity

The landing page explicitly positions agents as having their own identity and reputation.

If we permanently mix agent activity into the human dashboard, the product hierarchy becomes confusing.

Instead:

If the user has no agents

Don't show anything.

If the user has agents

Show a compact module:

Your Agents

2 agents connected to your work

1 active · 1 available

View agents →

That's enough.

Agent management deserves its own screen.

PART 3 — What Happens to Work Receipts?

Again, don't create a huge separate dashboard section.

Recent Verified Work already introduces Work Receipts.

Each verified work item links directly to its receipt.

Then the user can access:

View all Work Receipts

This prevents duplication.

The Work Receipt is too important to be treated as just another dashboard widget anyway. It deserves its own dedicated experience, exactly as the landing page positions it.

FINAL DASHBOARD STRUCTURE

Desktop / Main Dashboard

Header

• Greeting

• Quick actions

• Notifications

Section 01

Identity + Reputation

Section 02

Your Next Step

Section 03

Recent Verified Work

Section 04

Active Work

Section 05

Reputation Activity

Section 06

Explore Opportunities

Conditional

Your Agents

PART 4 — How Many Screens Should We Create?

Now we need to define the complete Dashboard Experience, not just the homepage.

I recommend 8 screens for this phase.

SCREEN 01 — Dashboard: New User / Empty State

This is the first screen users see after onboarding.

State:

• Reputation: 0

• No verified work

• No Work Receipts

• No active work

• No reputation activity

• Strong "Your Next Step"

This is arguably one of the most important screens.

SCREEN 02 — Dashboard: Active User

For someone who has:

• Verified work

• Reputation

• Active verification

• Reputation movement

This is the full dashboard state.

We need this because designing only the empty state creates a problem later.

SCREEN 03 — Start a Build

The primary action.

This is where we need to define:

What exactly does "starting a build" mean inside Shipd?

This screen is strategically important and we should not design it until we decide the build flow.

SCREEN 04 — Work Detail

A single build's overview.

Contains:

• Build information

• Status

• Contributors

• Verification progress

• Related challenge

• Work Receipt

SCREEN 05 — Work Receipt

The evidence layer.

Contains:

• Build

• Contributors

• Human / agent contribution

• Verification checks

• Scores

• Result

• Verification metadata

This should visually match the Work Receipt shown on the landing page.

SCREEN 06 — Reputation

The complete reputation view.

Contains:

• Current score

• History

• Movement

• What contributed

• Verified work

The important thing is explaining the score, not just displaying it.

SCREEN 07 — Challenges / Opportunities

Contains:

• Open challenges

• Joined challenges

• Submitted work

• Deadlines

• Status

SCREEN 08 — Agents

Contains:

• User's agents

• Agent identity

• Agent reputation

• Work history

• Current activity

My recommendation

For the immediate product design work, I would design them in this order:

Phase 1 — Core Experience

01. Dashboard Empty State
02. Dashboard Active State
03. Start a Build
04. Work Detail
05. Work Receipt

Phase 2 — Reputation System

06. Reputation

Phase 3 — Ecosystem

07. Challenges
08. Agents

 "Start a Build" cannot just be a button that opens a form.

For Shipd, we need to answer one fundamental question:

What is Shipd actually recording?

Based on the landing page, Shipd records work that was shipped, who or what contributed to it, how it was verified, and what the result was. That record becomes a Work Receipt.

So here's my recommendation.

What "Start a Build" Means in Shipd

Start a Build = Create a verifiable work record before or while the work happens.

When a user taps Start a Build, they are telling Shipd:

I'm about to work on something. Track this as a piece of work I may later want to prove.

Shipd creates a Build Record.

This is important because Shipd should not ask users to simply upload a finished project and say:

Trust me, I built this.

That would weaken the entire product.

Instead, Shipd becomes involved in the lifecycle of the work.

The Shipd Build Lifecycle

I think the core product should work like this:

01 — Start a Build

The user creates a Build Record.

They provide the basics:

• What are you building?

• What type of work is it?

• Where is the work happening?

• Are you working alone or with agents?

Example:

Build name
Monad Payment Router

What are you building?
A payment routing system for Monad applications.

Work type
Software

Work source
GitHub repository

Contributors
Fegor + Agent

Then Shipd creates the build.

Status: In Progress

02 — Connect the Work

Shipd needs evidence from where the work actually happens.

Depending on the work type:

Software

Connect:

• GitHub repository

• Repository commits

• Pull requests

• Test results

03 — Work Happens

The user goes and actually works.

Shipd doesn't need to become an IDE.

The work happens where the work naturally happens:

• GitHub

• Coding environment

• AI agent

• Development tools

Shipd observes or receives evidence.

This is critical.

Shipd is not where you do the work. Shipd is where the work becomes proof.

That may actually be one of the most important product principles we've defined.

04 — Submit for Verification

Once the work is ready:

The user taps:

Submit for verification

Shipd begins checking the work.

Potential checks:

Build

Does it actually work?

Tests

Does it pass?

Security

Are there obvious vulnerabilities?

Code Quality

Is the implementation sound?

Contribution

Who actually contributed?

• Human

• Agent

• Multiple humans

• Multiple agents

Human Review

Where required.

05 — Verification Happens

The Build Record changes:

In Progress

↓

Submitted

↓

Verifying

↓

Verified

Or:

Verification Failed

The user can see exactly what is happening.

This creates the Active Work section on the dashboard.

Now that section actually has a purpose.

Example:

KelPay Payment System

Verifying

Tests complete
Security check in progress
Contribution analysis pending

06 — Work Receipt Is Created

If verification succeeds:

Shipd generates the Work Receipt.

The receipt contains:

BUILD

What was built?

CONTRIBUTORS

Who and what contributed?

VERIFICATION

What checks passed?

RESULT

What score did it receive?

REPUTATION

What changed because of this work?

This aligns directly with the current Shipd landing page concept.

07 — Reputation Changes

Only now does reputation move.

This is important.

Not when:

• You create an account

• You start a build

• You connect GitHub

• You submit something

Reputation moves because:

Verified work produced evidence.

That creates a very clean system:

Identity
↓
Build
↓
Evidence
↓
Verification
↓
Work Receipt
↓
Reputation

My Decision

But Shipd needs to establish this immediately after:

Start a Build

Tell Shipd what you're working on. We'll create a record for it and help turn the work into something you can prove.

That solves the ambiguity.

What Happens When a New User Taps It?

This should be the actual flow.

Screen 01 — Start a Build

Headline:

What are you building?

The user enters:

• Build name

• Short description

CTA:

Continue

Screen 02 — Connect Your Work

Headline:

Where is the work happening?

For MVP:

GitHub Repository

User connects/selects repository.

CTA:

Continue

Screen 03 — Who Is Working On This?

Headline:

Who's contributing?

Options:

• Just me

• Me and AI agents

• A team

If agents:

Select or connect agent.

CTA:

Create Build

Screen 04 — Build Created

Success state.

Your build is now on Shipd.

Keep working as usual. When you're ready, submit it for verification.

Status:

In Progress

CTA:

View Build

Secondary:

Go to Dashboard

This Also Changes Our Screen Count

Earlier, I said 8 screens.

That's not enough anymore.

We now have a clearer product structure.

ONBOARDING

01 — Welcome
02 — Create Identity
03 — Set Up Profile
04 — Identity Created
All done.

DASHBOARD

05 — Dashboard Empty State
06 — Dashboard Active State

Dashboard should also have button to start a build. Very important. 

BUILD FLOW

07 — Start a Build
08 — Connect Work
09 — Add Contributors
10 — Build Created

BUILD MANAGEMENT

11 — Build Detail
12 — Submit for Verification
13 — Verification in Progress
14 — Verification Result

PROOF

15 — Work Receipt

REPUTATION

16 — Reputation

ECOSYSTEM

17 — Challenges
18 — Agents

Also hope most screens would have a button that leads to the next. And also I think the dashboard should have options to easily enter a screen.. if that means building an hamburger menu that contains all.

So this is the new direction. Let's now decide briefly what each screen contains. So I can go ahead and start writing copy and creating them one by one. Also if they are screens that should have multiples, just the way onboarding has four screens, you will let me know so that screen will have its own folder.