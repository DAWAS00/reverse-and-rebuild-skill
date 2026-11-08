# Branches, pull requests and pushing

## Principles

- Work in the real project folder on a normal branch. One branch and one PR per small slice.
- Nothing is pushed before every gate passes and Codex has approved.
- Ask the user once about merge policy. Without a yes, the session pushes and opens the PR, and the user merges.
- Never force-push, skip hooks, or commit unrelated untracked folders. Leave other people's untracked files alone.
- Commit messages and PR bodies end with the attribution lines the session was given.

## Flow per slice

```bash
git checkout main && git pull --ff-only                 # start from fresh main
git checkout -b feat/p2-class-tool                      # type/phase-name
# ...tests first, code, gates, Codex review, real-window check...
git add <named files>                                   # not git add -A
git commit -m "feat(ui): class tool creates a class and starts naming" -m "Co-Authored-By: ..."
git push -u origin HEAD
gh pr create --base main --title "..." --body "..."     # what, tests, gate results, screenshots
gh pr view <n> --comments                               # comment checker reads these
gh api repos/<owner>/<repo>/pulls/<n>/comments
gh pr view <n> --json mergeable,mergeStateStatus,files
gh pr merge <n> --merge
git checkout main && git pull --ff-only
```

## Before the push (checklist)

- [ ] fmt, clippy `-D warnings`, test, doc all green; maintainability check 0 FAIL, WARN not up
- [ ] tracker validator passes if a status changed
- [ ] Codex `VERDICT: APPROVED` on this exact diff; the commit equals the reviewed diff
- [ ] real window launched and the slice exercised; screenshots saved in the docs folder
- [ ] PR body lists tests added, regression tests proven to fail first, and known limits
- [ ] no files under `.claude` other than skills and memory

## PR body shape

```markdown
## What
One or two sentences.
## Tests
Added: <names>. Regression tests proven to fail without the fix: <names>.
## Gates
fmt ✓ clippy ✓ test <n> passed ✓ doc ✓ maintainability 0 FAIL / <n> WARN
## Review
Codex: APPROVED after <n> rounds. Subagent reviews: <summary>.
## Window check
Screenshots: <paths>. Sizes: 800×500, 1280×800, 1440×900; light and dark.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## When pull requests stack

If slice B needs slice A, merge A first and branch B from the new `main`. Do not stack branches on unmerged branches unless the user asks.

## Problems seen and their fixes

| Problem | Fix |
|---|---|
| Edits to the main folder are refused because the session is pinned to a git worktree | Start a new session whose folder is the main checkout, without a worktree |
| The user wants the main folder to match the remote without merging branches | Check out `main` and `git pull --ff-only` there |
| Remote branch deleted after merge, local branch shows "ahead" | Create the next branch from `origin/main`; do not push the old one |
| Windows line endings warnings (`LF will be replaced by CRLF`) | Harmless; do not rewrite files to silence them |
| Status counts in several documents disagree | One tracker file is the only source; generate summaries and test that they match |

## Publishing a skill

A skill repo that works with `npx skills add <owner>/<repo>` or `pnpm dlx skills add <owner>/<repo>` has `skills/<skill-name>/SKILL.md` (and `references/`). Add a `package.json` with a `bin` installer if you also want `npx <package>` after `npm publish`. Test with `npx skills add <local path> --list` before creating a public repository, and ask the user before making anything public.
