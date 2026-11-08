# reverse-and-rebuild

A Claude Code skill. It describes the method used to build Diagram Studio: study a program with evidence rules (observed, inferred, unknown), plan with Codex, rebuild it as a Rust/egui app in small reviewed slices, split the GUI so it stays testable, use subagents for UI and review, test the real app, and push to GitHub only after every gate passes.

## Install

```bash
npx skills add <github-owner>/reverse-and-rebuild-skill     # skills CLI
pnpm dlx skills add <github-owner>/reverse-and-rebuild-skill
npx reverse-and-rebuild-skill                                # npm installer (after npm publish): ~/.claude/skills
npx reverse-and-rebuild-skill --project                      # into ./.claude/skills
```

Then ask Claude about "reverse engineer and rebuild", or run the skill by name.

Needs Codex for the review loop: `npm install -g @openai/codex`.
