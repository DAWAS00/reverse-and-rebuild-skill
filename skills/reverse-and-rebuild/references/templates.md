# Document templates

Copy and fill. Each lives under `app/docs/` (or the project's docs folder), never under `.claude`.

## Ideas plan (`IDEAS-PLAN.md`)

```markdown
# Ideas plan: what to build next
Date, authors (Claude + Codex pass), inputs (links).

## 1. The finding that drives everything
One paragraph. Example: "the window is not connected to the real model."

## 2. Ideas, ranked
| # | Idea | Why (target evidence vs our gap) | Who: both / Codex only / Claude only |

## 3. Risks            (5 at most, each with its guard)
## 4. Deliberately not in the first release
## 5. Decisions        | ID | Decision | Options | Recommendation |
## 6. Where Codex and I differ
## 7. Evidence limits  (what was not run or measured)
```

## Execution plan (`EXECUTION-PLAN.md`)

```markdown
## Ground rules for every phase     (work folder, order inside a phase, gates, regression tests, move-only commits)
## Phase N: name (size S/M/L, roadmap task IDs)
| Work | Files (existing exact; new marked *(new)*) | Tests |
Done when: <one observable sentence>
## New and changed UI    | Screen | Change | Rule it must keep |
## Order of work and what can run in parallel
## What this plan does not claim
```

## Workflow plan (`WORKFLOW-PLAN.md`)

Roles table; branch and PR shape; the per-slice loop with exact commands; structure rules Codex checks; the final hands-on table; risks and guards; first slices.

## Slice plan (one per slice, before coding)

```markdown
# Slice <id>: <name>   branch: <type>/<name>
Scope:            what is in; what is explicitly out
Acceptance text:  copied from the tracker
Depends on:       earlier slices
Files:            existing and new
Tests first:      list, with the expected failure for each
Manual checks:    steps in the real window
Baseline:         base commit, test count, maintainability WARN count
Done when:        gates green, Codex APPROVED, real-window check, PR merged
```

## Decision record (ADR)

```markdown
# ADR-NNN: <title>
Status: accepted   Date:
## Decisions
D1 <decision>. Options considered. Chosen: <x>. Why: <one sentence>.
## Consequences      what this forces in code, tests, UI
```

Ask the user to confirm each decision (recommendation first). Do not decide for them.

## Hand-over note (when a session cannot continue)

User's decisions; code facts behind them; full plan ready for review; what is done, not done, and why; the next command. Put it in a shared notes folder or the docs folder.

## Acceptance table (final hand test)

| Feature | Steps | Expected | Actual | Mouse | Keyboard | Undo/Redo | Errors and focus | Sizes and themes | Evidence |
|---|---|---|---|---|---|---|---|---|---|

Header: commit, build profile, OS, display scale. A failed row becomes a bug slice that starts with a regression test.

## Per-slice report (one line)

`S5 class tool · PR link · gates green · Codex APPROVED in 2 rounds · window checked at 3 sizes`
