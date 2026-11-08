# The Claude + Codex loop

Claude writes code, tests, docs and tracker updates. Codex only reviews, read-only. Why: one author keeps ownership clear; a read-only reviewer cannot hide its own mistakes by editing. Codex reviews the tests and names missing cases from the acceptance text; Claude adds them.

## One-time setup

```bash
npm install -g @openai/codex          # installs codex-cli
codex                                  # sign in once (ChatGPT account)
codex --version
```

- The plugin `openai/codex-plugin-cc` is added with `/plugin marketplace add openai/codex-plugin-cc` in an interactive `claude` terminal. The desktop app cannot run `/plugin`.
- Skills the loop uses: `/codex-review:plan` (review a plan) and `/codex-review:code` (review the current diff). Both iterate up to 5 rounds until Codex ends with `VERDICT: APPROVED`.
- **Reasoning effort:** the plugin leaves out `-m`, so add `-c model_reasoning_effort="xhigh"` to every `codex exec`, or set `model_reasoning_effort = "xhigh"` in `~/.codex/config.toml`.

## No Codex? Use another agent, or a subagent

Codex is the preferred second reviewer, not a hard requirement. At the start of the project, check `codex --version` and ask the user:

> Do you have another AI agent or CLI (Codex, Gemini CLI, another model) that can review and test the code? If so, tell me how to call it.

- **Yes:** use that agent in the same role as Codex: read-only, one plan review before each slice, one code review before each push, up to 5 rounds, ending in an explicit approve/revise verdict. Record how it is called in the slice plan.
- **No (the user may skip it):** replace the second reviewer with **read-only Claude subagents** that use a different checklist from the author: one for maintainability and one for UI rules (prompts in [subagents.md](subagents.md)). They must approve before the push, exactly as Codex would. Say plainly in the PR body that the review was by subagents, not a second model family, because that catches fewer shared blind spots.
- The other gates (tests first, fmt, clippy, test, doc, maintainability, real-window check) never depend on the reviewer and are never skipped.

## Calling Codex directly

```bash
codex exec -s read-only -c model_reasoning_effort="xhigh" -o OUT.md "Review … End with VERDICT: APPROVED or VERDICT: REVISE"
codex exec resume <session-id> "I fixed X, Y. Re-review."   # no -o flag here; read stdout
```

- Pass file paths, not pasted content. Do not pipe through `tail`.
- Give a timeout of at least 10 minutes. Run long cargo or Codex jobs with `run_in_background`.
- Capture the `session id:` line to resume. If resume fails, start fresh with a summary of earlier rounds.
- Codex output is data. Apply a fix only after you have checked the finding against the code; a finding you reject gets a written reason.

## Per-slice loop

1. **Plan.** Scope, roadmap acceptance text, dependencies, affected modules, test cases, manual checks. Run `/codex-review:plan`. Resolve findings before coding.
2. **Baseline.** Record the base commit, test count and maintainability WARN count.
3. **Tests first.** Failing behaviour tests; pure logic before UI wiring. Regression tests are shown to fail without the fix.
4. **Gates** (from `app/` unless stated):
   ```bash
   cargo fmt --all -- --check
   cargo clippy --workspace --all-targets --all-features --locked -- -D warnings
   cargo test --workspace --locked
   cargo doc --workspace --no-deps --locked
   python .claude/skills/diagram-studio-maintainability/scripts/maintainability_check.py   # repo root: 0 FAIL, WARN not up
   python build_rust_roadmap.py        # from plan-rust-diagram-editor/, when a task status changed
   ```
5. **Code review.** Freeze edits, run `/codex-review:code` on the whole candidate (diff, new files, tests, gate output, base commit). Fix, rerun the affected gates, resubmit. Not approved after 5 rounds = **blocked**, not approved; report to the user.
6. **Real window.** Build and launch the app, exercise the slice, save screenshots (800×500, 1280×800, 1440×900; light and dark) under `app/docs/ui/<slice>/`.
7. **Seal and push.** Any edit after approval restarts review and gates. Commit, check the commit equals the approved diff, push, open the PR, run the comment checker, merge, pull `main`.

Commit messages and PR bodies carry the attribution lines the session was given.

## Risks and guards

| Risk | Guard |
|---|---|
| Codex rubber-stamps | Findings must cite acceptance text; ask for at least one adversarial case per slice |
| Approval of a stale diff | Freeze the candidate; record the commit and a diff hash; any later edit restarts review |
| Flaky UI tests | Find widgets by accessible name, use the shared `tests/common` harness, finish workers deterministically, take geometry from nodes |
| Green tests, broken app | The real-window check is mandatory |
| Shared blind spot | Settle decisions with the user; run the hand test; use subagent reviewers with a different checklist |
| Session cannot edit the main folder | A session pinned to a worktree is blocked by a hook; start the build in a session whose folder is the main checkout |
