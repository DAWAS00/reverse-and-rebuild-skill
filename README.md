# reverse-and-rebuild

A skill (a folder of plain Markdown instructions) that teaches an AI coding agent how to **study an existing program, then rebuild it as a native Rust desktop app in small, reviewed, tested steps**, and push the result to GitHub only when everything passes.

It was written from a real project: a diagram editor (UML class and sequence diagrams) rebuilt in Rust with egui after reverse engineering a commercial one. It works with any agent that can read instructions, run shell commands and use git. It is not tied to one vendor.

## What it does

The skill makes the agent work in seven ordered phases:

1. **Study** the target with strict evidence rules: every claim is *observed*, *inferred* or *unknown*; keep a question checklist and a findings table; hand-test the live program.
2. **Compare** the findings with what has been built, and run your own app to list honestly what works and what does not.
3. **Ideas plan**: ranked ideas, risks, what is left out, and numbered decisions for you to confirm.
4. **Execution plan**: phases with the exact files, tests and UI changes.
5. **Workflow plan**: who does what, the gates, and the risks of using two AI agents.
6. **Build in slices**: one branch and one pull request per slice. Tests first, then code, then format/lint/test/doc checks, then an independent review, then a check in the real window.
7. **Run the app** and test every new feature by hand, ending with a table of results.

It also covers:

- **Splitting a Rust/egui GUI** so it stays testable: separate model, canvas and storage crates; widgets only queue intents and one coordinator applies them; typed IDs instead of list positions; one module per screen.
- **Testing in layers**: pure unit tests, headless UI tests through the accessibility tree, a usability audit at three window sizes, an end-to-end journey test, then the real window.
- **Desktop UI design**: accessibility, tokens, states, keyboard, light and dark themes, window sizes.
- **Two-agent review**: a builder agent writes code and tests; a second agent (for example Codex, Gemini CLI, or read-only subagents if you have no second tool) reviews the plan before and the code after each slice.
- **Subagent prompts** for writing UI, reviewing, and reading pull request comments.
- **Git and GitHub flow**: nothing is pushed before every gate passes; you decide once whether it may merge on its own.

## Install

Needs Node.js 18 or newer. The skill is a folder, so any agent can use it.

### One command, for the agents the `skills` tool supports

```bash
npx skills add DAWAS00/reverse-and-rebuild-skill
```

With pnpm:

```bash
pnpm dlx skills add DAWAS00/reverse-and-rebuild-skill
```

Useful options:

```bash
# for you on this device (all projects), for every agent it detects, no questions
npx skills add DAWAS00/reverse-and-rebuild-skill -g --agent '*' -y

# only for the agent you name (run `npx skills add --help` for options)
npx skills add DAWAS00/reverse-and-rebuild-skill -g --agent <agent-name>

# look before installing
npx skills add DAWAS00/reverse-and-rebuild-skill --list
```

### Any other agent: copy the folder

```bash
git clone https://github.com/DAWAS00/reverse-and-rebuild-skill
```

Copy `skills/reverse-and-rebuild` into the place your agent reads skills from, or point the agent at `skills/reverse-and-rebuild/SKILL.md` (for example from your `AGENTS.md`, rules file or system prompt). Keep the `references/` folder next to `SKILL.md`; the main file links to it.

With the bundled installer (copies for Claude Code by default; `--dir` picks any folder):

```bash
node bin/install.js                       # ~/.claude/skills
node bin/install.js --project             # ./.claude/skills
node bin/install.js --dir /path/to/agent/skills
```

## Use

Ask your agent, for example:

> Reverse engineer `<program>` and rebuild it as a Rust/egui app, using the reverse-and-rebuild skill.

Or ask about any single part: "plan this with a second reviewer", "split this big egui file", "set up the push gates".

## Requirements and limits

- **Required:** git, GitHub CLI (`gh`) signed in if you want pull requests, Rust (`cargo`) for the code.
- **Optional:** a second AI agent for review (Codex: `npm install -g @openai/codex`). Without one, the skill uses read-only subagents and says so in the pull request.
- Aimed at Rust and egui. The method parts (evidence rules, plans, slices, review loop, push gates) carry over to other stacks, but the GUI and test guides are Rust-specific.
- Some file names in the guides come from the original project. Use your own names for the tracker, rules and checklist files.

## Files

```
skills/reverse-and-rebuild/SKILL.md          the main instructions
skills/reverse-and-rebuild/references/       method, templates, Codex loop, Rust GUI, desktop UI design, subagents, GitHub flow
bin/install.js                               optional copy installer
```

MIT licence.
